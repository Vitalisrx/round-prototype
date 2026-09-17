"""Verify actual public source and a browser interaction; never substitute inline HTML.
raw.githack's documented automation cookie suppresses its repository confirmation
interstitial for this synthetic browser. Human first visits may see that notice.
"""
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import quote
from playwright.sync_api import sync_playwright
import hashlib,json,os,time,traceback
ROOT=Path(__file__).resolve().parents[1]
REF=os.environ.get('PREVIEW_REF','main')
assert REF=='main' or (len(REF)==40 and all(c in '0123456789abcdef' for c in REF))
BASE='https://raw.githack.com/Vitalisrx/round-prototype/'+REF+'/'
FILES=['index.html','v5/core.js','v5/art.js','v5/style.css','v5/app.js']
report={'url':BASE+'index.html','version':'5.0.0','source_checks':[], 'browser_checks':[], 'automation_confirmation_cookie':True,'success':False}
def request(url,method='GET'):
    with urlopen(Request(url,method=method,headers={'User-Agent':'RoundV5-ReleaseVerification/1.0','Cache-Control':'no-cache'}),timeout=40) as r:
        return r.status,r.headers.get('Content-Type',''),r.read()
def check(name,c):
    if not c:raise AssertionError(name)
    report['browser_checks'].append({'name':name,'pass':True})
try:
    if REF=='main':
        report['purges']=[]
        for path in FILES:
            try:
                status,ct,b=request('https://raw.githack.com/purge?url='+quote(BASE+path,safe=''), 'DELETE')
                report['purges'].append({'path':path,'status':status})
            except Exception as e:report['purges'].append({'path':path,'error':str(e)})
    for path in FILES:
        expected=(ROOT/path).read_bytes(); matched=False; observed=''; status=0
        for attempt in range(6):
            try:
                status,content_type,data=request(BASE+path)
                observed=hashlib.sha256(data).hexdigest()
                matched=status==200 and data==expected
                if matched:break
            except Exception as e:observed=str(e)
            if attempt<5:time.sleep(8)
        entry={'path':path,'http_status':status,'matched_bytes':matched,'expected_sha256':hashlib.sha256(expected).hexdigest(),'observed_sha256_or_error':observed}
        report['source_checks'].append(entry)
        assert matched,'Public asset did not match release: '+path
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':390,'height':844})
        context.add_cookies([{'name':'__Http-phish','value':'1','domain':'raw.githack.com','path':'/','secure':True,'httpOnly':True}])
        p=context.new_page();errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
        try:
            response=p.goto(BASE+'index.html',wait_until='networkidle',timeout=60000)
            check('Actual public HTML responds 200',response.status==200)
            p.wait_for_function('window.RoundV5 && RoundV5.version === "5.0.0"',timeout=20000)
            check('Public app is V5, not legacy fallback',p.locator('meta[name="round-version"]').get_attribute('content')=='5.0.0')
            check('Actual public CSS is light theme',p.evaluate('getComputedStyle(document.body).backgroundColor')=='rgb(247, 247, 242)')
            check('Sample groups render',p.locator('.group-row').count()==6)
            p.screenshot(path=str(ROOT/'screens/public-v5-mobile.png'),full_page=True)
            p.locator('[data-action="detail"][data-id="g-spades"]').click()
            p.locator('#dialog [data-action="inspect"][data-id="p0"]').click()
            check('Public inspector is person-specific','Maya' in p.locator('#dialog').inner_text())
            p.locator('#dialog [data-action="back"]').click()
            p.locator('#dialog [data-action="join"]').click()
            check('Public joining updates actual local state',p.evaluate('Round5.G(RoundV5.snapshot()).phase')=='ready')
            p.locator('[data-action="simMeet"]').click();p.locator('[data-action="here"]').click();p.locator('[data-action="simFinish"]').click()
            check('No award before independent demo evidence',p.evaluate('Round5.ap(RoundV5.snapshot())')==60)
            for id in ['p0','p1','p2']:p.locator('#dialog input[value="'+id+'"]').check()
            p.locator('#dialog [data-action="save-report"]').click();p.locator('[data-action="simProof"]').click()
            check('Hosted reward flow reaches exactly 135 AP',p.evaluate('Round5.ap(RoundV5.snapshot())')==135)
            p.locator('#dialog [data-action="wear-new"]').click()
            p.reload(wait_until='networkidle')
            check('Public origin preserves collection on reload',p.evaluate('Round5.ap(RoundV5.snapshot())')==135)
            check('No public JavaScript errors',not errs)
        finally:
            report['page_errors']=errs
            p.screenshot(path=str(ROOT/'screens/public-v5-last.png'),full_page=True)
            browser.close()
    report['success']=True
except Exception as e:
    report['error']=str(e);report['trace']=traceback.format_exc();print(report['trace'])
finally:
    (ROOT/'tests/public-results.json').write_text(json.dumps(report,indent=2))
    print(json.dumps(report,indent=2))
if not report['success']:raise SystemExit(1)

from pathlib import Path
import re,hashlib,base64
root=Path(__file__).parent
html=(root/'index.html').read_text()
css=(root/'v5/style.css').read_text()
scripts=[(root/'v5'/n).read_text() for n in ('core.js','art.js','app.js')]
hashes=' '.join("'sha256-"+base64.b64encode(hashlib.sha256(s.encode()).digest()).decode()+"'" for s in scripts)
html=html.replace("script-src 'self';",'script-src '+hashes+';')
html=html.replace('<link rel="stylesheet" href="v5/style.css">','<style>'+css+'</style>')
for n,s in zip(('core.js','art.js','app.js'),scripts):html=html.replace('<script src="v5/'+n+'"></script>','<script>'+s+'</script>')
(root/'round_v5.html').write_text(html)
print(len(html.encode()), 'bytes')

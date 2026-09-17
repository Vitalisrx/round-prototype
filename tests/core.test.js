'use strict';
const assert=require('node:assert/strict'),C=require('../v5/core.js');const T=2000000000000;let passed=0,failed=0,results=[];
function test(name,fn){try{fn();passed++;results.push({name,pass:true})}catch(e){failed++;results.push({name,pass:false,error:e.message})}}
const seed=()=>C.seed(T),step=(s,k,d={})=>C.run(s,k,d,T).state;
function meeting(id='g-spades'){let s=step(seed(),'join',{id});if(C.G(s).phase==='forming')s=step(s,'simFill');s=step(s,'simMeet');s=step(s,'here');return step(s,'simFinish')}
function complete(ids){let s=meeting();s=step(s,'report',{ids:ids||C.G(s).members.filter(id=>id!=='me')});return C.run(s,'simProof',{},T)}
test('50 unique activity templates',()=>{assert.equal(C.catalog.length,50);assert.equal(new Set(C.catalog.map(a=>a.id)).size,50)});
test('Seed valid, 60 AP, ten groups',()=>{const s=seed();assert(C.valid(s));assert.equal(C.ap(s),60);assert.equal(s.groups.length,10)});
test('Fixture accounts are unique across active groups',()=>{const ids=seed().groups.flatMap(g=>g.members);assert.equal(ids.length,new Set(ids).size)});
test('Default exact search does not substitute',()=>{assert.equal(C.list(seed(),{activity:'spades'},T)[0].id,'g-spades');assert.equal(C.list(seed(),{activity:'gallery'},T).length,0)});
test('Reachable travel filter is honored',()=>assert(C.list(seed(),{travel:5},T).every(g=>C.V(g.venue).eta<=5)));
test('Free filter removes expected purchase',()=>assert(C.list(seed(),{free:true},T).every(g=>!C.A(g.a).paid)));
test('Duration includes trip and activity',()=>assert.equal(C.list(seed(),{duration:30},T).length,0));
test('One-step joining enters going and ready',()=>{const s=step(seed(),'join',{id:'g-spades'});assert(C.G(s).going.includes('me'));assert.equal(C.G(s).phase,'ready');assert.equal(C.ap(s),60)});
test('Second active group rejected',()=>assert.throws(()=>step(step(seed(),'join',{id:'g-spades'}),'join',{id:'g-pickle'}),/already/));
test('Wrong join mode rejected',()=>assert.throws(()=>step(seed(),'join',{id:'g-jam'}),/invitation/));
test('Pending request consumes no place',()=>{const before=seed(),s=step(before,'request',{id:'g-jam'});assert.equal(C.members(C.G(s,'g-jam')),C.members(C.G(before,'g-jam')));assert.equal(s.active,null);assert.equal(s.pending.phase,'requested')});
test('Request invitation does not silently join',()=>{let s=step(seed(),'request',{id:'g-jam'});s=step(s,'simHostAccept');assert.equal(s.pending.phase,'invited');assert(!C.G(s,'g-jam').members.includes('me'))});
test('Invitee accepts the actual plan',()=>{let s=step(seed(),'request',{id:'g-jam'});s=step(s,'simHostAccept');s=step(s,'accept');assert.equal(s.active,'g-jam');assert(C.G(s).members.includes('me'))});
test('Uninvited acceptance rejected',()=>assert.throws(()=>step(seed(),'accept',{id:'g-spades'}),/invitation/));
test('Withdraw request removes pending state',()=>{let s=step(seed(),'request',{id:'g-jam'});s=step(s,'cancelRequest');assert.equal(s.pending,null);assert.equal(C.G(s,'g-jam').requests.length,0)});
test('Unknown or expired group unavailable',()=>{assert.throws(()=>step(seed(),'join',{id:'missing'}));let s=step(seed(),'advance',{minutes:21});assert.throws(()=>step(s,'join',{id:'g-spades'}))});
test('Unreachable group cannot be joined',()=>{let s=step(seed(),'advance',{minutes:19});assert.equal(C.list(s,{},T).length,0);assert.throws(()=>step(s,'join',{id:'g-spades'}))});
test('No timer-only rewards',()=>{let s=step(seed(),'advance',{minutes:21});assert.equal(C.ap(s),60);assert.equal(s.history.length,0)});
test('Ten-player basketball and twelve-player volleyball retained',()=>{const s=seed();assert.equal(C.G(s,'g-hoops').cap,10);assert.equal(C.G(s,'g-volley').cap,12)});
test('Activity venue mismatch rejected',()=>assert.throws(()=>step(seed(),'create',{a:'soccer',venue:'table',format:0,cap:10,friends:0,mode:'open'}),/suitable/));
test('No cap-five workaround for a ten-person match',()=>assert.throws(()=>step(seed(),'create',{a:'soccer',venue:'field',format:0,cap:5,friends:0,mode:'open'}),/size/));
test('Creation automatically supplies a bounded twenty-minute window',()=>{const s=step(seed(),'create',{a:'soccer',venue:'field',format:0,cap:10,friends:3,mode:'open'}),g=C.G(s);assert.equal(g.closes-g.created,1200000);assert.equal(g.cap,10);assert.equal(C.members(g),4)});
test('No finished format inferred from host-reported friends',()=>{let s=step(seed(),'create',{a:'spades',venue:'table',format:0,cap:4,friends:2,mode:'open'});s=step(s,'simFill');s=step(s,'simMeet');s=step(s,'here');s=step(s,'simFinish');s=step(s,'report',{ids:C.G(s).members.filter(x=>x!=='me')});s=step(s,'simProof');assert.equal(s.record.full,0);assert(!s.history[0].format)});
test('Host inspection invitation awaits guest acceptance',()=>{let s=step(seed(),'create',{a:'coffee',venue:'table',format:0,cap:4,friends:0,mode:'request'});s=step(s,'simCandidate',{id:'p0'});s=step(s,'invite',{id:'p0'});assert.equal(C.members(C.G(s)),1);s=step(s,'simRSVP',{id:'p0'});assert.equal(C.members(C.G(s)),2);assert.equal(C.G(s).phase,'ready')});
test('Host cannot accept someone else’s request',()=>{let s=step(seed(),'join',{id:'g-spades'});assert.throws(()=>step(s,'invite',{id:'p9'}),/assigned/)});
test('Declining creates no public score',()=>{let s=step(seed(),'create',{a:'coffee',venue:'table',format:0,cap:4,friends:0,mode:'request'});s=step(s,'simCandidate',{id:'p0'});s=step(s,'decline',{id:'p0'});assert.equal(C.ap(s),60);assert.equal(C.G(s).members.length,1);assert(!C.G(s).requests.length)});
test('Arrival before meeting is blocked',()=>{let s=step(seed(),'join',{id:'g-spades'});assert.throws(()=>step(s,'here'),/window/)});
test('Self check-in and elapsed activity award no points',()=>assert.equal(C.ap(meeting()),60));
test('Empty, forged, and self-witness reports rejected',()=>{const s=meeting();for(const ids of [[],['fake'],['me']])assert.throws(()=>step(s,'report',{ids}))});
test('Uncorroborated report awards nothing',()=>{const s=step(meeting(),'report',{ids:['p0','p1','p2']});assert.equal(C.ap(s),60);assert.equal(C.G(s).phase,'pending')});
test('Proof requires prior self-report',()=>assert.throws(()=>step(meeting(),'simProof'),/report/));
test('Full Spades grants two relevant items, exactly 135 AP',()=>{const r=complete();assert.equal(C.ap(r.state),135);assert.deepEqual(r.earned,['cards','fourth']);assert(r.state.history[0].format)});
test('Idempotent award grants',()=>{const s=complete().state,r=C.run(s,'simProof',{},T);assert.equal(C.ap(r.state),135);assert.deepEqual(r.earned,[]);assert.equal(r.state.history.length,1)});
test('Partial confirmations do not claim full format',()=>{const s=complete(['p0']).state;assert.equal(C.ap(s),60);assert(!s.history[0].format);assert.equal(s.record.spades,2)});
test('Earned equipment only',()=>{assert.throws(()=>step(seed(),'wear',{id:'cards'}),/Earn/);assert.equal(step(complete().state,'wear',{id:'cards'}).wear,'cards')});
test('Three-item showcase limit is meaningful',()=>{const s=complete().state;assert.throws(()=>step(s,'pin',{id:'cards'}),/three/);const u=step(s,'pin',{id:'hello'});assert(step(u,'pin',{id:'cards'}).showcase.includes('cards'))});
test('Starter customization independent from AP',()=>{const s=step(seed(),'customize',{tone:4,hat:'beanie'});assert.equal(C.ap(s),60);assert.equal(s.tone,4)});
test('Chat stored as text, bounded',()=>{let s=step(seed(),'join',{id:'g-spades'});s=step(s,'chat',{text:'<img src=x onerror=alert(1)>'});assert(C.G(s).chat[0].text.startsWith('<img'));s=step(s,'chat',{text:'x'.repeat(500)});assert.equal(C.G(s).chat[1].text.length,400)});
test('Closed group chat cannot be mutated',()=>assert.throws(()=>step(complete().state,'chat',{text:'hi'}),/closed/));
test('Leave reopens capacity without deducting AP',()=>{let s=step(seed(),'join',{id:'g-spades'});s=step(s,'leave');assert.equal(s.active,null);assert.equal(C.members(C.G(s,'g-spades')),3);assert.equal(C.ap(s),60)});
test('Host exit cancels rather than silently reassigning',()=>{let s=step(seed(),'create',{a:'coffee',venue:'table',cap:4,format:0,friends:0,mode:'open'});const id=s.active;s=step(s,'leave');assert.equal(C.G(s,id).phase,'canceled')});
test('Availability is optional, limited and expires',()=>{let s=step(seed(),'queue',{ids:['coffee','walk']});assert(s.queue);s=step(s,'advance',{minutes:21});assert.equal(s.queue,null);assert.throws(()=>step(seed(),'queue',{ids:['coffee','walk','spades','jam']}),/three/)});
test('Block hides associated groups',()=>{let s=step(seed(),'block',{id:'p0'});assert(!C.list(s,{},T).some(g=>g.id==='g-spades'));assert.throws(()=>step(s,'join',{id:'g-spades'}))});
test('Invalid state rejected, failed action atomic',()=>{let s=seed();s.clock=NaN;assert(!C.valid(s));s=seed();const before=JSON.stringify(s);assert.throws(()=>step(s,'join',{id:'missing'}));assert.equal(JSON.stringify(s),before)});
let combinations=0;
for(const a of C.catalog)for(let fi=0;fi<a.formats.length;fi++){const f=a.formats[fi],v=C.venues.find(v=>v.kind===a.kind);for(let cap=1;cap<=22;cap++)for(const friends of [-1,0,1,2,3,4,cap-2,cap-1,cap,cap+1]){const should=cap>=f.min&&cap<=f.max&&friends>=0&&friends<cap-1;test(`${a.id}/${fi}: cap=${cap}, friends=${friends} [${combinations++}]`,()=>{let r,error;try{r=step(seed(),'create',{a:a.id,venue:v.id,format:fi,cap,friends,mode:'open'})}catch(e){error=e}assert.equal(!error,should);if(r){assert(C.valid(r));assert(C.members(C.G(r))<=cap);assert.equal(C.ap(r),60);assert.equal(C.G(r).closes-C.G(r).created,1200000)}})}}
const summary={version:C.VERSION,total:passed+failed,passed,failed,tableDrivenCapacityCases:combinations,handWrittenTests:passed+failed-combinations};require('node:fs').writeFileSync(require('node:path').join(__dirname,'core-results.json'),JSON.stringify({summary,failures:results.filter(x=>!x.pass)},null,2));console.log(JSON.stringify(summary));if(failed){console.error(results.filter(x=>!x.pass));process.exit(1)}

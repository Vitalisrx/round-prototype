/* Round V4. Deterministic local simulation. Not an authoritative multi-user API. */
(function(root){'use strict';
const VERSION=4, KEY='round-v4-20260916';
const venues=[
 {id:'table',name:'Common Table',kind:'Café · shared tables',types:['cards','chess','coffee','talk','focus'],distance:.3,walk:6,note:'Meet at the long table by the front window. Host-reported seating; not a reservation.'},
 {id:'court',name:'Riverside Courts',kind:'Public courts',types:['pickle','hoops'],distance:.4,walk:8,note:'Meet outside the gate marked Court 2. Court access and spare equipment are host-reported.'},
 {id:'corner',name:'Corner House',kind:'Coffee shop',types:['coffee','talk','focus','cards'],distance:.2,walk:4,note:'Meet by the front counter. Seating and any purchase requirement are not independently checked.'},
 {id:'park',name:'Willow Park',kind:'Public park',types:['walk','photo','chess','music'],distance:.35,walk:7,note:'Meet at the main entrance, beside the park sign. Route and access are host-reported.'},
 {id:'library',name:'Library Courtyard',kind:'Public shared space',types:['focus','chess','talk','photo'],distance:.45,walk:9,note:'Meet at the outdoor shared tables. Access and noise rules must be checked in a real service.'},
 {id:'market',name:'Market Hall',kind:'Food hall',types:['food','coffee','talk'],distance:.55,walk:11,note:'Meet by the central seating area. Everyone buys their own food; seating is not reserved.'}
];
const activities=[
 {id:'cards',name:'Spades',family:'Games',icon:'cards',min:4,max:4,duration:45,venue:'table',cost:'Buy your own drink',free:false,aliases:'cards card tabletop spades game',note:'Cards are out. The fourth chair is yours.',detail:'Four-player Spades. Happy to explain the rules. No stakes. The host reports bringing a deck.'},
 {id:'pickle',name:'Pickleball doubles',family:'Sports',icon:'paddle',min:4,max:4,duration:45,venue:'court',cost:'Free',free:true,aliases:'pickleball paddle doubles racket sport',note:'Casual rallies. Spare paddle here.',detail:'Relaxed doubles, not a tournament. The host reports spare paddles and an available court.'},
 {id:'coffee',name:'Coffee & company',family:'Food',icon:'cup',min:2,max:5,duration:30,venue:'corner',cost:'Buy your own drink',free:false,aliases:'coffee cafe chat conversation company drink lunch',note:'No agenda. Just a good conversation.',detail:'Stay for about half an hour. No topic prep or purchase for achievement credit. Venue rules still apply.'},
 {id:'walk',name:'A walk, no rush',family:'Outside',icon:'leaf',min:2,max:5,duration:25,venue:'park',cost:'Free',free:true,aliases:'walk stroll outdoors outside nature easy movement',note:'An easy loop. Pauses encouraged.',detail:'The host describes a paved, easy-paced loop. Accessibility has not been independently checked.'},
 {id:'talk',name:'Big ideas, small table',family:'Talk',icon:'talk',min:2,max:5,duration:35,venue:'corner',cost:'Buy your own drink',free:false,aliases:'ai artificial intelligence discussion philosophy technology tech talk ideas',note:'AI, everyday life, and a few questions.',detail:'Curiosity is enough. A conversation, not a debate competition or expertise test.'},
 {id:'chess',name:'Casual chess',family:'Games',icon:'chess',min:2,max:4,duration:30,venue:'library',cost:'Free',free:true,aliases:'chess board strategy tabletop game',note:'A board, two chairs. All levels.',detail:'Casual games, no stakes. The host reports bringing a chessboard. Experience is self-described.'},
 {id:'hoops',name:'Shoot some hoops',family:'Sports',icon:'ball',min:2,max:5,duration:40,venue:'court',cost:'Free',free:true,aliases:'basketball hoops shootaround ball sports',note:'Ball ready. No teams to pick.',detail:'A casual shootaround, not a full-sized match. Court availability is host-reported.'},
 {id:'focus',name:'Quiet company',family:'Make & focus',icon:'book',min:2,max:5,duration:40,venue:'library',cost:'Free',free:true,aliases:'study reading book cowork work code coding focus learn quiet',note:'Your book. My book. Good company.',detail:'Parallel reading or focused work. Conversation is optional. Check venue quiet-hours rules.'},
 {id:'photo',name:'A little photo walk',family:'Outside',icon:'camera',min:2,max:5,duration:30,venue:'park',cost:'Free',free:true,aliases:'photography photo camera art pictures',note:'Phone cameras count.',detail:'A short creative walk. Ask before photographing people; no photos are needed as attendance proof.'},
 {id:'music',name:'Acoustic afternoon',family:'Make & focus',icon:'music',min:2,max:5,duration:40,venue:'park',cost:'Free',free:true,aliases:'music jam guitar acoustic instrument sing',note:'Bring an instrument. Find a rhythm.',detail:'Acoustic only. Participants must respect local venue permissions and noise rules; not checked in this demo.'},
 {id:'food',name:'A quick bite',family:'Food',icon:'fork',min:2,max:5,duration:35,venue:'market',cost:'Pay for your own food',free:false,aliases:'food eat lunch dinner tacos snack meal',note:'Pick your food. Share a table.',detail:'Each person chooses and pays for their own meal. No payment collection or reservation in Round.'}
];
const people={
 maya:{name:'Maya',color:'stone',shape:'pebble',hat:'cap',rounds:18,repeat:4,bio:'Cards, odd questions, and teaching the rules.'},leo:{name:'Leo',color:'blue',shape:'capsule',hat:'none',rounds:9,repeat:3,bio:'Happy to explain. Here for the company.'},sam:{name:'Sam',color:'pearl',shape:'square',hat:'none',rounds:12,repeat:4,bio:'A good walk or one more game.'},
 alex:{name:'Alex',color:'pearl',shape:'capsule',hat:'cap',rounds:22,repeat:7,bio:'Usually have a spare paddle.'},kia:{name:'Kia',color:'stone',shape:'square',hat:'none',rounds:5,repeat:1,bio:'Casual games, no pressure.'},drew:{name:'Drew',color:'blue',shape:'pebble',hat:'none',rounds:8,repeat:2,bio:'Here for a good rally.'},
 jo:{name:'Jo',color:'stone',shape:'capsule',hat:'none',rounds:0,repeat:0,bio:'New around here. Coffee seems like a good start.'},nora:{name:'Nora',color:'pearl',shape:'pebble',hat:'none',rounds:7,repeat:2,bio:'Good coffee, better conversation.'},
 eli:{name:'Eli',color:'blue',shape:'square',hat:'none',rounds:10,repeat:4,bio:'Easy pace, taking the scenic route.'},pat:{name:'Pat',color:'stone',shape:'pebble',hat:'cap',rounds:3,repeat:1,bio:'A little fresh air.'},
 finn:{name:'Finn',color:'pearl',shape:'square',hat:'none',rounds:6,repeat:2,bio:'More questions than answers.'},beck:{name:'Beck',color:'blue',shape:'capsule',hat:'none',rounds:4,repeat:1,bio:'Curious about just about everything.'},
 ren:{name:'Ren',color:'stone',shape:'square',hat:'none',rounds:11,repeat:3,bio:'Casual chess, no clocks needed.'},
 zara:{name:'Zara',color:'pearl',shape:'pebble',hat:'cap',rounds:13,repeat:4,bio:'Come shoot around.'},dev:{name:'Dev',color:'blue',shape:'square',hat:'none',rounds:2,repeat:1,bio:'New to hoops, happy to learn.'},
 em:{name:'Em',color:'stone',shape:'capsule',hat:'none',rounds:8,repeat:3,bio:'Reading together, separately.'},sol:{name:'Sol',color:'pearl',shape:'square',hat:'none',rounds:5,repeat:2,bio:'Quiet company is still company.'}
};
const rewards=[
 {id:'hello',name:'First hello',pts:10,icon:'spark',prop:'none',target:1,metric:'rounds',label:'A beginning',rule:'One group-confirmed round.',story:'A small yes. A real beginning.'},
 {id:'again',name:'Same wavelength',pts:25,icon:'loops',prop:'none',target:3,metric:'repeatDays',label:'Good company',rule:'Meet the same mutually connected person on three distinct dates. Seeded history in this demo.',story:'From nice to meet you to good to see you.'},
 {id:'wild',name:'Wild card',pts:40,icon:'cards',prop:'cards',target:1,metric:'fullCards',label:'Cards to carry',rule:'Complete a four-player Spades round with all four registered participants confirming the format.',story:'You were the missing piece. Now you have the whole hand.'},
 {id:'rally',name:'Rally energy',pts:50,icon:'paddle',prop:'paddle',target:3,metric:'pickle',label:'A paddle to keep',rule:'Three group-confirmed pickleball rounds. Participation, not wins or skill.',story:'Not every rally has to end.'},
 {id:'plot',name:'Plot twist',pts:25,icon:'orbit',prop:'orbit',target:4,metric:'types',label:'A different orbit',rule:'Group-confirmed rounds in four distinct activity types. No travel or spending requirement.',story:'There is more than one side to you.'},
 {id:'quiet',name:'Parallel play',pts:25,icon:'book',prop:'book',target:2,metric:'focus',label:'A little notebook',rule:'Two group-confirmed focus or reading rounds. Talking is optional.',story:'Different pages. Same place.'},
 {id:'open',name:'Open question',pts:25,icon:'talk',prop:'spark',target:3,metric:'talk',label:'A spark to carry',rule:'Three group-confirmed discussion rounds. We never evaluate what you say.',story:'A good question opens a door.'},
 {id:'scenic',name:'Scenic route',pts:25,icon:'leaf',prop:'leaf',target:3,metric:'walk',label:'Room to grow',rule:'Three group-confirmed walks. No step count, pace, or distance requirement.',story:'The company was part of the route.'}
];
const A=id=>activities.find(x=>x.id===id), V=id=>venues.find(x=>x.id===id), R=id=>rewards.find(x=>x.id===id);
function seed(real=Date.now()){
 const mk=(id,a,minutes,members,total)=>({id,a,start:real+minutes*60000,deadline:real+minutes*60000,phase:'forming',members:[...members],ready:[],arrived:[],reports:{},confirmed:[],guests:0,guestsReady:false,total,min:A(a).min,venue:A(a).venue,host:members[0],note:A(a).note,chat:[],credited:false});
 return {version:VERSION,created:real,offset:0,active:null,queue:null,groups:[mk('spades','cards',18,['maya','leo','sam'],4),mk('pickleball','pickle',20,['alex','kia','drew'],4),mk('coffee','coffee',12,['jo','nora'],4),mk('walk','walk',16,['eli','pat'],4),mk('ideas','talk',20,['finn','beck'],4),mk('chess','chess',19,['ren'],2),mk('hoops','hoops',20,['zara','dev'],4),mk('reading','focus',20,['em','sol'],4)],character:{name:'Jamie',color:'pearl',shape:'pebble',hat:'none'},equipped:'none',earned:['hello','again'],metrics:{rounds:6,repeatDays:3,fullCards:0,pickle:2,focus:0,talk:0,walk:1},types:['coffee','walk','pickle'],history:[],blocked:[],connections:[],quiet:false};
}
function clock(s,real=Date.now()){return real+s.offset}
function group(s,id=s.active){return s.groups.find(p=>p.id===id)}
function count(p){return p.members.length+p.guests}
function readyCount(p){return p.ready.length+(p.guestsReady&&p.ready.includes(p.host)?p.guests:0)}
function ready(p){return readyCount(p)>=p.min}
function remain(s,p,real=Date.now()){return Math.max(0,Math.ceil((p.start-clock(s,real))/60000))}
function reachable(s,p,real=Date.now()){return p.host==='you'||p.deadline-clock(s,real)>=(V(p.venue).walk+2)*60000}
function available(s,p,real=Date.now()) {return !!p&&['forming','ready'].includes(p.phase)&&clock(s,real)<p.deadline&&count(p)<p.total&&!p.members.some(x=>s.blocked.includes(x))}
function sync(s,real=Date.now()){
 const now=clock(s,real);
 for(const p of s.groups){if(['forming','ready'].includes(p.phase)){p.phase=ready(p)?'ready':'forming';if(now>=p.start)p.phase=ready(p)?'meeting':'expired'}}
 if(s.queue&&now>=s.queue.until)s.queue=null;
 return s;
}
function search(s,f={},real=Date.now()){
 const q=(f.query||'').toLowerCase().trim().split(/\s+/).filter(Boolean);
 return s.groups.filter(p=>{const a=A(p.a),v=V(p.venue);const hay=[a.name,a.aliases,p.note,v.name].join(' ').toLowerCase();return available(s,p,real)&&!p.members.includes('you')&&reachable(s,p,real)&&(f.category===undefined||f.category==='All'||a.family===f.category)&&v.distance<=(f.radius??1)&&remain(s,p,real)<=(f.window??20)&&(!f.free||a.free)&&(!f.budget||remain(s,p,real)+a.duration<=f.budget)&&q.every(t=>hay.includes(t))}).sort((a,b)=>(b.total-count(b)===1)-(a.total-count(a)===1)||V(a.venue).walk-V(b.venue).walk);
}
function metric(s,r){return r.metric==='types'?s.types.length:s.metrics[r.metric]||0}
function points(s){return [...new Set(s.earned)].reduce((n,id)=>n+(R(id)?.pts||0),0)}
function validate(s){
 if(!s||s.version!==VERSION||!Array.isArray(s.groups)||!s.metrics||!Array.isArray(s.earned)||!Array.isArray(s.types)||!s.character||!['pearl','stone','blue','copper'].includes(s.character.color)||!['pebble','capsule','square'].includes(s.character.shape))return false;
 if(!Array.isArray(s.blocked)||!Array.isArray(s.history)||!Array.isArray(s.connections)||!Number.isFinite(s.offset)||!Number.isFinite(s.created))return false;
 if(s.equipped!=='none'&&!s.earned.includes(s.equipped))return false;
 if(new Set(s.earned).size!==s.earned.length||s.earned.some(id=>!R(id)))return false;
 for(const p of s.groups){if(!A(p.a)||!V(p.venue)||!V(p.venue).types.includes(p.a)||!Array.isArray(p.members)||!Array.isArray(p.ready)||!Array.isArray(p.arrived)||!p.reports||!Array.isArray(p.confirmed)||!Array.isArray(p.chat)||!Number.isFinite(p.start)||!Number.isFinite(p.deadline)||!Number.isInteger(p.guests)||p.guests<0||!Number.isInteger(p.total)||p.total<A(p.a).min||p.total>A(p.a).max||p.min!==A(p.a).min||count(p)>p.total||new Set(p.members).size!==p.members.length||new Set(p.ready).size!==p.ready.length||p.ready.some(x=>!p.members.includes(x)))return false;}
 if(s.active&&!group(s))return false;
 if(!['none','cap'].includes(s.character.hat)||Object.values(s.metrics).some(n=>!Number.isFinite(n)||n<0))return false;
 if(s.groups.some(p=>!['forming','ready','meeting','pending','complete','expired','canceled'].includes(p.phase)))return false;
 return true;
}
function fail(message){throw new Error(message)}
function reduce(input,type,data={},real=Date.now()){
 if(!validate(input))fail('The saved demo state is invalid. Reset the demo.');
 const s=sync(JSON.parse(JSON.stringify(input)),real),now=clock(s,real);let p=group(s),newAwards=[];
 const needActive=()=>{if(!p)fail('Choose a group first.')};
 if(type==='join'){
  if(s.active)fail('You already have a round. Release that spot first.');
  p=group(s,data.id);if(!available(s,p,real))fail('That spot is no longer open.');if(!reachable(s,p,real))fail('There is not enough time to reach this group.');
  p.members.push('you');s.active=p.id;
 }else if(type==='create'){
  if(s.active)fail('Release your current spot before opening another.');
  const a=A(data.a),v=V(data.venue);if(!a||!v||!v.types.includes(a.id))fail('Choose a suitable public meeting place.');
  if(![0,10,20].includes(data.minutes))fail('Choose now, 10, or 20 minutes.');
  if(!Number.isInteger(data.total)||data.total<a.min||data.total>a.max)fail('That group size does not fit the activity.');
  if(!Number.isInteger(data.with)||data.with<1||data.with>=data.total)fail('Leave at least one spot open.');
  const start=now+(data.minutes||10)*60000;
  p={id:'local-'+real+'-'+s.groups.length,a:a.id,start,deadline:start,hereNow:data.minutes===0,phase:'forming',members:['you'],ready:[],arrived:[],reports:{},confirmed:[],guests:data.with-1,guestsReady:false,total:data.total,min:a.min,venue:v.id,host:'you',note:String(data.note||a.note).trim().slice(0,120),chat:[],credited:false};s.groups.unshift(p);s.active=p.id;
 }else if(type==='leave'){
  needActive();if(p.phase!=='complete'){p.members=p.members.filter(x=>x!=='you');p.ready=p.ready.filter(x=>x!=='you');p.arrived=p.arrived.filter(x=>x!=='you');if(p.host==='you')p.phase='canceled';else if(['forming','ready'].includes(p.phase))p.phase=ready(p)?'ready':'forming';}s.active=null;
 }else if(type==='ready'){
  needActive();if(!['forming','ready'].includes(p.phase))fail('The ready window has ended.');if(!p.ready.includes('you'))p.ready.push('you');if(p.host==='you'&&p.guests)p.guestsReady=true;p.phase=ready(p)?'ready':'forming';
 }else if(type==='demo-fill'){
  needActive();if(!['forming','ready'].includes(p.phase))fail('This group is no longer forming.');
  while(count(p)<p.min)p.members.push('demo-'+p.id+'-'+p.members.length);
  p.ready=p.members.filter(x=>x!=='you'||p.ready.includes('you'));p.phase=ready(p)?'ready':'forming';
 }else if(type==='demo-meet'){
  needActive();if(!ready(p)||!p.ready.includes('you'))fail('You and the minimum group must be ready first.');s.offset=Math.max(s.offset,p.start-real+1);sync(s,real);
 }else if(type==='arrive'){
  needActive();if(p.phase!=='meeting')fail('The meeting window has not opened.');if(!p.arrived.includes('you'))p.arrived.push('you');
 }else if(type==='demo-end'){
  needActive();if(p.phase!=='meeting'||!p.arrived.includes('you'))fail('Check in during the meeting first.');s.offset=Math.max(s.offset,p.start+A(p.a).duration*60000-real+1);
 }else if(type==='report'){
  needActive();if(!['meeting','pending'].includes(p.phase)||!p.arrived.includes('you'))fail('Check in before reporting a completed round.');
  if(now<p.start+A(p.a).duration*60000)fail('The sample activity has not finished. Use the labeled demo time control.');
  const ids=[...new Set(data.ids||[])];if(!ids.length||ids.some(id=>id==='you'||!p.members.includes(id)))fail('Select the registered people you actually met.');p.reports.you=ids;p.phase='pending';
 }else if(type==='demo-confirm'){
  needActive();if(p.phase==='complete')return {state:s,newAwards:[]};if(p.phase!=='pending'||!p.reports.you?.length)fail('Save your own attendance report first.');
  for(const id of p.reports.you)p.reports[id]=['you',...p.reports.you.filter(x=>x!==id)];
  const mutual=p.reports.you.filter(id=>p.reports[id]?.includes('you'));
  if(!mutual.length)fail('No reciprocal confirmation yet.');p.confirmed=['you',...mutual];p.phase='complete';
  if(!p.credited){p.credited=true;s.metrics.rounds++;const format=p.min<p.total||p.confirmed.length>=p.min;const activityConfirmed=p.min===A(p.a).max?p.confirmed.length>=p.min:format;
   if(activityConfirmed){s.metrics[p.a]=(s.metrics[p.a]||0)+1;if(!s.types.includes(p.a))s.types.push(p.a);if(p.a==='cards'&&p.confirmed.length===4)s.metrics.fullCards++;}
   s.history.unshift({id:p.id,a:p.a,name:A(p.a).name,people:p.confirmed.length,format:activityConfirmed,recorded:now,source:'simulated reciprocal confirmations'});
   for(const r of rewards)if(!s.earned.includes(r.id)&&metric(s,r)>=r.target){s.earned.push(r.id);newAwards.push(r.id)}
  }
 }else if(type==='chat'){
  needActive();if(!['forming','ready','meeting','pending'].includes(p.phase))fail('This round is closed.');const text=String(data.text||'').trim().slice(0,500);if(!text)fail('Write a message first.');p.chat.push({text,from:'you',at:now});if(p.chat.length>80)p.chat.shift();
 }else if(type==='equip'){
  if(data.id!=='none'&&(!s.earned.includes(data.id)||!R(data.id)))fail('That item has not been earned.');s.equipped=data.id;
 }else if(type==='character'){
  for(const [k,choices] of Object.entries({color:['pearl','stone','blue','copper'],shape:['pebble','capsule','square'],hat:['none','cap']}))if(data[k]!==undefined){if(!choices.includes(data[k]))fail('Unknown character option.');s.character[k]=data[k]}
 }else if(type==='block'){
  if(data.id==='you'||!data.id)fail('Choose another participant.');if(p?.members.includes(data.id)&&p.phase!=='complete')fail('Leave the current round before blocking this person.');if(!s.blocked.includes(data.id))s.blocked.push(data.id);
 }else if(type==='queue'){
  if(s.active)fail('You already have a round.');const ids=[...new Set(data.ids||[])];if(!ids.length||ids.length>3||ids.some(x=>!A(x)))fail('Choose one to three activities.');s.queue={ids,until:now+20*60000};
 }else if(type==='queue-stop')s.queue=null;
 else if(type==='advance'){if(![5,21].includes(data.minutes))fail('Invalid demo clock step.');s.offset+=data.minutes*60000;sync(s,real)}
 else if(type==='quiet')s.quiet=!!data.value;
 else if(type==='connect'){if(!people[data.id])fail('Unknown sample person.');if(!s.connections.includes(data.id))s.connections.push(data.id)}
 else fail('Unknown action.');
 if(!validate(s))fail('A state invariant failed. No changes were saved.');return {state:s,newAwards};
}
const api={VERSION,KEY,venues,activities,people,rewards,A,V,R,seed,clock,group,count,readyCount,ready,remain,reachable,available,sync,search,metric,points,validate,reduce};
root.RoundCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

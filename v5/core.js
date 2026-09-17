/* Round V5 — local simulation. Real-world authority must live on an authenticated server. */
(function(root){'use strict';
const VERSION='5.0.0',KEY='round-v5-20260917';
const specs=[
 ['pickleball','Pickleball','Sports','paddle',45,'court',0,[["Doubles",4,4],["Casual hit",2,2]],'Spare paddles · easy rallies'],
 ['basketball','Basketball','Sports','ball',50,'court',0,[["3 on 3",6,6],["5 on 5",10,10],["Shootaround",2,8]],'Ball ready · all levels'],
 ['tennis','Tennis','Sports','paddle',45,'court',0,[["Singles",2,2],["Doubles",4,4]],'Bring a racket'],
 ['soccer','Soccer','Sports','ball',50,'field',0,[["5 a side",10,10],["Kickabout",3,10]],'Bring boots or sneakers'],
 ['volleyball','Volleyball','Sports','ball',50,'field',0,[["6 on 6",12,12],["Casual circle",3,8]],'A friendly game, not a tryout'],
 ['beachvolley','Beach volleyball','Sports','ball',45,'field',0,[["2 on 2",4,4],["3 on 3",6,6]],'Net availability is host-reported'],
 ['badminton','Badminton','Sports','paddle',40,'court',0,[["Singles",2,2],["Doubles",4,4]],'Bring a racket'],
 ['pingpong','Table tennis','Sports','paddle',30,'games',0,[["Singles",2,2],["Doubles",4,4]],'Paddles provided by host'],
 ['frisbee','Throw a frisbee','Sports','orbit',30,'park',0,[["Casual throws",2,8]],'No teams, just throws'],
 ['catch','Play catch','Sports','ball',30,'park',0,[["Easy throws",2,6]],'Ball reported by host'],
 ['bocce','Bocce','Sports','ball',40,'park',0,[["Open play",2,8]],'Happy to explain the rules'],
 ['discgolf','Disc golf','Sports','orbit',60,'park',0,[["Short round",2,5]],'Bring a disc · route must be checked'],
 ['spades','Spades','Games','cards',40,'cafe',1,[["Four players",4,4]],'Deck is out. Fourth chair is yours.'],
 ['chess','Chess','Games','chess',30,'library',0,[["One board",2,2],["Rotating games",2,4]],'All levels · no clock pressure'],
 ['catan','Catan','Games','dice',60,'games',1,[["Base game",3,4]],'The host has the game'],
 ['boardgames','Board games','Games','dice',45,'games',1,[["Pick a game",3,6]],'Choose a game that fits this group'],
 ['euchre','Euchre','Games','cards',40,'cafe',1,[["Four players",4,4]],'A relaxed table'],
 ['bridge','Bridge','Games','cards',45,'cafe',1,[["Four players",4,4]],'Experience is self-described'],
 ['dominoes','Dominoes','Games','dice',30,'games',0,[["Open table",2,4]],'Set reported by host'],
 ['mahjong','Mahjong','Games','dice',60,'games',1,[["Four players",4,4]],'Agree on the rules at the table'],
 ['pool','Pool','Games','ball',40,'games',1,[["Casual games",2,4]],'Venue fee may apply · no stakes'],
 ['darts','Darts','Games','target',30,'games',1,[["Casual games",2,4]],'Public venue · no stakes'],
 ['coffee','Coffee & company','Coffee & food','cup',30,'cafe',1,[["Small table",2,6]],'No agenda. Just good company.'],
 ['lunch','Lunch together','Coffee & food','fork',40,'market',1,[["Shared table",2,6]],'Pick your own food'],
 ['bite','A quick bite','Coffee & food','fork',25,'market',1,[["Shared table",2,6]],'Your food, a little company'],
 ['dessert','Something sweet','Coffee & food','cup',25,'cafe',1,[["Small table",2,6]],'Pay your own · no spending rewards'],
 ['picnic','A casual picnic','Coffee & food','leaf',40,'park',1,[["Open blanket",2,8]],'Bring your own food'],
 ['ideas','AI & big ideas','Conversation','chat',35,'cafe',1,[["Small conversation",2,6]],'Curiosity beats expertise'],
 ['spanish','Spanish conversation','Conversation','chat',30,'cafe',1,[["Practice together",2,6]],'Learning together, not a lesson'],
 ['philosophy','Big questions','Conversation','chat',35,'library',0,[["Small conversation",2,6]],'Bring a question, not a speech'],
 ['books','Talk about books','Conversation','book',35,'library',0,[["Small conversation",2,6]],'No assigned reading'],
 ['newintown','New around here','Conversation','chat',30,'cafe',1,[["Small table",2,6]],'An easy first hello'],
 ['walk','A walk, no rush','Outside','leaf',25,'park',0,[["Easy company",2,6]],'Paved loop · pauses welcome'],
 ['dogs','Dog walk','Outside','leaf',30,'park',0,[["Leashed dogs",2,6]],'Dogs stay with their people'],
 ['run','A social run','Outside','shoe',35,'park',0,[["Easy-paced group",2,8]],'Self-described pace · no distance rewards'],
 ['bike','Easy bike ride','Outside','wheel',45,'park',0,[["Social ride",2,8]],'Bring a bike and helmet'],
 ['photo','Photo walk','Outside','camera',30,'park',0,[["Phone cameras welcome",2,8]],'Ask before photographing people'],
 ['sketchwalk','Sketch walk','Outside','pen',40,'park',0,[["Stop and sketch",2,8]],'Bring any drawing materials'],
 ['jam','Acoustic jam','Make & music','music',45,'arts',0,[["Open ensemble",2,8]],'Bring an instrument · respect venue rules'],
 ['draw','Draw together','Make & music','pen',35,'arts',0,[["Small studio table",2,6]],'Any skill · bring a pencil'],
 ['write','Writing together','Make & music','pen',40,'library',0,[["Creative sprint",2,6]],'Your own project, shared momentum'],
 ['knit','Knit & chat','Make & music','loops',40,'cafe',1,[["Small circle",2,6]],'Bring your current project'],
 ['build','Build something','Make & music','code',45,'library',0,[["Open workbench",2,6]],'Bring a laptop or a small project'],
 ['read','Quiet reading','Focus & learn','book',30,'library',0,[["Quiet company",2,6]],'Your book. My book. No small talk required.'],
 ['study','Study together','Focus & learn','book',45,'library',0,[["Focus table",2,6]],'Bring your own work'],
 ['cowork','Cowork for a bit','Focus & learn','code',45,'library',0,[["Focus table",2,6]],'Work together, separately'],
 ['interview','Interview practice','Focus & learn','chat',35,'library',0,[["Peer practice",2,4]],'Practice, not professional advice'],
 ['watch','Watch the game','Out & about','ticket',60,'market',1,[["Shared screen",2,12]],'Public screen · access is host-reported'],
 ['gallery','Gallery wander','Out & about','frame',35,'arts',0,[["Small wander",2,8]],'Check opening hours and entry rules'],
 ['cleanup','Park cleanup','Out & about','leaf',40,'park',0,[["Community crew",3,20]],'Gloves recommended · no hazardous waste']
];
const catalog=specs.map(([id,name,family,icon,minutes,kind,paid,formats,note])=>({id,name,family,icon,minutes,kind,paid:!!paid,formats:formats.map(([name,min,max])=>({name,min,max})),note}));
const venues=[{id:'table',name:'Common Table',kind:'cafe',eta:5,area:'Riverside',note:'Long table by the front window',access:true},{id:'corner',name:'Corner House',kind:'cafe',eta:8,area:'Riverside',note:'Meet beside the front counter',access:true},{id:'courts',name:'Riverside Courts',kind:'court',eta:7,area:'Riverside',note:'Meet outside Court 2',access:true},{id:'field',name:'Commons Field',kind:'field',eta:10,area:'Riverside',note:'Meet beside the blue entrance gate',access:false},{id:'park',name:'Willow Park',kind:'park',eta:6,area:'Riverside',note:'Meet at the main entrance sign',access:true},{id:'games',name:'The Games Room',kind:'games',eta:8,area:'Riverside',note:'Meet at the communal tables',access:true},{id:'library',name:'Library Courtyard',kind:'library',eta:4,area:'Riverside',note:'Shared tables beside the garden',access:true},{id:'market',name:'Market Hall',kind:'market',eta:9,area:'Riverside',note:'Central seating beside the information desk',access:true},{id:'arts',name:'Arts Courtyard',kind:'arts',eta:8,area:'Riverside',note:'Meet under the courtyard awning',access:true}];
const A=id=>catalog.find(x=>x.id===id),V=id=>venues.find(x=>x.id===id);
const names=['Maya','Leo','Sam','Alex','Kia','Drew','Jo','Nora','Eli','Pat','Finn','Beck','Ren','Zara','Dev','Em','Sol','Inez','Luca','Tess','Jules','Kai','Rae','Noor','Remy','Ari','Sasha','Kit','Frankie','Ellis','Morgan','Robin','Rowan','Cam','Lee','Quinn','Casey','Jesse','Sky','Jamie','Ash','Dani','Blair','Reese','Harper','Cody','Marin','Dee','Indy','Sage','Parker','River','Billie','Charlie','Chris','Mel','Jae','Cleo','Niko','Andy','Jody','Dale','Remi','Sid','Bryn','Shay','Gray','Luz','Wren','Vale','Al','Stevie','Joss','Taylor','Adrian','Nell','Rory','Nia','Lou','Max'];
const people=Object.fromEntries(names.map((name,i)=>{const id='p'+i,spades=i===0?8:i===1?2:1+i%5,pickleball=i===3?12:2+i%4;return[id,{id,name,tone:i%5,hat:i%3===0?'cap':'none',bio:['Happy to explain the rules. Here for the company.','A casual game and a good conversation.','Always up for trying something new.','Usually have an extra paddle.','Quiet company counts too.'][i%5],pace:i%7===0?'Newcomer':'Casual',record:{rounds:spades+pickleball+3,spades,pickleball,coffee:3,types:3,repeat:2+i%4,hosted:i%5,full:1},title:i%3===0?'Table regular':i%3===1?'Curious by nature':'Same wavelength'}]}));
const rewards=[
 ['hello','First hello',10,'spark','rounds',1,'Beginnings','Your first group-confirmed round.','A small yes. A real beginning.','pin'],
 ['curious','Curious by nature',25,'orbit','types',3,'Side quests','Try three activity types with group-confirmed participation.','More than one kind of good time.','orbit'],
 ['again','Same wavelength',25,'loops','repeat',3,'Together','Meet the same mutually connected person on three distinct dates. Seeded record in this demo.','Nice to meet you becomes good to see you.','pin'],
 ['cards','Wild card',50,'cards','spades',3,'Your thing','Three group-confirmed Spades rounds. No wins or gambling.','Apparently, you are a cards person.','cards'],
 ['fourth','The missing piece',25,'puzzle','full',1,'Together','Fill the last place of an exact-format round and corroborate that the full format happened.','You made it a game.','pin'],
 ['rally','Rally energy',50,'paddle','pickleball',3,'Your thing','Three group-confirmed pickleball rounds. Participation, not skill.','Good company on the other side of the net.','paddle'],
 ['quiet','Parallel play',25,'book','read',2,'Your thing','Two group-confirmed quiet-reading rounds. Conversation is optional.','Different pages. Same place.','book'],
 ['question','Open question',25,'chat','ideas',2,'Your thing','Two group-confirmed idea discussions. We never evaluate what you said.','A good question opens a door.','spark'],
 ['root','Taking root',25,'leaf','walk',3,'Your thing','Three group-confirmed walks. No speed, steps, or distance target.','The company was part of the route.','leaf'],
 ['ensemble','Better in a band',25,'music','jam',1,'Your thing','A group-confirmed acoustic jam. No recording or performance rating.','You found a little rhythm together.','music'],
 ['starter','Make room',25,'people','hosted',1,'Together','Host a round with group-confirmed participation. Publishing alone earns nothing.','You made the first hello easier.','pin'],
 ['chapter','A good chapter',50,'ticket','rounds',20,'Beginnings','Twenty group-confirmed rounds, with no streak requirement.','A pocket full of small stories.','pin'],
 ['six','Plot twist',50,'orbit','types',6,'Side quests','Try six different activity types with group-confirmed participation.','Your usual has a few new possibilities.','orbit'],
 ['court','Home court',100,'ball','pickleball',12,'Your thing','Twelve group-confirmed pickleball rounds. Not a competitive ranking.','A familiar face, not a higher rank.','paddle'],
 ['table','The usual table',100,'cards','spades',12,'Your thing','Twelve group-confirmed Spades rounds. No consecutive-day requirement.','Different hands. Familiar company.','cards'],
 ['lens','Good eye',25,'camera','photo',2,'Your thing','Two group-confirmed photo walks. No photo upload required.','A different way to see a familiar place.','camera'],
 ['hands','Made in company',25,'pen','draw',2,'Your thing','Two group-confirmed drawing rounds. No skill judgment.','The blank page was less blank together.','pen'],
 ['help','A little better',25,'leaf','cleanup',1,'Together','One group-confirmed ordinary park cleanup. No hazardous-task rewards.','You left a little good behind.','leaf']
].map(([id,name,ap,icon,metric,goal,family,rule,story,wear])=>({id,name,ap,icon,metric,goal,family,rule,story,wear}));
const R=id=>rewards.find(r=>r.id===id),F=g=>A(g.a).formats[g.format],members=g=>g.members.length+g.guests;
function seed(t=Date.now()){
 let cursor=0;const mk=(id,a,format,n,note,mode='open')=>{const f=A(a).formats[format],ids=Array.from({length:n},()=> 'p'+cursor++);ids.forEach((id,j)=>{const r=people[id].record;r[a]=Math.max(r[a]||0,2+j%5);r.types=catalog.filter(x=>r[x.id]>0).length;r.rounds=catalog.reduce((n,x)=>n+(r[x.id]||0),0)});const venue=venues.find(v=>v.kind===A(a).kind);return{id,a,format,venue:venues.find(v=>v.kind===A(a).kind).id,host:ids[0],members:ids,guests:0,going:[...ids],guestGoing:false,requests:[],invited:[],declined:[],created:t,closes:t+20*60000,meetAt:n>=f.min?t+(venue.eta+1)*60000:null,phase:n>=f.min?'ready':'forming',mode,pace:'Casual',cap:f.max,note:note||A(a).note,chat:[],here:[],report:null,proof:[],counted:false,lastSlot:false,planVersion:1}};
 return{version:VERSION,clock:0,active:null,pending:null,groups:[mk('g-spades','spades',0,3),mk('g-pickle','pickleball',0,3),mk('g-coffee','coffee',0,2),mk('g-hoops','basketball',1,8),mk('g-walk','walk',0,2),mk('g-volley','volleyball',0,10),mk('g-chess','chess',0,1),mk('g-ideas','ideas',0,3),mk('g-jam','jam',0,3,'Acoustic circle. Looking for a little rhythm.','request'),mk('g-read','read',0,2)],record:{rounds:8,spades:2,pickleball:2,coffee:4,types:3,repeat:3,hosted:0,full:0},types:['spades','pickleball','coffee'],earned:['hello','curious','again'],wear:'none',tone:0,hat:'none',showcase:['hello','curious','again'],history:[],blocked:[],queue:null,celebrate:true,events:[]};
}
const now=(s,t=Date.now())=>t+s.clock,G=(s,id=s.active)=>s.groups.find(g=>g.id===id),isExact=g=>F(g).min===F(g).max;
const ap=s=>[...new Set(s.earned)].reduce((n,id)=>n+(R(id)?.ap||0),0),metric=(s,r)=>r.metric==='types'?s.types.length:s.record[r.metric]||0;
function enabled(s,g,t=Date.now()){return !!g&&['forming','ready','meeting'].includes(g.phase)&&now(s,t)<g.closes&&members(g)<g.cap&&!g.members.some(id=>s.blocked.includes(id))}
function reachable(s,g,t=Date.now()){return !!g&&V(g.venue).eta+1<=(g.closes-now(s,t))/60000}
function sync(s,t=Date.now()){
 for(const g of s.groups){if(g.phase==='forming'&&now(s,t)>=g.closes)g.phase='expired';if(g.phase==='ready'&&now(s,t)>=g.meetAt)g.phase='meeting'}
 if(s.queue&&now(s,t)>=s.queue.until)s.queue=null;return s;
}
function timeNeeded(s,g,t=Date.now()){const arrival=V(g.venue).eta+1;const wait=g.phase==='forming'?Math.max(arrival,(g.closes-now(s,t))/60000):Math.max(arrival,((g.meetAt||now(s,t))-now(s,t))/60000);return wait+A(g.a).minutes}
function list(s,f={},t=Date.now()){return s.groups.filter(g=>enabled(s,g,t)&&reachable(s,g,t)&&!g.members.includes('me')&&(!f.activity||g.a===f.activity)&&(!f.family||A(g.a).family===f.family)&&V(g.venue).eta<=(f.travel||15)&&(!f.free||!A(g.a).paid)&&(!f.access||V(g.venue).access)&&(!f.pace||g.pace===f.pace)&&(!f.duration||timeNeeded(s,g,t)<=f.duration)).sort((a,b)=>(b.cap-members(b)===1)-(a.cap-members(a)===1)||V(a.venue).eta-V(b.venue).eta)}
function canGo(g){return g.going.length+(g.guestGoing?g.guests:0)>=F(g).min}
function schedule(s,g,t){if(g.phase==='forming'&&canGo(g)){const eta=V(g.venue).eta+1;const target=now(s,t)+eta*60000;if(target>g.closes)throw Error('There is no longer enough time to form this group.');g.phase='ready';g.meetAt=target}}
function valid(s){
 if(!s||s.version!==VERSION||!Number.isFinite(s.clock)||!Array.isArray(s.groups)||!s.record||!Array.isArray(s.types)||!Array.isArray(s.earned)||!Array.isArray(s.blocked)||!Array.isArray(s.history)||!Array.isArray(s.events)||!Array.isArray(s.showcase))return false;
 if(!Number.isInteger(s.tone)||s.tone<0||s.tone>4||!['none','cap','beanie'].includes(s.hat)||Object.values(s.record).some(x=>!Number.isFinite(x)||x<0)||new Set(s.earned).size!==s.earned.length||s.earned.some(x=>!R(x))||s.wear!=='none'&&!s.earned.includes(s.wear)||s.showcase.some(x=>!s.earned.includes(x))||s.showcase.length>3)return false;
 for(const g of s.groups){if(!A(g.a)||!V(g.venue)||V(g.venue).kind!==A(g.a).kind||!F(g)||!Number.isInteger(g.cap)||g.cap<F(g).min||g.cap>F(g).max||!Number.isInteger(g.guests)||g.guests<0||!Array.isArray(g.members)||!Array.isArray(g.going)||!Array.isArray(g.requests)||!Array.isArray(g.invited)||!Array.isArray(g.declined)||!Array.isArray(g.here)||!Array.isArray(g.proof)||!Array.isArray(g.chat)||members(g)>g.cap||new Set(g.members).size!==g.members.length||new Set(g.going).size!==g.going.length||g.going.some(x=>!g.members.includes(x))||!Number.isFinite(g.created)||!Number.isFinite(g.closes)||g.closes!==g.created+1200000||!['forming','ready','meeting','pending','complete','expired','canceled'].includes(g.phase)||!['open','request'].includes(g.mode))return false}
 if(s.active&&(!G(s)||!G(s).members.includes('me')))return false;
 if(s.pending&&(!G(s,s.pending.id)||!['requested','invited'].includes(s.pending.phase)))return false;
 return true;
}
function run(input,type,d={},t=Date.now()){
 if(!valid(input))throw Error('Saved demo data is invalid. Reset the prototype.');const s=sync(JSON.parse(JSON.stringify(input)),t),clock=now(s,t);let g=G(s),earned=[];
 const assert=(c,m)=>{if(!c)throw Error(m)},requireGroup=()=>assert(g,'Choose a group first.');
 const occupy=(group,id)=>{assert(enabled(s,group,t)&&reachable(s,group,t),'That spot is no longer available within reach.');assert(!group.members.includes(id)&&!s.blocked.includes(id),'This person already has a place or is blocked.');if(id==='me')group.lastSlot=members(group)===group.cap-1;group.members.push(id);group.going.push(id);schedule(s,group,t)};
 if(type==='join'||type==='request'||type==='accept'){
  assert(!s.active,'You already have a group. Leave it before taking another spot.');g=G(s,d.id||s.pending?.id);assert(enabled(s,g,t)&&reachable(s,g,t),'That group is no longer joinable.');
  if(type==='request'){assert(g.mode==='request','This group is open to join.');assert(!s.pending,'You already have a pending request.');g.requests.push('me');s.pending={id:g.id,phase:'requested'}}
  else {assert(type==='accept'?(s.pending?.id===g.id&&s.pending.phase==='invited'):g.mode==='open','Review and accept your invitation first.');assert(!s.pending||s.pending.id===g.id,'Resolve your pending request first.');occupy(g,'me');s.active=g.id;s.pending=null;g.requests=g.requests.filter(x=>x!=='me');g.invited=g.invited.filter(x=>x!=='me')}
 }else if(type==='cancelRequest'){if(s.pending){g=G(s,s.pending.id);g.requests=g.requests.filter(x=>x!=='me');g.invited=g.invited.filter(x=>x!=='me');s.pending=null}}
 else if(type==='simHostAccept'){assert(s.pending?.phase==='requested','Request a place first.');g=G(s,s.pending.id);assert(enabled(s,g,t),'The invitation window has closed.');s.pending.phase='invited';g.requests=g.requests.filter(x=>x!=='me');g.invited.push('me')}
 else if(type==='create'){
  assert(!s.active&&!s.pending,'Finish or release your current group or request first.');const a=A(d.a),v=V(d.venue),f=a?.formats[d.format||0];assert(a&&v&&v.kind===a.kind&&f,'Choose an activity and a suitable public place.');const cap=d.cap??f.max;assert(Number.isInteger(cap)&&cap>=f.min&&cap<=f.max,'This size does not fit the selected format.');assert(Number.isInteger(d.friends)&&d.friends>=0&&d.friends<cap-1,'Leave at least one place open.');assert(['open','request'].includes(d.mode),'Choose open joining or requests.');const id='local-'+t+'-'+s.groups.length;
  g={id,a:a.id,format:d.format||0,venue:v.id,host:'me',members:['me'],guests:d.friends,going:['me'],guestGoing:d.friends>0,requests:[],invited:[],declined:[],created:clock,closes:clock+1200000,meetAt:null,phase:'forming',mode:d.mode,pace:d.pace||'Casual',cap,note:String(d.note||a.note).slice(0,120),chat:[],here:[],report:null,proof:[],counted:false,lastSlot:false,planVersion:1};s.groups.unshift(g);s.active=id;schedule(s,g,t);
 }else if(type==='leave'){
  requireGroup();if(g.phase!=='complete'){g.members=g.members.filter(x=>x!=='me');g.going=g.going.filter(x=>x!=='me');g.here=g.here.filter(x=>x!=='me');if(g.host==='me')g.phase='canceled';else if(['ready','meeting'].includes(g.phase)&&!canGo(g)){g.phase=clock>=g.closes?'expired':'forming';g.meetAt=null;g.planVersion++;g.note='A place reopened. Waiting for the full format again.'}}s.active=null;
 }else if(type==='simFill'){
  requireGroup();assert(g.phase==='forming','This group is not waiting for its minimum.');let i=0;while(!canGo(g)){if(members(g)<g.cap){const id='sim'+g.id+i++;g.members.push(id);g.going.push(id)}else break}assert(canGo(g),'Not enough confirmed people for this format.');schedule(s,g,t);
 }else if(type==='simCandidate'){requireGroup();assert(g.host==='me'&&enabled(s,g,t),'Only your open group can receive a sample request.');const id=d.id||'p0';assert(!g.members.includes(id)&&!g.requests.includes(id)&&!g.invited.includes(id),'Already in this group or request list.');g.requests.push(id)}
 else if(type==='invite'||type==='decline'){requireGroup();assert(g.host==='me'&&g.requests.includes(d.id),'This request is not assigned to you.');assert(enabled(s,g,t),'No available place remains.');g.requests=g.requests.filter(x=>x!==d.id);if(type==='invite')g.invited.push(d.id);else g.declined.push(d.id)}
 else if(type==='simRSVP'){requireGroup();assert(g.host==='me'&&g.invited.includes(d.id),'Invite the sample person first.');occupy(g,d.id);g.invited=g.invited.filter(x=>x!==d.id)}
 else if(type==='simMeet'){requireGroup();assert(g.phase==='ready'&&g.meetAt,'The minimum group must confirm first.');s.clock=Math.max(s.clock,g.meetAt-t+1);sync(s,t)}
 else if(type==='here'){requireGroup();assert(g.phase==='meeting','The meeting window is not open.');if(!g.here.includes('me'))g.here.push('me')}
 else if(type==='simFinish'){requireGroup();assert(g.phase==='meeting'&&g.here.includes('me'),'Check in during the meeting first.');s.clock=Math.max(s.clock,g.meetAt+A(g.a).minutes*60000-t+1)}
 else if(type==='report'){requireGroup();assert(['meeting','pending'].includes(g.phase)&&g.here.includes('me')&&clock>=g.meetAt+A(g.a).minutes*60000,'Finish the sample activity and check in before reporting.');const ids=[...new Set(d.ids||[])];assert(ids.length&&ids.every(id=>id!=='me'&&g.members.includes(id)),'Select the registered people you actually met.');g.report=ids;g.phase='pending'}
 else if(type==='simProof'){
  requireGroup();if(g.counted)return{state:s,earned:[]};assert(g.phase==='pending'&&g.report?.length,'Save your own report first.');g.proof=['me',...g.report];g.phase='complete';g.counted=true;s.record.rounds++;const format=g.proof.length>=F(g).min;if(format){s.record[g.a]=(s.record[g.a]||0)+1;if(!s.types.includes(g.a))s.types.push(g.a);if(g.lastSlot&&isExact(g)&&g.proof.length===g.cap)s.record.full++;if(g.host==='me')s.record.hosted++}
  s.history.unshift({id:g.id,a:g.a,people:g.proof.length,format,source:'Simulated reciprocal reports',at:clock});for(const r of rewards)if(!s.earned.includes(r.id)&&metric(s,r)>=r.goal){s.earned.push(r.id);earned.push(r.id)}
 }else if(type==='chat'){requireGroup();assert(['forming','ready','meeting','pending'].includes(g.phase),'This chat is closed.');const text=String(d.text||'').trim().slice(0,400);assert(text,'Write something first.');g.chat.push({text,kind:'text'});g.chat=g.chat.slice(-80)}
 else if(type==='sticker'){requireGroup();assert(['forming','ready','meeting','pending'].includes(g.phase),'This chat is closed.');g.chat.push({kind:'wave'});g.chat=g.chat.slice(-80)}
 else if(type==='wear'){assert(d.id==='none'||s.earned.includes(d.id),'Earn that item before equipping it.');s.wear=d.id}
 else if(type==='pin'){assert(s.earned.includes(d.id),'Only earned items can be showcased.');if(s.showcase.includes(d.id))s.showcase=s.showcase.filter(x=>x!==d.id);else{assert(s.showcase.length<3,'Showcase up to three. Unpin one first.');s.showcase.push(d.id)}}
 else if(type==='customize'){if(d.tone!==undefined){assert(Number.isInteger(d.tone)&&d.tone>=0&&d.tone<=4,'Unknown color.');s.tone=d.tone}if(d.hat!==undefined){assert(['none','cap','beanie'].includes(d.hat),'Unknown hat.');s.hat=d.hat}}
 else if(type==='queue'){assert(!s.active&&!s.pending,'You already have a group or request.');const ids=[...new Set(d.ids||[])];assert(ids.length&&ids.length<=3&&ids.every(id=>A(id)),'Choose one to three activities.');s.queue={ids,until:clock+1200000}}
 else if(type==='stopQueue')s.queue=null;
 else if(type==='refresh'){assert(!s.active&&!s.pending,'Close your current demo group or request first.');s.groups=seed(clock).groups;s.queue=null;}
 else if(type==='block'){assert(d.id&&d.id!=='me','Choose another account.');assert(!g?.members.includes(d.id),'Leave the shared group first.');if(!s.blocked.includes(d.id))s.blocked.push(d.id)}
 else if(type==='advance'){assert(Number.isInteger(d.minutes)&&d.minutes>0&&d.minutes<=120,'Choose a bounded demo time step.');s.clock+=d.minutes*60000;sync(s,t)}
 else if(type==='celebrate')s.celebrate=!!d.value;
 else throw Error('Unknown action.');
 s.events.push({type,at:clock});s.events=s.events.slice(-100);assert(valid(s),'State validation failed. Nothing was saved.');return{state:s,earned};
}
const api={VERSION,KEY,catalog,venues,people,rewards,A,V,R,F,G,seed,valid,run,now,ap,metric,list,enabled,reachable,members,isExact,canGo,sync,timeNeeded};root.Round5=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);

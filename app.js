const $=s=>document.querySelector(s);
const messages=$('#messages'), input=$('#prompt'), mode=$('#mode');
let attachment=null;
const STORE='hf2_memory_v1', CHAT='hf2_chat_v1';
let memory=JSON.parse(localStorage.getItem(STORE)||'{"facts":[],"preferences":[],"corrections":[]}');
let history=JSON.parse(localStorage.getItem(CHAT)||'[]');
const save=()=>{localStorage.setItem(STORE,JSON.stringify(memory));localStorage.setItem(CHAT,JSON.stringify(history));};
function addMessage(role,text,saveIt=true){
  $('#welcome')?.remove();
  const wrap=document.createElement('div');wrap.className='message '+role;
  const label=document.createElement('div');label.className='meta';label.textContent=role==='user'?'YOU':'HIGGSFIELD 2.0 · LOCAL BRAIN';
  const bubble=document.createElement('div');bubble.className='bubble';bubble.textContent=text;
  wrap.append(label,bubble);messages.append(wrap);messages.scrollTop=messages.scrollHeight;
  if(saveIt){history.push({role,text});save();}
}
function remember(text){
  const m=text.match(/(?:remember|save this|don't forget)\s+(?:that\s+)?(.+)/i);
  if(m){const fact=m[1].trim().slice(0,300);if(fact&&!memory.facts.includes(fact)){memory.facts.push(fact);memory.facts=memory.facts.slice(-80);save();return `I've saved this on this device:\n“${fact}”\n\nYou can ask me what I remember. This is stored memory, not automatic model training.`;}}
  if(/what do you remember|show.*memory|my memories/i.test(text)){
    return memory.facts.length?'Here is what I have saved on this device:\n'+memory.facts.map((x,i)=>`${i+1}. ${x}`).join('\n'):'I do not have any saved facts yet. Say “Remember that…” to save something.';
  }
  return null;
}
function inferTask(text){
  if(mode.value!=='auto')return mode.value;
  if(/video|animate|motion|reel|clip|seconds|camera movement/i.test(text))return 'video';
  if(/image|picture|photo|portrait|illustration|draw|generate.*visual/i.test(text))return 'image';
  return 'chat';
}
function plan(text,task){
  const lower=text.toLowerCase();
  const remembered=memory.facts.length?'\n\nRelevant saved context:\n'+memory.facts.slice(-8).map(x=>'• '+x).join('\n'):'';
  if(task==='image')return `IMAGE CREATION BRIEF\n\nConcept: ${text}\n\nSuggested workflow:\n1. Identify the main subject and preserve any supplied reference identity.\n2. Define composition, lens, lighting, environment and visual style.\n3. Generate a first image with the chosen image model.\n4. Review anatomy, hands, text and reference consistency.\n5. Revise only the requested details.\n\nREADY-TO-USE PROMPT\n${text}\nPhotorealistic, coherent composition, natural anatomy, detailed textures, intentional lighting, professional visual quality. Preserve the uploaded reference identity and appearance where applicable.\n\nNote: The local brain can plan and write prompts. An image model/API has not yet been connected, so this version does not render an image.`+remembered;
  if(task==='video')return `VIDEO CREATION PLAN\n\nConcept: ${text}\n\nProduction steps:\n1. Establish the subject, location and action.\n2. Create or select a starting reference frame.\n3. Specify shot size, camera movement, lighting and motion.\n4. Generate a short clip with a compatible video model.\n5. Check temporal consistency and revise.\n\nVIDEO PROMPT\n${text}\nCinematic coherent motion, stable subject identity, natural movement, consistent environment, deliberate camera movement, realistic lighting. Avoid unwanted cuts, morphing and identity drift.\n\nNote: The local brain can plan and write prompts. A video model/API has not yet been connected, so this version does not render a video.`+remembered;
  if(/learn|how do i|explain/i.test(lower))return `I'll break that down into steps, identify what is known, and separate assumptions from facts.\n\nFor this first build, my reasoning is a lightweight local rule-and-memory system, not a human-level neural brain. It can organize tasks and use saved context, but its knowledge and reasoning are limited.`+remembered;
  if(/instagram|caption|hashtag|reel/i.test(lower))return `I can help plan this as a content task. First define the audience, content angle, opening hook, visual sequence and call to action. Share the product or topic and I'll turn it into a concrete content package.`+remembered;
  return `I understand your request as:\n“${text}”\n\nI can help by breaking it into a plan, asking for missing details, and using saved context. This first version runs a small local cognitive core: intent routing, task planning and persistent memory. It is not yet a trained general-purpose language model, and it does not learn new neural weights from conversations.`+remembered;
}
function respond(text){
  const saved=remember(text);if(saved)return saved;
  const task=inferTask(text);return plan(text,task);
}
function send(text=input.value.trim()){
  if(!text&&!attachment)return;
  const userText=text+(attachment?`\n[Attached reference: ${attachment.name}]`:'');
  addMessage('user',userText);input.value='';input.style.height='auto';
  const result=respond(text||'Please inspect my uploaded reference and help me plan a creation.');
  setTimeout(()=>addMessage('assistant',result),180);
  if(attachment){attachment=null;$('#attachment').classList.add('hidden');$('#attachment').innerHTML='';}
}
$('#sendBtn').addEventListener('click',()=>send());
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,120)+'px';});
document.querySelectorAll('.suggestion').forEach(b=>b.addEventListener('click',()=>{input.value=b.textContent;send();}));
$('#clearBtn').addEventListener('click',()=>{history=[];save();messages.innerHTML='';const w=document.createElement('section');w.className='welcome';w.id='welcome';w.innerHTML='<div class="orb">✳</div><h1>One brain.<br><span>Many abilities.</span></h1><p>Chat, plan, remember, and prepare image or video creations in one conversation.</p>';messages.append(w);});
$('#fileInput').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;attachment=f;const box=$('#attachment');box.classList.remove('hidden');box.textContent='Attached: '+f.name;
 if(f.type.startsWith('image/')){const img=document.createElement('img');img.src=URL.createObjectURL(f);box.append(img);}
 else if(f.type.startsWith('video/')){const v=document.createElement('video');v.controls=true;v.src=URL.createObjectURL(f);box.append(v);}
});
history.forEach(m=>addMessage(m.role,m.text,false));
if(history.length)$('#welcome')?.remove();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

let context,musicGain,musicNodes=[];
const audioContext=()=>context ||= new (window.AudioContext||window.webkitAudioContext)();

export function sound(kind,muted,volume=.7){if(muted||volume<=0)return;try{const audio=audioContext();audio.resume();const frequencies={click:330,start:440,earn:660,loss:165,xp:880,achievement:1046,rank:1320,warning:220,success:784,coin:988,repair:520,retry:247};const notes=kind==='repair'?[1,.75,1.25]:kind==='retry'?[1,.9]:[1,1.25];notes.forEach((ratio,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.075;o.type=kind==='repair'?'triangle':'sine';o.frequency.value=(frequencies[kind]||440)*ratio;g.gain.setValueAtTime((kind==='retry'?.022:.035)*Math.max(0,Math.min(1,volume)),t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.16);});}catch{/* Audio is optional. */}}

export function setMusic(muted,volume=.35){try{
 const audio=audioContext(),level=muted?0:Math.max(0,Math.min(1,volume))*.012;
 if(!musicGain){musicGain=audio.createGain();musicGain.gain.value=0;musicGain.connect(audio.destination);musicNodes=[110,165].map((frequency,index)=>{const oscillator=audio.createOscillator();const filter=audio.createBiquadFilter();oscillator.type=index?'sine':'triangle';oscillator.frequency.value=frequency;filter.type='lowpass';filter.frequency.value=320;oscillator.connect(filter);filter.connect(musicGain);oscillator.start();return oscillator;});}
 if(!muted)audio.resume();musicGain.gain.cancelScheduledValues(audio.currentTime);musicGain.gain.linearRampToValueAtTime(level,audio.currentTime+.18);
 }catch{/* Audio is optional. */}}

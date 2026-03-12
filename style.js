/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=(mx-6)+'px';
  cursor.style.top=(my-6)+'px';
});
function animateRing(){
  rx+=(mx-rx-20)*.12;
  ry+=(my-ry-20)*.12;
  cursorRing.style.left=rx+'px';
  cursorRing.style.top=ry+'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ── 3D CANVAS BACKGROUND ── */
const canvas=document.getElementById('bg-canvas');
const ctx=canvas.getContext('2d');
let W,H,nodes=[];
function resize(){
  W=canvas.width=window.innerWidth;
  H=canvas.height=window.innerHeight;
}
resize();
window.addEventListener('resize',()=>{resize();initNodes();});

class Node{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.z=Math.random()*800+200;
    this.vx=(Math.random()-.5)*.4;
    this.vy=(Math.random()-.5)*.4;
    this.r=Math.random()*2+1;
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    if(this.x<0||this.x>W)this.vx*=-1;
    if(this.y<0||this.y>H)this.vy*=-1;
  }
  draw(){
    const scale=400/this.z;
    const px=(this.x-W/2)*scale+W/2;
    const py=(this.y-H/2)*scale+H/2;
    const sr=this.r*scale;
    const alpha=Math.min(1,scale*0.8);
    ctx.beginPath();
    ctx.arc(px,py,sr,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,130,228,${alpha*0.7})`;
    ctx.fill();
    return {px,py,alpha,scale};
  }
}

function initNodes(){
  nodes=[];
  const count=Math.floor(W*H/18000);
  for(let i=0;i<count;i++)nodes.push(new Node());
}
initNodes();

let mouseX=W/2,mouseY=H/2;
document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});

function drawFrame(){
  ctx.clearRect(0,0,W,H);
  
  // subtle grid
  ctx.strokeStyle='rgba(0,130,228,0.03)';
  ctx.lineWidth=1;
  const gs=80;
  for(let x=0;x<W;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  const positions=nodes.map(n=>{n.update();return n.draw();});
  
  // connections
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=positions[i],b=positions[j];
      const dx=a.px-b.px,dy=a.py-b.py;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<130){
        const alpha=(1-dist/130)*0.25*Math.min(a.alpha,b.alpha);
        ctx.beginPath();
        ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);
        ctx.strokeStyle=`rgba(0,130,228,${alpha})`;
        ctx.lineWidth=0.8;
        ctx.stroke();
      }
    }
  }

  // mouse repulse glow
  const grd=ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,200);
  grd.addColorStop(0,'rgba(0,130,228,0.06)');
  grd.addColorStop(1,'transparent');
  ctx.fillStyle=grd;
  ctx.fillRect(0,0,W,H);

  requestAnimationFrame(drawFrame);
}
drawFrame();

/* ── 3D CARD TILT ── */
const profileCard=document.getElementById('profileCard');
const profile3d=document.getElementById('profile3d');
if(profile3d){
  profile3d.addEventListener('mousemove',e=>{
    const r=profile3d.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*20;
    const y=-((e.clientY-r.top)/r.height-.5)*20;
    profileCard.style.transform=`rotateY(${x}deg) rotateX(${y}deg)`;
  });
  profile3d.addEventListener('mouseleave',()=>{
    profileCard.style.transform='rotateY(0) rotateX(0)';
  });
}

/* ── NAV SCROLL ── */
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',scrollY>50);
  let cur='';
  document.querySelectorAll('section').forEach(s=>{
    if(scrollY>=s.offsetTop-140)cur=s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active',a.getAttribute('href').includes(cur));
  });
});

/* ── REVEAL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el){
  const target=+el.dataset.target;
  let start=0;
  const step=()=>{
    start+=Math.ceil(target/20);
    if(start>=target){el.textContent=target+'+';return;}
    el.textContent=start;
    requestAnimationFrame(step);
  };
  step();
}
const cobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCounter(e.target);
      cobs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>cobs.observe(el));

/* ── CONTACT FORM ── */
const form=document.getElementById('contactForm');
const toast=document.getElementById('toast');
form.addEventListener('submit',e=>{
  e.preventDefault();
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3500);
  form.reset();
});

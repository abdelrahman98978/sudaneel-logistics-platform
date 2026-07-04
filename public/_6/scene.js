// Three.js Particle Globe Scene
function initScene(){
const canvas=document.getElementById('heroCanvas');
if(!canvas)return;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z=4;
let renderer;
try{
renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
}catch(e){
console.warn("WebGL not supported, using CSS gradient fallback.");
canvas.style.display='none';
return;
}
const isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(isMobile?1:Math.min(window.devicePixelRatio,2));

// Particle Globe
const geo=new THREE.BufferGeometry();
const count=6000;
const pos=new Float32Array(count*3);
const colors=new Float32Array(count*3);
for(let i=0;i<count;i++){
const phi=Math.acos(2*Math.random()-1);
const theta=2*Math.PI*Math.random();
const r=1.8+Math.random()*0.15;
pos[i*3]=r*Math.sin(phi)*Math.cos(theta);
pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
pos[i*3+2]=r*Math.cos(phi);
const isGold=Math.random()>0.7;
colors[i*3]=isGold?0.83:0.04;
colors[i*3+1]=isGold?0.69:0.1;
colors[i*3+2]=isGold?0.22:0.24;
}
geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
const mat=new THREE.PointsMaterial({size:0.018,vertexColors:true,transparent:true,opacity:0.85,sizeAttenuation:true});
const globe=new THREE.Points(geo,mat);
scene.add(globe);

// Connection Lines
const lineGeo=new THREE.BufferGeometry();
const linePos=[];
for(let i=0;i<80;i++){
const i1=Math.floor(Math.random()*count)*3;
const i2=Math.floor(Math.random()*count)*3;
linePos.push(pos[i1],pos[i1+1],pos[i1+2],pos[i2],pos[i2+1],pos[i2+2]);
}
lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(linePos,3));
const lineMat=new THREE.LineBasicMaterial({color:0xd4af37,transparent:true,opacity:0.95});
scene.add(new THREE.LineSegments(lineGeo,lineMat));

// Ring
const ring=new THREE.Mesh(
new THREE.TorusGeometry(2.2,0.008,16,100),
new THREE.MeshBasicMaterial({color:0xd4af37,transparent:true,opacity:0.9})
);
ring.rotation.x=Math.PI/3;
scene.add(ring);
const ring2=ring.clone();
ring2.rotation.x=Math.PI/2.2;
ring2.rotation.z=0.5;
ring2.material=ring.material.clone();
ring2.material.opacity=0.9;
scene.add(ring2);

// Mouse
let mx=0,my=0;
window.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-0.5)*0.5;my=(e.clientY/window.innerHeight-0.5)*0.5;});
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});

// Animate
function tick(){
requestAnimationFrame(tick);
globe.rotation.y+=0.002;
globe.rotation.x=my*0.3;
ring.rotation.z+=0.003;
ring2.rotation.z-=0.002;
camera.position.x+=(mx*1.5-camera.position.x)*0.02;
camera.position.y+=(-my*1.0-camera.position.y)*0.02;
camera.lookAt(0,0,0);
renderer.render(scene,camera);
}
tick();
initWhyScene();
return{globe,ring,ring2,camera};
}

function initWhyScene(){
  const canvas=document.getElementById('whyCanvas');
  if(!canvas)return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(50,1,0.1,100);
  camera.position.z=5;
  
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  }catch(e){
    canvas.style.display='none';
    return;
  }
  renderer.setSize(350,350);
  const isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  renderer.setPixelRatio(isMobile?1:Math.min(window.devicePixelRatio,2));
  
  // Custom destination particles
  const geo=new THREE.BufferGeometry();
  const count=1200;
  const pos=new Float32Array(count*3);
  const colors=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const phi=Math.acos(2*Math.random()-1);
    const theta=2*Math.PI*Math.random();
    const r=1.6+Math.random()*0.08;
    pos[i*3]=r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
    pos[i*3+2]=r*Math.cos(phi);
    
    // Gold particles styling
    colors[i*3]=0.83; // Gold R
    colors[i*3+1]=0.69; // Gold G
    colors[i*3+2]=0.22; // Gold B
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  
  const mat=new THREE.PointsMaterial({size:0.025,vertexColors:true,transparent:true,opacity:0.8,sizeAttenuation:true});
  const sphere=new THREE.Points(geo,mat);
  scene.add(sphere);
  
  // Glowing connections
  const lineGeo=new THREE.BufferGeometry();
  const linePos=[];
  for(let i=0;i<30;i++){
    const i1=Math.floor(Math.random()*count)*3;
    const i2=Math.floor(Math.random()*count)*3;
    linePos.push(pos[i1],pos[i1+1],pos[i1+2],pos[i2],pos[i2+1],pos[i2+2]);
  }
  lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(linePos,3));
  const lineMat=new THREE.LineBasicMaterial({color:0xd4af37,transparent:true,opacity:0.95});
  const network=new THREE.LineSegments(lineGeo,lineMat);
  scene.add(network);
  
  // Orbit Ring
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(1.85,0.005,16,80),
    new THREE.MeshBasicMaterial({color:0xd4af37,transparent:true,opacity:0.9})
  );
  ring.rotation.x=Math.PI/3;
  scene.add(ring);
  
  // Parallax rotation
  let mx=0,my=0;
  window.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth-0.5)*0.5;
    my=(e.clientY/window.innerHeight-0.5)*0.5;
  });
  
  function tickWhy(){
    requestAnimationFrame(tickWhy);
    sphere.rotation.y+=0.0035;
    sphere.rotation.x+=0.001;
    network.rotation.y+=0.0035;
    network.rotation.x+=0.001;
    ring.rotation.z+=0.002;
    
    camera.position.x+=(mx*1.0-camera.position.x)*0.05;
    camera.position.y+=(-my*1.0-camera.position.y)*0.05;
    camera.lookAt(0,0,0);
    
    renderer.render(scene,camera);
  }
  tickWhy();
}

gsap.registerPlugin(ScrollTrigger);

/* â”€â”€â”€â”€â”€ SCROLL NAV & UTILS â”€â”€â”€â”€â”€ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* â”€â”€â”€â”€â”€ CARD ENTRANCE & INITIALIZATION â”€â”€â”€â”€â”€ */
function checkCardVisibility() {
  document.querySelectorAll('.card').forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.88) {
      card.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', checkCardVisibility);
window.addEventListener('DOMContentLoaded', checkCardVisibility);

/* â”€â”€â”€â”€â”€ 3D TILT EFFECT FOR HERO AVATAR â”€â”€â”€â”€â”€ */
const avatarFrame = document.querySelector('.avatar-frame');
if (avatarFrame) {
  avatarFrame.addEventListener('mousemove', e => {
    const rect = avatarFrame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    const ax = -(y / rect.height) * 15; // Max 15 degree X tilt
    const ay = (x / rect.width) * 15;  // Max 15 degree Y tilt
    avatarFrame.style.transform = `rotateX(${ax}deg) rotateY(${ay}deg)`;
    
    const img = avatarFrame.querySelector('img');
    if (img) {
      img.style.transform = `translateZ(20px) scale(1.05)`;
    }
  });
  
  avatarFrame.addEventListener('mouseleave', () => {
    avatarFrame.style.transform = `rotateX(0deg) rotateY(0deg)`;
    const img = avatarFrame.querySelector('img');
    if (img) {
      img.style.transform = `translateZ(0px) scale(1)`;
    }
  });
}

/* â”€â”€â”€â”€â”€ THREE.JS SETUP â”€â”€â”€â”€â”€ */
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;

/* SCENE */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070503);
scene.fog = new THREE.FogExp2(0x070503, 0.038);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.4, 4.8);
camera.lookAt(0, 1.2, 0);

/* LIGHTS */
scene.add(new THREE.AmbientLight(0x1a1005, 0.35));

const deskLamp = new THREE.PointLight(0xff8c30, 4.0, 5.5);
deskLamp.position.set(-1.45, 1.65, 0.5);
deskLamp.castShadow = true;
scene.add(deskLamp);

const rimLight = new THREE.DirectionalLight(0x304878, 0.45);
rimLight.position.set(2, 3, -2);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0x1a3040, 0.9, 9);
fillLight.position.set(2.5, 2, 2);
scene.add(fillLight);

const screenGlow = new THREE.PointLight(0x2060b0, 1.4, 3.5);
screenGlow.position.set(1.3, 1.5, -0.3);
scene.add(screenGlow);

/* ADD MORE LIGHT ON THE CHARACTER */
const charLight = new THREE.PointLight(0xffebd6, 3.8, 4.2);
charLight.position.set(-0.6, 1.5, 1.4);
charLight.castShadow = true;
scene.add(charLight);

/* HELPERS & MATERIALS */
const mat = (c, r=0.7, m=0) => new THREE.MeshStandardMaterial({ color:c, roughness:r, metalness:m });
const group = new THREE.Group();
scene.add(group);

/* DESK */
const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 1.7), mat(0x3a2510, 0.6, 0.1));
desk.position.set(0, 0.5, 0.3);
desk.receiveShadow = true;
group.add(desk);

/* WALLS / FLOOR */
const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), mat(0x120e09, 0.95));
wallBack.position.set(0, 2, -1.6);
group.add(wallBack);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), mat(0x0b0806, 0.95));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.22;
floor.receiveShadow = true;
group.add(floor);

/* SHELF & BOOKS */
const shelfMat = mat(0x4a3018, 0.7, 0.05);
for (let i = 0; i < 3; i++) {
  const s = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.055, 0.3), shelfMat);
  s.position.set(-1.55, 1.38 + i * 0.56, -0.82);
  group.add(s);
}
[0x8b2020, 0x204080, 0x206040, 0x806020, 0x602060, 0x305050].forEach((c, i) => {
  const bk = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.33+Math.random()*0.1, 0.22), mat(c, 0.9));
  bk.position.set(-1.74 + i*0.15, 1.62, -0.83);
  group.add(bk);
});

/* COFFEE MUG */
const mugGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.17, 20);
const mug = new THREE.Mesh(mugGeo, mat(0xddd0b8, 0.45, 0.05));
mug.position.set(-0.55, 0.585, 0.6);
mug.castShadow = true;
mug.userData.isMug = true;
group.add(mug);

const mugCoffee = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.01, 16), mat(0x3a1a08, 0.9));
mugCoffee.position.set(-0.55, 0.675, 0.6);
group.add(mugCoffee);

/* MUG HANDLE */
const handlePts = [];
for (let a = 0; a <= Math.PI; a += Math.PI/8) {
  handlePts.push(new THREE.Vector3(Math.cos(a)*0.055, Math.sin(a)*0.058 - 0.002, 0));
}
const handleGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(handlePts), 12, 0.012, 8);
const mugHandle = new THREE.Mesh(handleGeo, mat(0xddd0b8, 0.45));
mugHandle.position.set(-0.44, 0.575, 0.6);
mugHandle.userData.isMug = true;
group.add(mugHandle);

/* STEAM PARTICLES */
const steamArr = [];
for (let i = 0; i < 9; i++) {
  const sm = new THREE.Mesh(
    new THREE.SphereGeometry(0.013, 6, 6),
    new THREE.MeshStandardMaterial({ color:0xffffff, transparent:true, opacity:0.12 })
  );
  sm.position.set(-0.55 + (Math.random()-0.5)*0.04, 0.69 + i*0.075, 0.6);
  sm.userData.baseY = sm.position.y;
  scene.add(sm);
  steamArr.push(sm);
}

/* LAPTOP */
const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.018, 0.46), mat(0x252525, 0.3, 0.8));
laptopBase.position.set(0.9, 0.54, 0.52);
group.add(laptopBase);

const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.4, 0.014), mat(0x252525, 0.3, 0.8));
laptopLid.position.set(0.9, 0.75, 0.31);
laptopLid.rotation.x = Math.PI * 0.14;
group.add(laptopLid);

const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.005),
  new THREE.MeshStandardMaterial({ color:0x182a45, emissive:0x0e1c30, emissiveIntensity:0.55, roughness:0.1 }));
laptopScreen.position.set(0.9, 0.75, 0.315);
laptopScreen.rotation.x = Math.PI * 0.14;
group.add(laptopScreen);

/* MONITOR */
const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 8), mat(0x1a1a1a, 0.5, 0.7));
monitorStand.position.set(1.2, 0.64, -0.22);
group.add(monitorStand);

const monitorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.64, 0.04), mat(0x1a1a1a, 0.4, 0.7));
monitorMesh.position.set(1.2, 1.13, -0.24);
group.add(monitorMesh);

const monitorScreen = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.58, 0.005),
  new THREE.MeshStandardMaterial({ color:0x0c1824, emissive:0x091225, emissiveIntensity:0.85, roughness:0.08 }));
monitorScreen.position.set(1.2, 1.13, -0.215);
group.add(monitorScreen);

/* LAMP */
const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.65, 8), mat(0x3a3028, 0.4, 0.6));
lampPole.position.set(-1.4, 0.82, 0.5);
group.add(lampPole);

const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.18, 14), mat(0x5a4830, 0.5, 0.3));
lampHead.position.set(-1.32, 1.22, 0.5);
lampHead.rotation.z = 0.3;
group.add(lampHead);

const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10),
  new THREE.MeshStandardMaterial({ color:0xffcc60, emissive:0xffaa30, emissiveIntensity:3.5 }));
lampBulb.position.set(-1.26, 1.15, 0.5);
group.add(lampBulb);


/* â”€â”€ GEOMETRIC AVATAR (RESTORED) â”€â”€ */
const headGroup = new THREE.Group();
headGroup.position.set(-0.6, 1.22, 0.85);
group.add(headGroup);

const skinMat = new THREE.MeshStandardMaterial({ color:0xc8a080, roughness:0.65, metalness:0.0 });

const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 32, 24), skinMat);
headGroup.add(head);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.11, 14), skinMat);
neck.position.set(0, -0.165, 0);
headGroup.add(neck);

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.25, 0.52, 18), mat(0x191919, 0.9));
body.position.set(0, -0.37, 0);
headGroup.add(body);

/* Eyes */
[[-0.082,0.033,0.183],[0.082,0.033,0.183]].forEach(([x,y,z]) => {
  const eg = new THREE.Group(); eg.position.set(x,y,z);
  eg.add(new THREE.Mesh(new THREE.SphereGeometry(0.033,12,12), new THREE.MeshStandardMaterial({color:0xffffff})));
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.017,8,8), new THREE.MeshStandardMaterial({color:0x120600}));
  p.position.z = 0.018; eg.add(p); headGroup.add(eg);
});

/* Glasses */
const glassesGroup = new THREE.Group();
[[-0.082,0.033,0.205],[0.082,0.033,0.205]].forEach(([x,y,z]) => {
  const fr = new THREE.Mesh(new THREE.TorusGeometry(0.04,0.006,8,22), mat(0x100c06, 0.5, 0.3));
  fr.position.set(x,y,z); fr.rotation.x = 0.05; glassesGroup.add(fr);
});
const br = new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.003,0.048,6), mat(0x100c06, 0.5, 0.3));
br.rotation.z = Math.PI/2; br.position.set(0, 0.033, 0.206); glassesGroup.add(br);
headGroup.add(glassesGroup);

/* Beard */
const beard = new THREE.Mesh(
  new THREE.SphereGeometry(0.115, 16, 12, 0, Math.PI*2, 0.52, Math.PI*0.38),
  new THREE.MeshStandardMaterial({ color:0x1a0f08, roughness:0.95 })
);
beard.position.set(0, -0.055, 0.14); beard.rotation.x = 0.28;
headGroup.add(beard);

/* Eyebrows */
[[-0.082,0.09,0.185],[0.082,0.09,0.185]].forEach(([x,y,z]) => {
  const eb = new THREE.Mesh(new THREE.BoxGeometry(0.055,0.008,0.015), mat(0x1a0f08, 0.9));
  eb.position.set(x,y,z); headGroup.add(eb);
});


/* â”€â”€â”€â”€â”€ MOUSE TRACKING â”€â”€â”€â”€â”€ */
const mouse = { x:0, y:0 };
const targetRot = { x:0, y:0 };
const curRot = { x:0, y:0 };

document.addEventListener('mousemove', e => {
  mouse.x = (e.clientX/window.innerWidth  - 0.5) * 2;
  mouse.y = -(e.clientY/window.innerHeight - 0.5) * 2;
  targetRot.y = mouse.x * 0.35;
  targetRot.x = mouse.y * 0.20;
  
  const g = document.getElementById('cursor-glow');
  if (g) {
    g.style.left = e.clientX + 'px';
    g.style.top  = e.clientY + 'px';
  }
});

/* â”€â”€â”€â”€â”€ SCROLLBAR UPDATE â”€â”€â”€â”€â”€ */
window.addEventListener('scroll', () => {
  const maxS = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxS > 0 ? (window.scrollY / maxS * 100) : 0;
  
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = progress + '%';
  
  const hint = document.getElementById('scroll-hint');
  if (hint) hint.style.opacity = window.scrollY > 80 ? '0' : '1';
});

/* â”€â”€â”€â”€â”€ RAYCASTER (mug click) â”€â”€â”€â”€â”€ */
const rc = new THREE.Raycaster();
const m2 = new THREE.Vector2();

renderer.domElement.addEventListener('click', e => {
  m2.x = (e.clientX/window.innerWidth)*2 - 1;
  m2.y = -(e.clientY/window.innerHeight)*2 + 1;
  rc.setFromCamera(m2, camera);
  const intersects = rc.intersectObjects(group.children, true);
  if (intersects.find(h => h.object.userData.isMug)) {
    showContact();
  }
});

renderer.domElement.addEventListener('mousemove', e => {
  m2.x = (e.clientX/window.innerWidth)*2 - 1;
  m2.y = -(e.clientY/window.innerHeight)*2 + 1;
  rc.setFromCamera(m2, camera);
  const intersects = rc.intersectObjects(group.children, true);
  document.body.style.cursor = intersects.find(h => h.object.userData.isMug) ? 'pointer' : 'default';
});

/* â”€â”€â”€â”€â”€ CAMERA WAYPOINTS â”€â”€â”€â”€â”€ */
const waypoints = [
  { p:[0,1.45,4.8],  l:[0,1.2,0]    },
  { p:[-1.0,1.4,4.0],l:[-0.4,1.1,0] },
  { p:[0.9,1.5,4.0], l:[0.4,1.1,0]  },
  { p:[-0.6,1.6,3.8],l:[0,1.2,0]    },
  { p:[0,1.75,3.4],  l:[0,1.1,0]    },
];
let camIdx = 0;

document.querySelectorAll('.section').forEach((sec, i) => {
  ScrollTrigger.create({
    trigger: sec, start:'top 65%',
    onEnter:     () => { camIdx = Math.min(i+1, waypoints.length-1); },
    onEnterBack: () => { camIdx = Math.max(i-1, 0); }
  });
});

/* â”€â”€â”€â”€â”€ ANIMATION LOOP â”€â”€â”€â”€â”€ */
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.016;

  curRot.x += (targetRot.x - curRot.x) * 0.055;
  curRot.y += (targetRot.y - curRot.y) * 0.055;
  
  // Rotate head and neck group based on mouse coordinates for motion sensing
  headGroup.rotation.y = curRot.y;
  headGroup.rotation.x = curRot.x * 0.45;

  const wp = waypoints[camIdx];
  camera.position.x += (wp.p[0] - camera.position.x) * 0.038;
  camera.position.y += (wp.p[1] - camera.position.y) * 0.038;
  camera.position.z += (wp.p[2] - camera.position.z) * 0.038;
  camera.lookAt(wp.l[0], wp.l[1], wp.l[2]);

  // Breathing simulation
  headGroup.position.y = 1.22 + Math.sin(t * 0.42) * 0.007;
  body.scale.y = 1 + Math.sin(t * 0.42) * 0.004;

  deskLamp.intensity = 4.0 + Math.sin(t * 2.2) * 0.18;
  screenGlow.intensity = 1.4 + Math.sin(t * 0.65) * 0.1;
  monitorScreen.material.emissiveIntensity = 0.85 + Math.sin(t*0.5)*0.05;

  steamArr.forEach((s, i) => {
    s.position.y += 0.0028;
    s.position.x += Math.sin(t * 0.9 + i) * 0.0008;
    const progress = (s.position.y - 0.69) / 0.65;
    s.material.opacity = Math.max(0, 0.14 * (1 - progress));
    if (s.position.y > 1.36) { 
      s.position.y = 0.69; 
      s.position.x = -0.55 + (Math.random()-0.5)*0.04; 
    }
  });

  renderer.render(scene, camera);
}
animate();

/* â”€â”€â”€â”€â”€ RESIZE â”€â”€â”€â”€â”€ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* â”€â”€â”€â”€â”€ CONTACT â”€â”€â”€â”€â”€ */
const contactLines = [
  'Lakshay Chopra',
  'Program Manager - AI and Automation CoE',
  '',
  'Email: lakshay.chopra@email.com',
  'LinkedIn: linkedin.com/in/lakshay-chopra',
  'Location: Delhi, India',
  '',
  'Open to exciting opportunities'
];

let typewriterTimeout = null;

function showContact() {
  const panel = document.getElementById('contact-panel');
  if (panel) {
    panel.style.display = 'block';
    gsap.fromTo(panel, { y:30, opacity:0 }, { y:0, opacity:1, duration:0.4, ease:'power2.out' });
    runTypewriter();
    gsap.to(mug.rotation, { y: '+=1.2', duration:0.55, ease:'power2.out' });
  }
}

function hideContact() {
  const panel = document.getElementById('contact-panel');
  if (panel) {
    gsap.to(panel, {
      y:30, opacity:0, duration:0.3,
      onComplete: () => { panel.style.display='none'; }
    });
  }
}

function runTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }
  
  el.innerHTML = '';
  let li=0, ci=0, html='';
  
  function next() {
    if (li >= contactLines.length) { 
      el.innerHTML = html; 
      return; 
    }
    const line = contactLines[li];
    if (ci === 0 && li > 0) html += '<br>';
    if (ci < line.length) {
      html += line[ci++];
      el.innerHTML = html + '<span style="opacity:0.5">â–Œ</span>';
      typewriterTimeout = setTimeout(next, 35);
    } else { 
      li++; 
      ci=0; 
      typewriterTimeout = setTimeout(next, line===''?80:200); 
    }
  }
  next();
}

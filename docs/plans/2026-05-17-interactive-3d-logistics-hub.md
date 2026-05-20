# 3D Fleet Tracking & Interactive Logistics Hub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Sudanil Logistics dashboard to `_21/code.html` with an immersive 3D Globe plotting regional/international shipping routes, a live telemetry HUD overlay, and high-performance zero-dependency 3D TiltCards.

**Architecture:** Create a new iterative version `_21/code.html` copied from `_20/code.html`. We will load Three.js and OrbitControls via highly reliable CDNs to construct a custom WebGL 3D Globe representing the Earth with glowing wireframes, custom shader highlights, curved Bezier routing arcs connecting Sudanil's active hubs, and animating particle payloads. The Bento grid items and KPI cards will be enhanced with zero-dependency vanilla JS 3D tilt-and-reflection effects.

**Tech Stack:** Tailwind CSS CDN, Three.js CDN, OrbitControls CDN, Custom Canvas WebGL, Vanilla ES6 JavaScript.

---

## User Review Required

> [!IMPORTANT]
> **CDN Script Loading**: Since Stitch uses standalone, self-contained HTML files rather than standard bundlers, all libraries (Three.js and OrbitControls) will be loaded via official, reliable cloud CDNs (cdnjs & jsdelivr) in `<script>` tags. This avoids npm packager issues and ensures immediate client portability.
>
> **RTL and Layout Integrity**: The dashboard will remain fully Arabic RTL (`dir="rtl"`) with appropriate font families (`Noto Sans Arabic` and `Be Vietnam Pro`). The 3D Canvas will occupy the warehouse module span in the Bento grid, overlaying a custom interactive transparent glassmorphic telemetry panel.

## Proposed Changes

### Sudanil Logistics Core Dashboard

#### [NEW] [code.html](file:///c:/Users/pc/Downloads/stitch_sudaneel_logistics_platform/stitch_sudaneel_logistics_platform/_21/code.html)
A complete upgrade of the logistics page from `_20/code.html` incorporating:
1. **CDN Scripts Integration**: Three.js and OrbitControls scripts loaded in the HTML header.
2. **Interactive 3D Globe Canvas**: Replaces the static warehouse bento image with a custom container containing the 3D canvas and an overlay HUD.
3. **Logistic Route Plotting**: 3D mathematical conversion of geographical coordinates (latitude/longitude) to 3D sphere points for:
   - **الخرطوم شمال (Khartoum North)**: Sudan core warehouse.
   - **بورتسودان (Port Sudan)**: Coastal port node.
   - **مدني (Madani)**: Inland agricultural-industrial node.
   - **دبي (Dubai)** & **القاهرة (Cairo)**: Connecting international hubs.
4. **Curved Bezier Paths & Particle Animation**: Glowing bezier arcs representing shipping lines with running light sparks showing active cargo flow.
5. **Interactive Raycaster Navigation**: Ability to hover/click nodes on the globe to update the warehouse details card and trigger smooth camera focus panning.
6. **Zero-Dependency 3D TiltCards**: Smooth mouse-move event handlers on all main cards (KPIs and Manager card احمد كمال) adding dynamic 3D tilting and glossy light reflections.
7. **WebGL Fallback Engine**: System checking WebGL capability at boot, falling back gracefully to the original premium automated warehouse static asset if WebGL is unavailable or crashes.

---

## Detailed Task Breakdown

### Task 1: Initialize Folder `_21` and Copy Codebase
**Files:**
- Create: `stitch_sudaneel_logistics_platform/_21/code.html` (copied from `_20/code.html`)
- Test: Manual check that `_21/code.html` runs identically to `_20` prior to 3D modifications.

**Steps:**
1. Create directory `_21` under `stitch_sudaneel_logistics_platform`.
2. Copy `_20/code.html` contents directly into `_21/code.html`.
3. Verify basic HTML rendering.

---

### Task 2: Inject CDN Libraries and Set Up WebGL Detector
**Files:**
- Modify: `_21/code.html` (Lines 7-15, injecting Three.js & OrbitControls)

**Step 1: Inject Scripts**
In the `<head>` of `_21/code.html`, add:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
```

**Step 2: Add WebGL Support Detection**
Before initializing Three.js, check for WebGL support in a new `<script>` at the bottom of the body:
```javascript
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
```

---

### Task 3: Replace Warehouse Image with 3D Globe Container & HUD UI
**Files:**
- Modify: `_21/code.html` (Lines 244-272, modifying the Bento warehouse card)

**Step 1: Update Card HTML Structure**
Replace the original `<img>` element with a 3D Canvas element and a glassmorphic HUD overlay:
```html
<!-- Warehouse Management Overview -->
<div class="md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant industrial-shadow overflow-hidden group relative flex flex-col h-[400px]">
  <div class="p-6 border-b border-outline-variant flex justify-between items-center bg-white z-10">
    <div>
      <h3 class="font-headline-md text-headline-md text-primary">التتبع الجغرافي والأساطيل الحية</h3>
      <p class="text-xs text-on-surface-variant font-medium mt-1">تتبع مسار الأسطول والمخزون في الوقت الفعلي</p>
    </div>
    <div class="flex gap-2 text-xs">
      <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> مباشر</span>
    </div>
  </div>
  
  <!-- Canvas Parent with Fallback -->
  <div id="globe-container" class="relative flex-grow bg-primary-container overflow-hidden w-full h-full">
    <!-- WebGL Canvas -->
    <canvas id="globe-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
    
    <!-- Graceful Fallback Container -->
    <div id="globe-fallback" class="absolute inset-0 hidden">
      <img class="w-full h-full object-cover opacity-50 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEfrpR2zcdj6d1g8eU3KstABAd85bpb8tKchpMHeSte2DmmcBPkUsIh16ko4B4Ha-tqX4llRSGbPGmTBFKwfuocJtDC0ODJ4vYgWfjnWe9-vvyZNDqTY7a8BnzduaVwkJkgY25oknYyo-OBcA8Gm_lSBvhAyn6FkRYh5hyVd3_GKMrkgKfH6RyaeU26XXcqS4-sUuViN3xV4NXBYDSPwoOTOShmYjmOF2nJaZNFkqPgWkewvf0u0eEdgbBixH76j3_7I4x2gdEfQc"/>
    </div>

    <!-- Transparent Interactive HUD Overlay (RTL) -->
    <div id="hud-overlay" class="absolute bottom-4 right-4 left-4 p-4 rounded-lg bg-primary-container/80 backdrop-blur-md border border-white/10 text-white flex flex-col gap-2 z-10 transition-all duration-300 opacity-0 transform translate-y-4">
      <div class="flex justify-between items-center border-b border-white/10 pb-2">
        <h4 id="hud-node-name" class="font-bold text-lg text-secondary-fixed">الخرطوم شمال</h4>
        <span id="hud-node-status" class="px-2 py-0.5 bg-secondary text-on-secondary text-[10px] rounded-full font-bold">نشط</span>
      </div>
      <div class="grid grid-cols-3 gap-4 text-xs mt-1">
        <div>
          <p class="text-on-primary-container/80">إشغال المستودع</p>
          <p id="hud-node-occupancy" class="font-bold text-base text-white">92%</p>
        </div>
        <div>
          <p class="text-on-primary-container/80">الشحنات الواردة</p>
          <p id="hud-node-incoming" class="font-bold text-base text-white">12 شحنة</p>
        </div>
        <div>
          <p class="text-on-primary-container/80">الشحنات الصادرة</p>
          <p id="hud-node-outgoing" class="font-bold text-base text-white">8 شحنات</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### Task 4: Implement 3D Globe & Rotational Controls
**Files:**
- Modify: `_21/code.html` (Writing the initialization script)

**Step 1: Setup Three.js Scene, Camera, and WebGLRenderer**
```javascript
const container = document.getElementById('globe-container');
const canvas = document.getElementById('globe-canvas');
const fallback = document.getElementById('globe-fallback');

if (!isWebGLAvailable()) {
  canvas.classList.add('hidden');
  fallback.classList.remove('hidden');
  return;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

**Step 2: Add Lights & Controls**
Add subtle ambient lighting and a prominent directional light matching Sudanil's color palette (navy/gold accents):
```javascript
const ambientLight = new THREE.AmbientLight(0x021e2d, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffdfa0, 1.2);
dirLight.position.set(5, 3, 5);
scene.add(dirLight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Disable scroll capture to avoid scroll hijacking
```

---

### Task 5: Build Sphere Mesh, Route Arcs, and Interactive Coordinates
**Files:**
- Modify: `_21/code.html` (Building globe geometry & plotting coordinates)

**Step 1: Construct the Globe Sphere**
Build a sleek dark-navy semi-transparent globe shell overlayed with a golden glowing coordinate wireframe:
```javascript
const sphereGeo = new THREE.SphereGeometry(4, 64, 64);
const sphereMat = new THREE.MeshPhongMaterial({
  color: 0x021e2d,
  transparent: true,
  opacity: 0.85,
  shininess: 40,
  bumpScale: 0.05
});
const globe = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(globe);

// Add grid lines representing precision
const wireGeo = new THREE.SphereGeometry(4.02, 24, 24);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x795900,
  wireframe: true,
  transparent: true,
  opacity: 0.15
});
const wireframe = new THREE.Mesh(wireGeo, wireMat);
globe.add(wireframe);
```

**Step 2: Coordinates to 3D Points Function**
Convert geographic Lat/Lon to 3D coordinate vector $(x,y,z)$ on the sphere:
```javascript
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.sin(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta)
  );
}
```

**Step 3: Define Logistics Hubs (Nodes)**
Plot floating golden nodes on the globe:
```javascript
const hubs = [
  { name: 'الخرطوم شمال', lat: 15.6, lon: 32.5, occupancy: '92%', incoming: '12', outgoing: '8', active: true },
  { name: 'بورتسودان', lat: 19.6, lon: 37.2, occupancy: '64%', incoming: '22', outgoing: '15', active: true },
  { name: 'مدني', lat: 14.4, lon: 33.5, occupancy: '45%', incoming: '5', outgoing: '4', active: true },
  { name: 'دبي - جبل علي', lat: 25.2, lon: 55.2, occupancy: '80%', incoming: '40', outgoing: '35', active: true },
  { name: 'القاهرة - مدينة نصر', lat: 30.0, lon: 31.2, occupancy: '75%', incoming: '18', outgoing: '12', active: true }
];

const nodeGroup = new THREE.Group();
const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffdfa0 });

hubs.forEach(hub => {
  const pos = latLonToVector3(hub.lat, hub.lon, 4);
  const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
  mesh.position.copy(pos);
  mesh.userData = hub;
  nodeGroup.add(mesh);
});
globe.add(nodeGroup);
```

---

### Task 6: Add Curved Flight-Route Bezier Arcs and Animating Cargo Particles
**Files:**
- Modify: `_21/code.html` (Drawing arcs and particles)

**Step 1: Generate Curved Bezier Paths**
```javascript
function createRouteArc(start, end, color = 0x795900) {
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  midPoint.normalize().multiplyScalar(4 + distance * 0.25); // Push middle point outwards for curved height
  
  const curve = new THREE.QuadraticBezierCurve3(start, end, midPoint);
  const points = curve.getPoints(50);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  
  const lineMat = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.4
  });
  
  return { line: new THREE.Line(lineGeo, lineMat), curve: curve };
}
```

**Step 2: Generate Floating Payload Particles**
Add glowing animated particle payloads running along active shipping routes representing logistics packets:
```javascript
const particles = [];
const activeRoutes = [
  { from: 0, to: 1 }, // Khartoum -> Port Sudan
  { from: 0, to: 2 }, // Khartoum -> Madani
  { from: 1, to: 3 }, // Port Sudan -> Dubai
  { from: 1, to: 4 }  // Port Sudan -> Cairo
];

activeRoutes.forEach(r => {
  const start = latLonToVector3(hubs[r.from].lat, hubs[r.from].lon, 4);
  const end = latLonToVector3(hubs[r.to].lat, hubs[r.to].lon, 4);
  const arc = createRouteArc(start, end);
  globe.add(arc.line);
  
  // Create animating packet particle
  const pGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const pMat = new THREE.MeshBasicMaterial({ color: 0xffdfa0 });
  const pMesh = new THREE.Mesh(pGeo, pMat);
  globe.add(pMesh);
  
  particles.push({
    mesh: pMesh,
    curve: arc.curve,
    progress: Math.random(),
    speed: 0.005 + Math.random() * 0.005
  });
});
```

---

### Task 7: Setup Interaction, Hover Detection, and Auto-Rotation
**Files:**
- Modify: `_21/code.html` (Interactions, raycasting & animation loop)

**Step 1: Hover & Click Raycaster Setup**
Define mouse click events, raycasting into the 3D scene, showing/hiding the transparent glassmorphic HUD:
```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const hud = document.getElementById('hud-overlay');

function onPointerMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeGroup.children);
  
  if (intersects.length > 0) {
    canvas.style.cursor = 'pointer';
  } else {
    canvas.style.cursor = 'grab';
  }
}

function onPointerDown(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodeGroup.children);
  
  if (intersects.length > 0) {
    const hub = intersects[0].object.userData;
    document.getElementById('hud-node-name').innerText = hub.name;
    document.getElementById('hud-node-occupancy').innerText = hub.occupancy;
    document.getElementById('hud-node-incoming').innerText = hub.incoming + ' شحنة';
    document.getElementById('hud-node-outgoing').innerText = hub.outgoing + ' شحنة';
    
    hud.style.opacity = '1';
    hud.style.transform = 'translateY(0)';
  } else {
    hud.style.opacity = '0';
    hud.style.transform = 'translateY(16px)';
  }
}

canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerdown', onPointerDown);
```

**Step 2: Smooth Rotation and Render Loop**
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate globe slowly
  globe.rotation.y += 0.002;
  
  // Move animated payload particles
  particles.forEach(p => {
    p.progress += p.speed;
    if (p.progress > 1) p.progress = 0;
    const pos = p.curve.getPointAt(p.progress);
    p.mesh.position.copy(pos);
  });
  
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

---

### Task 8: Implement Premium Spring-based 3D TiltCards
**Files:**
- Modify: `_21/code.html` (Inject vanilla 3D Tilt JS script)

Add high-performance zero-dependency JS hover tilt effects to Sudanil cards to enhance physical depth:
```javascript
function init3DTiltCards() {
  const cards = document.querySelectorAll('.industrial-shadow');
  cards.forEach(card => {
    // Add glass overlay dynamically for light shine reflection
    const shine = document.createElement('div');
    shine.style.position = 'absolute';
    shine.style.inset = '0';
    shine.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 80%)';
    shine.style.pointerEvents = 'none';
    shine.style.opacity = '0';
    shine.style.transition = 'opacity 0.2s';
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(shine);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = (yc - y) / 15; // Max 10 degrees tilt
      const angleY = (x - xc) / 15;
      
      card.style.transform = `perspective(800px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-4px)`;
      card.style.boxShadow = '0 15px 45px rgba(0, 27, 42, 0.15)';
      
      shine.style.opacity = '1';
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.boxShadow = '0 8px 30px rgba(0, 27, 42, 0.08)';
      shine.style.opacity = '0';
    });
  });
}
```

---

## Verification Plan

### Automated Tests
- Run validation scripts for console errors and script loading dependencies.
- Confirm standard WebGL initialization succeeds via mock device support profiles.

### Manual Verification
- **Aesthetic Check**: Verify 3D rotating wireframe globe renders correctly on desktop.
- **RTL Arabic Alignment**: Inspect text alignment in the glassmorphic HUD.
- **Damping and Controls**: Interact with the 3D globe using mouse/touch dragging, ensuring that scroll capture is not hijacked (`enableZoom = false`).
- **Device Fallback**: Temporarily mock WebGL rendering capability, ensuring the platform seamlessly shows the backup premium automated warehouse image.

---
## Execution Handoff

Plan complete and saved to `docs/plans/2026-05-17-interactive-3d-logistics-hub.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagents per task, review progress between tasks, and maintain highly focused iterations.

**2. Parallel Session (separate)** - Open a new session with executing-plans, allowing batch execution with regular checkpoint updates.

**Which approach would you prefer?**

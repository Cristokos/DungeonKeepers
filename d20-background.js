class D20Background {
  constructor(opts = {}) {
    this.THREE = opts.THREE || window.THREE;
    if (!this.THREE) throw new Error('D20Background: THREE.js is required');
    this.canvas = opts.canvas;
    if (!this.canvas) throw new Error('D20Background: a canvas element is required');

    this.R = opts.radius ?? 2.2;
    this.coverage = opts.coverage ?? 0.33;
    this.coverageMobile = opts.coverageMobile ?? 0.28;
    this.faceColor = opts.faceColor ?? 0x0d0d13;
    this.trimColor = opts.trimColor ?? 0xe6c172;
    this.numberColor = opts.numberColor ?? '#efcd7e';
    this.numberFont = opts.numberFont ?? '700 76px Cinzel, Georgia, serif';
    this.opacity = opts.opacity ?? 0.38;
    this.gravity = opts.gravity ?? 12;            // world units/s²
    this.bounceDamp = opts.bounceDamp ?? 0.55;   // velocity kept after wall bounce
    this.repelForce = opts.repelForce ?? 55;     // impulse strength from cursor
    this.repelRadius = opts.repelRadius ?? this.R * 3;
    this.idleSpin = opts.idleSpin ?? 0.16;
    this.attachClickToRoll = opts.attachClickToRoll ?? false;
    this.noRollSelector = opts.noRollSelector ?? '[data-no-roll]';

    this._raf = 0;
    this._inited = false;
  }

  start() {
    if (this._inited) return;
    const ready = () => this._init();
    if (document.fonts && document.fonts.ready) {
      Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(ready);
    } else { ready(); }
  }

  _labelTexture(num) {
    const THREE = this.THREE;
    const s = 128;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const x = c.getContext('2d');
    x.clearRect(0, 0, s, s);
    x.fillStyle = this.numberColor;
    x.font = this.numberFont;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.shadowColor = 'rgba(255,210,120,0.55)';
    x.shadowBlur = 8;
    x.fillText(String(num), s / 2, s / 2 - 2);
    if (num === 6 || num === 9) {
      x.shadowBlur = 0;
      x.fillRect(s / 2 - 22, s / 2 + 34, 44, 5);
    }
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }

  _init() {
    const THREE = this.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.scene = scene;
    this.camera = camera;

    scene.add(new THREE.AmbientLight(0x37301c, 0.7));
    const key = new THREE.DirectionalLight(0xfff1d4, 1.15); key.position.set(3, 4, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffce6a, 0.6); rim.position.set(-5, -2, 1); scene.add(rim);

    const R = this.R;
    const group = new THREE.Group();
    scene.add(group);
    this.group = group;

    const baseGeo = new THREE.IcosahedronGeometry(R, 0);
    const bodyGeo = baseGeo.toNonIndexed();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.faceColor, metalness: 0.4, roughness: 0.5, flatShading: true,
      transparent: true, opacity: this.opacity,
    });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseGeo),
      new THREE.LineBasicMaterial({ color: this.trimColor, transparent: true, opacity: this.opacity * 2.2 })
    );
    group.add(edges);

    const pos = bodyGeo.attributes.position;
    const faces = [];
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
      const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
      faces.push({ centroid, normal });
    }
    this.faces = faces;

    const numbers = new Array(faces.length).fill(0);
    const used = new Array(faces.length).fill(false);
    let n = 1;
    for (let i = 0; i < faces.length; i++) {
      if (used[i]) continue;
      let opp = -1, min = 2;
      for (let j = 0; j < faces.length; j++) {
        if (j === i || used[j]) continue;
        const d = faces[i].normal.dot(faces[j].normal);
        if (d < min) { min = d; opp = j; }
      }
      numbers[i] = n; used[i] = true;
      if (opp >= 0) { numbers[opp] = 21 - n; used[opp] = true; }
      n++;
    }

    const ps = R * 0.64;
    for (let i = 0; i < faces.length; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: this._labelTexture(numbers[i]), transparent: true,
        opacity: this.opacity * 1.6, depthWrite: false,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(ps, ps), mat);
      plane.position.copy(faces[i].centroid).addScaledVector(faces[i].normal, R * 0.012);
      plane.lookAt(new THREE.Vector3().addVectors(plane.position, faces[i].normal));
      group.add(plane);
    }

    this.mode = 'idle';
    this.angVel = new THREE.Vector3();
    this.idleAxis = new THREE.Vector3(0.4, 1, 0.25).normalize();
    this.qTarget = new THREE.Quaternion();
    this.pointerWorld = null;
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this._ndc = new THREE.Vector2();

    // Physics state — position & velocity in world XY
    this._px = 0; this._py = 0;
    this._vx = (Math.random() - 0.5) * 2;
    this._vy = (Math.random() - 0.5) * 2;
    // Visible half-extents in world units (set in _resize)
    this._halfW = 1; this._halfH = 1;

    this._onResize = () => this._resize();
    this._onMove = (e) => this._onPointerMove(e);
    this._onDown = (e) => this._onPointerDown(e);
    this._onVis = () => { if (!document.hidden) this._loop(); };
    window.addEventListener('resize', this._onResize);
    window.addEventListener('pointermove', this._onMove);
    if (this.attachClickToRoll) window.addEventListener('pointerdown', this._onDown);
    document.addEventListener('visibilitychange', this._onVis);

    this._inited = true;
    this._resize();
    this._last = performance.now();
    this._loop();
  }

  _resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const cam = this.camera;
    cam.aspect = w / h;
    const vfov = cam.fov * Math.PI / 180;
    const coverage = w < 720 ? this.coverageMobile : this.coverage;
    let dist = this.R / (Math.tan(vfov / 2) * coverage);
    if (cam.aspect < 1) dist /= cam.aspect;
    cam.position.set(0, 0, dist);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();

    // Compute visible world half-extents at z=0
    this._halfH = Math.tan(vfov / 2) * dist;
    this._halfW = this._halfH * cam.aspect;

    // Keep die inside bounds after resize
    const bnd = this._halfH - this.R;
    const bndW = this._halfW - this.R;
    if (this._px !== undefined) {
      this._px = Math.max(-bndW, Math.min(bndW, this._px));
      this._py = Math.max(-bnd, Math.min(bnd, this._py));
    }
  }

  _onPointerMove(e) {
    const THREE = this.THREE;
    this._ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(this._ndc, this.camera);
    const p = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.plane, p)) this.pointerWorld = p;
  }

  _onPointerDown(e) {
    if (e.target && e.target.closest && e.target.closest(this.noRollSelector)) return;
    this.roll();
  }

  roll() {
    if (!this._inited) return;
    const THREE = this.THREE;
    const rnd = () => (Math.random() * 2 - 1);
    this.angVel.set(rnd() * 9 + (rnd() > 0 ? 4 : -4), rnd() * 9 + (rnd() > 0 ? 4 : -4), rnd() * 7);
    const idx = Math.floor(Math.random() * this.faces.length);
    this.qTarget.setFromUnitVectors(this.faces[idx].normal.clone(), new THREE.Vector3(0, 0, 1));
    this.mode = 'tumble';
  }

  _loop() {
    cancelAnimationFrame(this._raf);
    if (document.hidden) return;
    this._raf = requestAnimationFrame(() => this._loop());
    const THREE = this.THREE;
    const now = performance.now();
    let dt = (now - this._last) / 1000;
    this._last = now;
    if (dt > 0.05) dt = 0.05;
    const g = this.group;

    // --- Rotation ---
    if (this.mode === 'tumble') {
      const e = new THREE.Euler(this.angVel.x * dt, this.angVel.y * dt, this.angVel.z * dt);
      g.quaternion.premultiply(new THREE.Quaternion().setFromEuler(e));
      this.angVel.multiplyScalar(Math.pow(0.12, dt));
      if (this.angVel.length() < 1.4) this.mode = 'settle';
    } else if (this.mode === 'settle') {
      g.quaternion.slerp(this.qTarget, 1 - Math.pow(0.0006, dt));
      if (g.quaternion.angleTo(this.qTarget) < 0.015) this.mode = 'idle';
    } else {
      g.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(this.idleAxis, this.idleSpin * dt));
    }

    // --- Physics (XY world space) ---
    const hH = this._halfH, hW = this._halfW;
    const wallY = hH - this.R, wallX = hW - this.R;

    // Gravity pulls down
    this._vy -= this.gravity * dt;

    // Cursor repel
    if (this.pointerWorld) {
      const dx = this._px - this.pointerWorld.x;
      const dy = this._py - this.pointerWorld.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < this.repelRadius) {
        const strength = this.repelForce * (1 - d / this.repelRadius) * dt;
        this._vx += (dx / d) * strength;
        this._vy += (dy / d) * strength;
      }
    }

    // Integrate position
    this._px += this._vx * dt;
    this._py += this._vy * dt;

    // Bounce off walls
    if (this._py < -wallY) { this._py = -wallY; this._vy = Math.abs(this._vy) * this.bounceDamp; }
    if (this._py >  wallY) { this._py =  wallY; this._vy = -Math.abs(this._vy) * this.bounceDamp; }
    if (this._px < -wallX) { this._px = -wallX; this._vx = Math.abs(this._vx) * this.bounceDamp; }
    if (this._px >  wallX) { this._px =  wallX; this._vx = -Math.abs(this._vx) * this.bounceDamp; }

    // Light floor friction when resting on bottom
    if (this._py <= -wallY + 0.01) {
      this._vx *= Math.pow(0.18, dt);
    }

    // Speed cap
    const spd = Math.sqrt(this._vx * this._vx + this._vy * this._vy);
    const maxSpd = this.R * 8;
    if (spd > maxSpd) { this._vx = (this._vx / spd) * maxSpd; this._vy = (this._vy / spd) * maxSpd; }

    g.position.set(this._px, this._py, 0);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerdown', this._onDown);
    document.removeEventListener('visibilitychange', this._onVis);
    if (this.renderer) this.renderer.dispose();
    this._inited = false;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = { D20Background };
if (typeof window !== 'undefined') window.D20Background = D20Background;

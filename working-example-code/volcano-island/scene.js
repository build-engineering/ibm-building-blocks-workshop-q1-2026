// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

// Day/Night state and controls
let isNight = false;
let timeSpeed = 1.0;
let eruptionIntensity = 5;
let weatherMode = 'clear'; // 'clear', 'rain', 'storm'
let moonPhase = 0; // 0-7 for different phases

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 25, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// Create sky dome for gradient effect
const skyGeometry = new THREE.SphereGeometry(180, 32, 32);
const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0x87CEEB) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `,
    side: THREE.BackSide
});
const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skyDome);

// Create stars for night sky
const starsGeometry = new THREE.BufferGeometry();
const starCount = 15000;
const starPositions = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);

for (let i = 0; i < starCount; i++) {
    const radius = 150 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
    starSizes[i] = Math.random() * 2 + 0.5;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true
});
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Milky Way band
const milkyWayGeometry = new THREE.PlaneGeometry(200, 40);
const milkyWayMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
});
const milkyWay = new THREE.Mesh(milkyWayGeometry, milkyWayMaterial);
milkyWay.rotation.x = Math.PI / 4;
milkyWay.position.y = 80;
scene.add(milkyWay);

// Shooting stars
const shootingStars = [];
class ShootingStar {
    constructor() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        
        this.line = new THREE.Line(geometry, material);
        scene.add(this.line);
        this.reset();
    }
    
    reset() {
        this.active = false;
        this.life = 0;
        const angle = Math.random() * Math.PI * 2;
        this.startPos = new THREE.Vector3(
            Math.cos(angle) * 100,
            60 + Math.random() * 40,
            Math.sin(angle) * 100
        );
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            -Math.random() * 2 - 1,
            (Math.random() - 0.5) * 2
        );
    }
    
    update() {
        if (!this.active) return;
        
        this.life += 0.02;
        const pos = this.startPos.clone().add(this.velocity.clone().multiplyScalar(this.life * 20));
        const tailPos = pos.clone().sub(this.velocity.clone().multiplyScalar(5));
        
        const positions = this.line.geometry.attributes.position.array;
        positions[0] = tailPos.x;
        positions[1] = tailPos.y;
        positions[2] = tailPos.z;
        positions[3] = pos.x;
        positions[4] = pos.y;
        positions[5] = pos.z;
        this.line.geometry.attributes.position.needsUpdate = true;
        
        this.line.material.opacity = Math.max(0, 1 - this.life);
        
        if (this.life > 1) {
            this.reset();
        }
    }
    
    trigger() {
        this.active = true;
        this.life = 0;
    }
}

for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
}

// Create sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(80, 60, -80);
scene.add(sun);

// Sun glow
const sunGlowGeometry = new THREE.SphereGeometry(15, 32, 32);
const sunGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
sun.add(sunGlow);

// Sun light
const sunLight = new THREE.PointLight(0xffffaa, 1, 150);
sun.add(sunLight);

// Create moon with phases
const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffcc,
    emissiveIntensity: 0,
    roughness: 1
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(80, 60, -80);
scene.add(moon);

// Moon shadow for phases
const moonShadowGeometry = new THREE.SphereGeometry(8.1, 32, 32);
const moonShadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0
});
const moonShadow = new THREE.Mesh(moonShadowGeometry, moonShadowMaterial);
moon.add(moonShadow);

// Moon light
const moonLight = new THREE.PointLight(0xaaaaff, 0, 100);
moon.add(moonLight);

// Volumetric glow for volcano at night
const glowSpheres = [];
for (let i = 0; i < 3; i++) {
    const glowGeometry = new THREE.SphereGeometry(8 + i * 3, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    glowSphere.position.y = 18;
    scene.add(glowSphere);
    glowSpheres.push(glowSphere);
}

// Particle systems for lava and smoke
const lavaParticles = [];
const smokeParticles = [];
const rainParticles = [];
const fireflyParticles = [];

class Particle {
    constructor(type) {
        this.type = type;
        
        if (type === 'lava') {
            const geometry = new THREE.SphereGeometry(0.3, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0xff4500 : 0xff6347,
                transparent: true,
                opacity: 1
            });
            this.mesh = new THREE.Mesh(geometry, material);
            
            this.mesh.position.set(
                (Math.random() - 0.5) * 2,
                15,
                (Math.random() - 0.5) * 2
            );
            
            this.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 0.8 + 0.5,
                (Math.random() - 0.5) * 0.5
            );
            
            this.light = new THREE.PointLight(0xff4500, 0, 5);
            this.mesh.add(this.light);
            
            this.life = 1.0;
            this.gravity = -0.02;
        } else if (type === 'smoke') {
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0x808080 : 0xa0a0a0,
                transparent: true,
                opacity: 0.6
            });
            this.mesh = new THREE.Mesh(geometry, material);
            
            this.mesh.position.set(
                (Math.random() - 0.5) * 3,
                15,
                (Math.random() - 0.5) * 3
            );
            
            this.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.3 + 0.2,
                (Math.random() - 0.5) * 0.1
            );
            
            this.life = 1.0;
            this.gravity = 0;
        } else if (type === 'rain') {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x4488ff,
                transparent: true,
                opacity: 0.6
            });
            this.mesh = new THREE.Mesh(geometry, material);
            
            this.mesh.position.set(
                (Math.random() - 0.5) * 100,
                50 + Math.random() * 20,
                (Math.random() - 0.5) * 100
            );
            
            this.velocity = new THREE.Vector3(0, -2, 0);
            this.life = 1.0;
        } else if (type === 'firefly') {
            const geometry = new THREE.SphereGeometry(0.15, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xffff00,
                transparent: true,
                opacity: 0.8
            });
            this.mesh = new THREE.Mesh(geometry, material);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 10;
            this.mesh.position.set(
                Math.cos(angle) * radius,
                2 + Math.random() * 3,
                Math.sin(angle) * radius
            );
            
            this.light = new THREE.PointLight(0xffff00, 0.5, 3);
            this.mesh.add(this.light);
            
            this.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            
            this.life = 1.0;
            this.phase = Math.random() * Math.PI * 2;
        }
        
        scene.add(this.mesh);
    }
    
    update() {
        this.mesh.position.add(this.velocity);
        
        if (this.type === 'lava') {
            this.velocity.y += this.gravity;
            this.life -= 0.01;
            this.mesh.material.opacity = this.life;
            
            if (this.light) {
                this.light.intensity = isNight ? this.life * 2 : 0;
            }
            
            if (this.mesh.position.y < 0 || this.life <= 0) {
                return false;
            }
        } else if (this.type === 'smoke') {
            this.life -= 0.005;
            this.mesh.material.opacity = this.life * 0.6;
            this.mesh.scale.set(1 + (1 - this.life), 1 + (1 - this.life), 1 + (1 - this.life));
            
            if (this.life <= 0 || this.mesh.position.y > 40) {
                return false;
            }
        } else if (this.type === 'rain') {
            if (this.mesh.position.y < 0) {
                return false;
            }
        } else if (this.type === 'firefly') {
            this.phase += 0.05;
            const pulse = (Math.sin(this.phase) + 1) / 2;
            this.mesh.material.opacity = 0.3 + pulse * 0.5;
            this.light.intensity = pulse * 0.5;
            
            if (this.mesh.position.y < 1 || this.mesh.position.y > 6) {
                this.velocity.y *= -1;
            }
            
            const distFromCenter = Math.sqrt(
                this.mesh.position.x * this.mesh.position.x + 
                this.mesh.position.z * this.mesh.position.z
            );
            if (distFromCenter > 25) {
                const angle = Math.atan2(this.mesh.position.z, this.mesh.position.x);
                this.velocity.x = -Math.cos(angle) * 0.05;
                this.velocity.z = -Math.sin(angle) * 0.05;
            }
        }
        
        return true;
    }
    
    remove() {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}

// Create ocean with waves
const oceanGeometry = new THREE.PlaneGeometry(160, 160, 64, 64);
const oceanMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1e90ff,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9
});
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.5;
ocean.receiveShadow = true;
scene.add(ocean);

// Store original ocean vertices for wave animation
const oceanPositions = oceanGeometry.attributes.position.array;
const oceanOriginalPositions = new Float32Array(oceanPositions);

// Create island group (will rotate)
const islandGroup = new THREE.Group();
scene.add(islandGroup);

// Create island base (sandy beach)
const islandGeometry = new THREE.CylinderGeometry(20, 22, 2, 32);
const islandMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf4a460,
    roughness: 0.9
});
const island = new THREE.Mesh(islandGeometry, islandMaterial);
island.position.y = 0;
island.castShadow = true;
island.receiveShadow = true;
islandGroup.add(island);

// Create grass layer
const grassGeometry = new THREE.CylinderGeometry(18, 20, 1, 32);
const grassMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x228b22,
    roughness: 0.8
});
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.position.y = 1.5;
grass.castShadow = true;
grass.receiveShadow = true;
islandGroup.add(grass);

// Add bioluminescent mushrooms
const mushrooms = [];
for (let i = 0; i < 15; i++) {
    const mushroomGroup = new THREE.Group();
    
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.25;
    mushroomGroup.add(stem);
    
    const capGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const capMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.5;
    cap.scale.y = 0.5;
    mushroomGroup.add(cap);
    
    const light = new THREE.PointLight(0x00ffff, 0, 3);
    light.position.y = 0.5;
    mushroomGroup.add(light);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 12 + Math.random() * 6;
    mushroomGroup.position.set(
        Math.cos(angle) * radius,
        2,
        Math.sin(angle) * radius
    );
    
    islandGroup.add(mushroomGroup);
    mushrooms.push({ group: mushroomGroup, cap, light, phase: Math.random() * Math.PI * 2 });
}

// Create volcano
const volcanoGeometry = new THREE.ConeGeometry(8, 16, 8);
const volcanoMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    roughness: 0.9,
    flatShading: true
});
const volcano = new THREE.Mesh(volcanoGeometry, volcanoMaterial);
volcano.position.y = 10;
volcano.castShadow = true;
volcano.receiveShadow = true;
islandGroup.add(volcano);

// Add rocky texture to volcano
const rockColors = [0x654321, 0x8b4513, 0x5c4033, 0x704214];
for (let i = 0; i < 20; i++) {
    const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.8 + 0.3, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({ 
        color: rockColors[Math.floor(Math.random() * rockColors.length)],
        roughness: 1.0,
        flatShading: true
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 7;
    const height = 3 + Math.random() * 12;
    
    rock.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
    );
    rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    rock.castShadow = true;
    islandGroup.add(rock);
}

// Create crater
const craterGeometry = new THREE.CylinderGeometry(2, 3, 2, 8);
const craterMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2f1f1f,
    roughness: 1.0
});
const crater = new THREE.Mesh(craterGeometry, craterMaterial);
crater.position.y = 17;
islandGroup.add(crater);

// Add lava glow inside crater
const lavaGlowGeometry = new THREE.CylinderGeometry(2, 2.5, 0.5, 8);
const lavaGlowMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff4500,
    transparent: true,
    opacity: 0.8
});
const lavaGlow = new THREE.Mesh(lavaGlowGeometry, lavaGlowMaterial);
lavaGlow.position.y = 16.5;
islandGroup.add(lavaGlow);

// Add point light for lava glow
const lavaLight = new THREE.PointLight(0xff4500, 2, 30);
lavaLight.position.set(0, 16, 0);
islandGroup.add(lavaLight);

// Create clouds
const clouds = [];
const cloudGroup = new THREE.Group();
scene.add(cloudGroup);

function createCloud(x, y, z) {
    const cloud = new THREE.Group();
    
    const puffCount = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < puffCount; i++) {
        const puffGeometry = new THREE.SphereGeometry(
            2 + Math.random() * 2,
            8,
            8
        );
        const puffMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            roughness: 1
        });
        const puff = new THREE.Mesh(puffGeometry, puffMaterial);
        
        puff.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 4
        );
        
        cloud.add(puff);
    }
    
    cloud.position.set(x, y, z);
    return cloud;
}

for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 60 + Math.random() * 20;
    const height = 35 + Math.random() * 15;
    
    const cloud = createCloud(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
    );
    
    cloudGroup.add(cloud);
    clouds.push(cloud);
}

// Create trees with wind sway
const trees = [];
function createTree(x, z) {
    const treeGroup = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b4513,
        roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    
    const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228b22,
        roughness: 0.8
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 3.5;
    foliage.scale.set(1, 1.3, 1);
    foliage.castShadow = true;
    treeGroup.add(foliage);
    
    treeGroup.position.set(x, 2, z);
    return { group: treeGroup, trunk, foliage, baseRotation: 0 };
}

const treePositions = [
    [-10, -8], [-12, -5], [-8, -10], [-6, -12],
    [10, 8], [12, 5], [8, 10], [6, 12],
    [-10, 8], [-8, 10], [10, -8], [8, -10],
    [-5, -6], [5, 6], [-6, 5], [6, -5]
];

treePositions.forEach(([x, z]) => {
    const tree = createTree(x, z);
    islandGroup.add(tree.group);
    trees.push(tree);
});

// Lightning flash
let lightningActive = false;
let lightningIntensity = 0;
const lightningLight = new THREE.PointLight(0xffffff, 0, 200);
lightningLight.position.set(0, 100, 0);
scene.add(lightningLight);

// Animation variables
let particleSpawnCounter = 0;
let time = 0;
let cameraAngle = 0;
let cameraDistance = 50;
let cameraHeight = 25;
let cameraAutoRotate = false;

// Control event listeners
const toggle = document.getElementById('dayNightToggle');
toggle.addEventListener('click', () => {
    isNight = !isNight;
    toggle.classList.toggle('active');
    transitionDayNight();
});

const timeSpeedSlider = document.getElementById('timeSpeed');
const timeSpeedValue = document.getElementById('timeSpeedValue');
timeSpeedSlider.addEventListener('input', (e) => {
    timeSpeed = parseFloat(e.target.value);
    timeSpeedValue.textContent = timeSpeed.toFixed(1) + 'x';
});

const eruptionSlider = document.getElementById('eruptionIntensity');
const eruptionValue = document.getElementById('eruptionValue');
eruptionSlider.addEventListener('input', (e) => {
    eruptionIntensity = parseInt(e.target.value);
    eruptionValue.textContent = eruptionIntensity;
});

const weatherToggle = document.getElementById('weatherToggle');
weatherToggle.addEventListener('click', () => {
    if (weatherMode === 'clear') {
        weatherMode = 'rain';
        weatherToggle.textContent = '🌧️ Rain';
        weatherToggle.classList.add('active');
    } else if (weatherMode === 'rain') {
        weatherMode = 'storm';
        weatherToggle.textContent = '⛈️ Storm';
    } else {
        weatherMode = 'clear';
        weatherToggle.textContent = '☁️ Clear';
        weatherToggle.classList.remove('active');
    }
});

const resetCamera = document.getElementById('resetCamera');
resetCamera.addEventListener('click', () => {
    cameraAngle = 0;
    cameraDistance = 50;
    cameraHeight = 25;
    cameraAutoRotate = false;
});

// Mouse controls for camera
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        cameraAngle += deltaX * 0.005;
        cameraHeight = Math.max(5, Math.min(60, cameraHeight - deltaY * 0.1));
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    cameraDistance = Math.max(20, Math.min(100, cameraDistance + e.deltaY * 0.05));
});

function transitionDayNight() {
    const duration = 2000;
    const startTime = Date.now();
    
    const startBgTop = isNight ? new THREE.Color(0x0077ff) : new THREE.Color(0x000033);
    const endBgTop = isNight ? new THREE.Color(0x000033) : new THREE.Color(0x0077ff);
    
    const startBgBottom = isNight ? new THREE.Color(0x87CEEB) : new THREE.Color(0x0a0a1e);
    const endBgBottom = isNight ? new THREE.Color(0x0a0a1e) : new THREE.Color(0x87CEEB);
    
    const startFogColor = isNight ? new THREE.Color(0x87CEEB) : new THREE.Color(0x0a0a1e);
    const endFogColor = isNight ? new THREE.Color(0x0a0a1e) : new THREE.Color(0x87CEEB);
    
    const startAmbient = isNight ? 0.6 : 0.15;
    const endAmbient = isNight ? 0.15 : 0.6;
    
    const startDirectional = isNight ? 0.8 : 0.2;
    const endDirectional = isNight ? 0.2 : 0.8;
    
    const startStars = isNight ? 0 : 1;
    const endStars = isNight ? 1 : 0;
    
    const startGlow = isNight ? 0 : 0.3;
    const endGlow = isNight ? 0.3 : 0;
    
    // Sun visible only during day
    const startSun = isNight ? 1 : 0;
    const endSun = isNight ? 0 : 1;
    
    // Moon visible only at night
    const startMoon = isNight ? 0 : 0.8;
    const endMoon = isNight ? 0.8 : 0;
    
    const startClouds = isNight ? 0.7 : 0;
    const endClouds = isNight ? 0 : 0.7;
    
    const startMilkyWay = isNight ? 0 : 0.15;
    const endMilkyWay = isNight ? 0.15 : 0;
    
    function transition() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const eased = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const topColor = new THREE.Color();
        topColor.lerpColors(startBgTop, endBgTop, eased);
        skyMaterial.uniforms.topColor.value = topColor;
        
        const bottomColor = new THREE.Color();
        bottomColor.lerpColors(startBgBottom, endBgBottom, eased);
        skyMaterial.uniforms.bottomColor.value = bottomColor;
        
        scene.fog.color.lerpColors(startFogColor, endFogColor, eased);
        
        ambientLight.intensity = startAmbient + (endAmbient - startAmbient) * eased;
        directionalLight.intensity = startDirectional + (endDirectional - startDirectional) * eased;
        
        starsMaterial.opacity = startStars + (endStars - startStars) * eased;
        
        glowSpheres.forEach((sphere, i) => {
            sphere.material.opacity = (startGlow + (endGlow - startGlow) * eased) * (0.15 - i * 0.04);
        });
        
        sunMaterial.opacity = startSun + (endSun - startSun) * eased;
        sunGlowMaterial.opacity = (startSun + (endSun - startSun) * eased) * 0.3;
        sunLight.intensity = (startSun + (endSun - startSun) * eased) * 1;
        
        const moonOpacity = startMoon + (endMoon - startMoon) * eased;
        moonMaterial.emissiveIntensity = moonOpacity;
        moonLight.intensity = moonOpacity * 0.5;
        
        const cloudOpacity = startClouds + (endClouds - startClouds) * eased;
        clouds.forEach(cloud => {
            cloud.children.forEach(puff => {
                puff.material.opacity = cloudOpacity;
            });
        });
        
        milkyWayMaterial.opacity = startMilkyWay + (endMilkyWay - startMilkyWay) * eased;
        
        mushrooms.forEach(m => {
            const glowIntensity = (endMoon - startMoon) * eased;
            m.cap.material.emissiveIntensity = glowIntensity * 0.5;
            m.light.intensity = glowIntensity * 0.3;
        });
        
        if (progress < 1) {
            requestAnimationFrame(transition);
        }
    }
    
    transition();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.016 * timeSpeed;
    
    // Update camera position
    if (cameraAutoRotate) {
        cameraAngle += 0.001;
    }
    camera.position.x = Math.cos(cameraAngle) * cameraDistance;
    camera.position.z = Math.sin(cameraAngle) * cameraDistance;
    camera.position.y = cameraHeight;
    camera.lookAt(0, 5, 0);
    
    // Rotate island slowly
    islandGroup.rotation.y += 0.002 * timeSpeed;
    
    // Animate ocean waves
    for (let i = 0; i < oceanPositions.length; i += 3) {
        const x = oceanOriginalPositions[i];
        const z = oceanOriginalPositions[i + 2];
        oceanPositions[i + 1] = oceanOriginalPositions[i + 1] + 
            Math.sin(x * 0.1 + time) * 0.3 + 
            Math.cos(z * 0.1 + time * 0.7) * 0.2;
    }
    oceanGeometry.attributes.position.needsUpdate = true;
    oceanGeometry.computeVertexNormals();
    
    // Update sun position (lower arc to prevent cutoff)
    const sunTime = time * 0.1;
    sun.position.x = Math.cos(sunTime) * 80;
    sun.position.z = Math.sin(sunTime) * 80;
    sun.position.y = 40 + Math.sin(sunTime * 0.5) * 15;
    
    // Update directional light to follow sun
    directionalLight.position.copy(sun.position);
    
    // Update moon position (opposite to sun, also lower)
    moon.position.x = -sun.position.x;
    moon.position.z = -sun.position.z;
    moon.position.y = sun.position.y;
    
    // Update moon phase
    moonPhase = (time * 0.05) % 8;
    const phaseAngle = (moonPhase / 8) * Math.PI * 2;
    moonShadow.position.x = Math.cos(phaseAngle) * 0.5;
    moonShadowMaterial.opacity = isNight ? Math.abs(Math.sin(phaseAngle)) * 0.8 : 0;
    
    // Spawn particles based on eruption intensity (optimized)
    particleSpawnCounter++;
    
    // Limit max particles for performance
    const maxLavaParticles = 50 + eruptionIntensity * 10;
    const maxSmokeParticles = 30 + eruptionIntensity * 5;
    
    const lavaSpawnRate = Math.max(2, 12 - eruptionIntensity);
    if (particleSpawnCounter % lavaSpawnRate === 0 &&
        eruptionIntensity > 0 &&
        lavaParticles.length < maxLavaParticles) {
        const lavaParticle = new Particle('lava');
        lavaParticles.push(lavaParticle);
    }
    
    const smokeSpawnRate = Math.max(3, 18 - eruptionIntensity);
    if (particleSpawnCounter % smokeSpawnRate === 0 &&
        eruptionIntensity > 0 &&
        smokeParticles.length < maxSmokeParticles) {
        const smokeParticle = new Particle('smoke');
        smokeParticles.push(smokeParticle);
    }
    
    // Spawn rain (optimized with particle limit)
    const maxRainParticles = 200;
    if (weatherMode === 'rain' || weatherMode === 'storm') {
        if (particleSpawnCounter % 2 === 0 && rainParticles.length < maxRainParticles) {
            const rainParticle = new Particle('rain');
            rainParticles.push(rainParticle);
        }
    }
    
    // Spawn fireflies at night
    if (isNight && fireflyParticles.length < 20 && Math.random() < 0.02) {
        const firefly = new Particle('firefly');
        fireflyParticles.push(firefly);
    }
    
    // Update particles
    for (let i = lavaParticles.length - 1; i >= 0; i--) {
        if (!lavaParticles[i].update()) {
            lavaParticles[i].remove();
            lavaParticles.splice(i, 1);
        }
    }
    
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        if (!smokeParticles[i].update()) {
            smokeParticles[i].remove();
            smokeParticles.splice(i, 1);
        }
    }
    
    for (let i = rainParticles.length - 1; i >= 0; i--) {
        if (!rainParticles[i].update()) {
            rainParticles[i].remove();
            rainParticles.splice(i, 1);
        }
    }
    
    for (let i = fireflyParticles.length - 1; i >= 0; i--) {
        if (!fireflyParticles[i].update()) {
            fireflyParticles[i].remove();
            fireflyParticles.splice(i, 1);
        }
    }
    
    // Update shooting stars
    shootingStars.forEach(star => {
        star.update();
        if (isNight && !star.active && Math.random() < 0.001) {
            star.trigger();
        }
    });
    
    // Animate lava glow
    const glowPulse = Math.sin(time * 3);
    lavaGlow.material.opacity = 0.6 + glowPulse * 0.2;
    lavaLight.intensity = (isNight ? 3 : 1.5) + glowPulse * 0.5;
    
    // Animate volcano glow spheres
    glowSpheres.forEach((sphere, i) => {
        sphere.rotation.y += 0.001 * (i + 1) * timeSpeed;
        if (isNight) {
            const pulse = Math.sin(time * 2 + i) * 0.05;
            sphere.material.opacity = 0.15 - i * 0.04 + pulse;
        }
    });
    
    // Rotate stars and milky way
    stars.rotation.y += 0.0001 * timeSpeed;
    milkyWay.rotation.z += 0.0002 * timeSpeed;
    
    // Move clouds
    clouds.forEach((cloud, index) => {
        cloud.rotation.y += (0.0002 + index * 0.00005) * timeSpeed;
        
        cloud.children.forEach((puff, puffIndex) => {
            puff.position.x += Math.sin(time + puffIndex) * 0.001;
        });
    });
    cloudGroup.rotation.y += 0.0001 * timeSpeed;
    
    // Wind effect on trees
    const windStrength = weatherMode === 'storm' ? 0.1 : 0.03;
    trees.forEach((tree, index) => {
        const sway = Math.sin(time * 2 + index) * windStrength;
        tree.group.rotation.z = sway;
    });
    
    // Animate mushrooms
    mushrooms.forEach(m => {
        m.phase += 0.02;
        if (isNight) {
            const pulse = (Math.sin(m.phase) + 1) / 2;
            m.cap.material.emissiveIntensity = pulse * 0.5;
            m.light.intensity = pulse * 0.3;
        }
    });
    
    // Lightning effect
    if (weatherMode === 'storm' && Math.random() < 0.005) {
        lightningActive = true;
        lightningIntensity = 5;
    }
    
    if (lightningActive) {
        lightningIntensity *= 0.9;
        lightningLight.intensity = lightningIntensity;
        if (lightningIntensity < 0.1) {
            lightningActive = false;
            lightningLight.intensity = 0;
        }
    }
    
    // Adjust fog based on weather
    if (weatherMode === 'storm') {
        scene.fog.density = 0.015;
    } else if (weatherMode === 'rain') {
        scene.fog.density = 0.01;
    } else {
        scene.fog.density = 0.005;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Made with Bob

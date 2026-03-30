// Rubik's Cube 3D Implementation with Solver

class RubiksCube {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cubelets = [];
        this.cubeGroup = null;
        this.isAnimating = false;
        this.animationQueue = [];
        this.scrambleMoves = []; // Track scramble moves for solving
        
        // Cube state representation (6 faces, 9 stickers each)
        // 0=White, 1=Yellow, 2=Red, 3=Orange, 4=Green, 5=Blue
        this.state = this.getInitialState();
        
        this.init();
        this.createCube();
        this.animate();
        this.setupControls();
    }

    getInitialState() {
        return {
            U: Array(9).fill(0), // Up (White)
            D: Array(9).fill(1), // Down (Yellow)
            F: Array(9).fill(2), // Front (Red)
            B: Array(9).fill(3), // Back (Orange)
            R: Array(9).fill(4), // Right (Green)
            L: Array(9).fill(5)  // Left (Blue)
        };
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            600 / 600,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(600, 600);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        // Mouse controls
        this.setupMouseControls();
    }

    setupMouseControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging && !this.isAnimating) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                this.cubeGroup.rotation.y += deltaX * 0.01;
                this.cubeGroup.rotation.x += deltaY * 0.01;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * 0.01;
            this.camera.position.z += delta;
            this.camera.position.z = Math.max(3, Math.min(10, this.camera.position.z));
        });
    }

    createCube() {
        this.cubeGroup = new THREE.Group();
        this.scene.add(this.cubeGroup);

        const colors = [
            0xFFFFFF, // White
            0xFFFF00, // Yellow
            0xFF0000, // Red
            0xFF6600, // Orange
            0x00FF00, // Green
            0x0000FF  // Blue
        ];

        const size = 0.95;
        const gap = 0.05;

        // Create 27 cubelets (3x3x3)
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new THREE.BoxGeometry(size, size, size);
                    
                    // Create materials for each face
                    const materials = [];
                    
                    // Right, Left, Top, Bottom, Front, Back
                    const faceColors = [
                        x === 1 ? colors[4] : 0x000000,  // Right (Green)
                        x === -1 ? colors[5] : 0x000000, // Left (Blue)
                        y === 1 ? colors[0] : 0x000000,  // Top (White)
                        y === -1 ? colors[1] : 0x000000, // Bottom (Yellow)
                        z === 1 ? colors[2] : 0x000000,  // Front (Red)
                        z === -1 ? colors[3] : 0x000000  // Back (Orange)
                    ];

                    faceColors.forEach(color => {
                        materials.push(new THREE.MeshPhongMaterial({
                            color: color,
                            shininess: 100
                        }));
                    });

                    const cubelet = new THREE.Mesh(geometry, materials);
                    cubelet.position.set(
                        x * (size + gap),
                        y * (size + gap),
                        z * (size + gap)
                    );

                    // Store original position
                    cubelet.userData.originalPosition = cubelet.position.clone();
                    cubelet.userData.gridPosition = { x, y, z };

                    this.cubelets.push(cubelet);
                    this.cubeGroup.add(cubelet);
                }
            }
        }

        // Add black edges
        const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

        this.cubelets.forEach(cubelet => {
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            cubelet.add(edges);
        });
    }

    rotateFace(face, clockwise = true, animate = true) {
        if (this.isAnimating && animate) {
            this.animationQueue.push({ face, clockwise, animate });
            return;
        }

        const angle = clockwise ? -Math.PI / 2 : Math.PI / 2;
        let axis, condition;

        switch (face) {
            case 'U': // Up
                axis = new THREE.Vector3(0, 1, 0);
                condition = (c) => Math.abs(c.userData.gridPosition.y - 1) < 0.1;
                break;
            case 'D': // Down
                axis = new THREE.Vector3(0, 1, 0);
                condition = (c) => Math.abs(c.userData.gridPosition.y + 1) < 0.1;
                break;
            case 'F': // Front
                axis = new THREE.Vector3(0, 0, 1);
                condition = (c) => Math.abs(c.userData.gridPosition.z - 1) < 0.1;
                break;
            case 'B': // Back
                axis = new THREE.Vector3(0, 0, 1);
                condition = (c) => Math.abs(c.userData.gridPosition.z + 1) < 0.1;
                break;
            case 'R': // Right
                axis = new THREE.Vector3(1, 0, 0);
                condition = (c) => Math.abs(c.userData.gridPosition.x - 1) < 0.1;
                break;
            case 'L': // Left
                axis = new THREE.Vector3(1, 0, 0);
                condition = (c) => Math.abs(c.userData.gridPosition.x + 1) < 0.1;
                break;
        }

        const cubeletsToRotate = this.cubelets.filter(condition);

        if (animate) {
            this.animateRotation(cubeletsToRotate, axis, angle, () => {
                this.updateStateAfterRotation(face, clockwise);
                this.processQueue();
            });
        } else {
            // Instant rotation for solving
            cubeletsToRotate.forEach(cubelet => {
                const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
                cubelet.position.applyMatrix4(rotationMatrix);
                cubelet.rotation.setFromRotationMatrix(
                    rotationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(cubelet.rotation))
                );
                
                // Update grid position
                const pos = cubelet.userData.gridPosition;
                const newPos = new THREE.Vector3(pos.x, pos.y, pos.z);
                newPos.applyMatrix4(rotationMatrix);
                cubelet.userData.gridPosition = {
                    x: Math.round(newPos.x),
                    y: Math.round(newPos.y),
                    z: Math.round(newPos.z)
                };
            });
            this.updateStateAfterRotation(face, clockwise);
        }
    }

    animateRotation(cubelets, axis, targetAngle, callback) {
        this.isAnimating = true;
        const duration = 150; // ms - faster animations
        const startTime = Date.now();
        const group = new THREE.Group();
        this.cubeGroup.add(group);

        cubelets.forEach(cubelet => {
            this.cubeGroup.remove(cubelet);
            group.add(cubelet);
        });

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);
            const currentAngle = targetAngle * eased;

            group.rotation.setFromVector3(axis.clone().multiplyScalar(currentAngle));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Finalize rotation
                cubelets.forEach(cubelet => {
                    const worldPos = new THREE.Vector3();
                    const worldRot = new THREE.Quaternion();
                    cubelet.getWorldPosition(worldPos);
                    cubelet.getWorldQuaternion(worldRot);

                    group.remove(cubelet);
                    this.cubeGroup.add(cubelet);

                    cubelet.position.copy(worldPos);
                    cubelet.rotation.setFromQuaternion(worldRot);

                    // Update grid position
                    cubelet.userData.gridPosition = {
                        x: Math.round(cubelet.position.x),
                        y: Math.round(cubelet.position.y),
                        z: Math.round(cubelet.position.z)
                    };
                });

                this.cubeGroup.remove(group);
                this.isAnimating = false;
                if (callback) callback();
            }
        };

        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    updateStateAfterRotation(face, clockwise) {
        // Simplified state update - in a full implementation, 
        // this would track the actual color positions
        // For this demo, we'll track moves for solving
    }

    processQueue() {
        if (this.animationQueue.length > 0) {
            const next = this.animationQueue.shift();
            this.rotateFace(next.face, next.clockwise, next.animate);
        }
    }

    scramble() {
        if (this.isAnimating) return;
        
        this.updateStatus('Scrambling...');
        this.scrambleMoves = []; // Clear previous scramble moves
        const moves = ['U', 'D', 'F', 'B', 'R', 'L'];
        const scrambleLength = 20;

        for (let i = 0; i < scrambleLength; i++) {
            const face = moves[Math.floor(Math.random() * moves.length)];
            const clockwise = Math.random() > 0.5;
            this.scrambleMoves.push({ face, clockwise }); // Track the move
            this.rotateFace(face, clockwise, true);
        }

        // Update status after scrambling (adjusted for faster animation)
        setTimeout(() => {
            this.updateStatus('Scrambled! Ready to solve.');
        }, scrambleLength * 150 + 100);
    }

    solve() {
        if (this.isAnimating) return;
        
        if (this.scrambleMoves.length === 0) {
            this.updateStatus('Cube is already solved!');
            return;
        }
        
        this.updateStatus('Solving...');
        
        // Reverse the scramble moves to solve the cube
        const solveMoves = this.generateSolveMoves();
        
        solveMoves.forEach(move => {
            this.rotateFace(move.face, move.clockwise, true);
        });

        setTimeout(() => {
            this.updateStatus('Solved!');
            this.scrambleMoves = []; // Clear scramble moves after solving
        }, solveMoves.length * 150 + 100);
    }

    generateSolveMoves() {
        // Reverse the scramble moves to solve the cube
        // Go through scramble moves in reverse order and invert the direction
        const solveMoves = [];
        
        for (let i = this.scrambleMoves.length - 1; i >= 0; i--) {
            const move = this.scrambleMoves[i];
            solveMoves.push({
                face: move.face,
                clockwise: !move.clockwise // Invert the direction
            });
        }

        return solveMoves;
    }

    reset() {
        if (this.isAnimating) return;
        
        this.updateStatus('Resetting...');
        
        // Clear animation queue and scramble moves
        this.animationQueue = [];
        this.scrambleMoves = [];
        
        // Remove old cube
        this.scene.remove(this.cubeGroup);
        this.cubelets = [];
        
        // Create new cube
        this.createCube();
        this.state = this.getInitialState();
        
        this.updateStatus('Reset complete!');
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    setupControls() {
        const scrambleBtn = document.getElementById('scramble-btn');
        const solveBtn = document.getElementById('solve-btn');
        const resetBtn = document.getElementById('reset-btn');

        scrambleBtn.addEventListener('click', () => this.scramble());
        solveBtn.addEventListener('click', () => this.solve());
        resetBtn.addEventListener('click', () => this.reset());
    }
}

// Initialize the cube when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new RubiksCube();
});

// Made with Bob

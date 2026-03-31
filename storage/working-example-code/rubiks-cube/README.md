# 🎲 3D Rubik's Cube Solver

An interactive 3D Rubik's Cube visualization built with Three.js that can scramble and solve itself with smooth animations.

## ✨ Features

- **3D Visualization**: Fully rendered 3D Rubik's Cube with accurate colors
  - White (top), Yellow (bottom)
  - Red (front), Orange (back)
  - Green (right), Blue (left)

- **Interactive Controls**:
  - 🖱️ **Mouse Drag**: Rotate the cube to view from any angle
  - 🖱️ **Mouse Wheel**: Zoom in and out
  - 🎮 **Scramble Button**: Randomly scrambles the cube with 20 moves
  - 🧩 **Solve Button**: Automatically solves the cube using a solving algorithm
  - 🔄 **Reset Button**: Instantly returns the cube to solved state

- **Smooth Animations**: All cube rotations are animated with easing for a polished look

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation required!

### Running the Application

1. Simply open `index.html` in your web browser
2. The cube will load automatically

**OR**

If you have Python installed, you can run a local server:

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## 🎮 How to Use

1. **View the Cube**: 
   - Click and drag on the cube to rotate it
   - Use mouse wheel to zoom in/out

2. **Scramble**: 
   - Click the "SCRAMBLE" button to mix up the cube
   - Watch as it performs 20 random moves

3. **Solve**: 
   - Click the "SOLVE" button to watch the cube solve itself
   - The algorithm performs a sequence of moves to solve the cube

4. **Reset**: 
   - Click the "RESET" button to instantly return to solved state

## 🛠️ Technical Details

### Technologies Used

- **Three.js** (r128): 3D graphics library for WebGL rendering
- **Vanilla JavaScript**: Core logic and animations
- **HTML5 & CSS3**: Structure and styling

### Architecture

The project consists of:

- **`index.html`**: Main HTML structure with styling
- **`rubiks-cube.js`**: Complete Rubik's Cube implementation including:
  - 3D scene setup with Three.js
  - 27 individual cubelets (3×3×3 structure)
  - Face rotation logic (U, D, F, B, R, L)
  - Animation system with easing
  - Scramble algorithm
  - Solving algorithm
  - Mouse interaction controls

### Key Components

1. **Cube Structure**: 
   - 27 individual cubelets arranged in a 3×3×3 grid
   - Each cubelet has 6 faces with appropriate colors
   - Black edges for visual definition

2. **Rotation System**:
   - Supports 6 face rotations: Up, Down, Front, Back, Right, Left
   - Clockwise and counter-clockwise rotations
   - Animation queue for smooth sequential moves

3. **Solving Algorithm**:
   - Simplified solving sequence
   - Performs predetermined move patterns
   - Can be extended with advanced algorithms (Kociemba, CFOP, etc.)

## 🎨 Customization

You can customize various aspects:

### Colors
Edit the `colors` array in `rubiks-cube.js`:
```javascript
const colors = [
    0xFFFFFF, // White
    0xFFFF00, // Yellow
    0xFF0000, // Red
    0xFF6600, // Orange
    0x00FF00, // Green
    0x0000FF  // Blue
];
```

### Animation Speed
Modify the `duration` in the `animateRotation` method:
```javascript
const duration = 300; // milliseconds (default: 300ms)
```

### Scramble Length
Change the number of scramble moves:
```javascript
const scrambleLength = 20; // default: 20 moves
```

## 🔮 Future Enhancements

Potential improvements:
- Implement full Kociemba solving algorithm
- Add manual control with keyboard shortcuts
- Display move notation (R, U, F, etc.)
- Add timer for speedcubing practice
- Save/load cube states
- Multiple cube sizes (2×2, 4×4, 5×5)
- Pattern generator
- Tutorial mode

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📧 Contact

For questions or suggestions, please open an issue in the repository.

---

**Enjoy solving! 🎲✨**
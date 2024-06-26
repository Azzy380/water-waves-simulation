# Water Wave Simulation

This project simulates water waves in a 2D grid using JavaScript and HTML5 canvas. Users can interact with the simulation by adding wave sources and obstacles, and adjusting various parameters to see their effects on the wave propagation.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time water wave simulation on a canvas.
- Adjustable parameters for damping, grid resolution, wave speed, and wave height.
- Ability to draw obstacles and add wave sources interactively.
- Dark mode support for better visibility.

## Installation

To run the simulation locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/water-wave-simulation.git
   ```

2. Navigate to the project directory:
   ```bash
   cd water-wave-simulation
   ```

3. Open `index.html` in your web browser:
   ```bash
   open index.html
   ```
   or simply drag the `index.html` file into your browser window.

## Usage

### Interacting with the Simulation

- **Drawing Obstacles**: Click the "Draw Obstacles" button, then click on the canvas to place obstacles. Adjust the obstacle size using the "Obstacle Size" slider.
- **Adding Wave Sources**: Click the "Add Wave Source" button, then click on the canvas to place wave sources. You can adjust the amplitude and frequency of these sources.
- **Generating Waves**: Click directly on the canvas to create wave disturbances if in "waves" mode.
- **Toggling Dark Mode**: Use the toggle switch to switch between light and dark modes.

### Adjusting Parameters

- **Damping**: Controls how quickly the waves dissipate.
- **Grid Resolution**: Sets the resolution of the grid; higher values give a finer grid.
- **Speed**: Controls how fast the simulation updates.
- **Wave Height**: Adjusts the initial height of the generated waves.
- **Wave Source Amplitude**: Controls the amplitude of the waves generated by the sources.
- **Wave Source Frequency**: Controls the frequency of the waves generated by the sources.

## Components

### Main Files

- `index.html`: The main HTML file containing the structure of the web page.
- `style.css`: The CSS file for styling the web page.
- `js/Main.js`: The main JavaScript entry point that initializes and starts the simulation.
- `js/Grid.js`: Contains the `Grid` class responsible for managing the wave data and simulation grid.
- `js/Obstacle.js`: Contains the `Obstacle` class for creating and managing obstacles.
- `js/WaveSource.js`: Contains the `WaveSource` class for creating and managing wave sources.
- `js/Simulation.js`: Contains the `Simulation` class that integrates all components and handles user interactions and rendering.

### Example of Initialization

```javascript
import { Simulation } from './Simulation.js';

window.addEventListener('load', () => {
    const simulation = new Simulation('waterCanvas');
});
```

## Configuration

You can customize the simulation by adjusting the sliders and buttons provided in the control panel on the web page. The parameters are dynamically updated, providing immediate feedback on the simulation.

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, feel free to fork the repository and submit a pull request. Please ensure your changes are well-documented and tested.

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to your fork.
4. Open a pull request describing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to reach out if you have any questions or suggestions regarding the project. Happy simulating!
export class WaveSource {
    constructor(x, y, amplitude, frequency) {
        this.x = x; // X-coordinate of the wave source
        this.y = y; // Y-coordinate of the wave source
        this.amplitude = amplitude; // Amplitude of the wave
        this.frequency = frequency; // Frequency of the wave
    }

    // Generates the wave value at a given time
    generateWave(time) {
        const waveValue = this.amplitude * Math.sin(this.frequency * time / 1000);
        return waveValue;
    }
}

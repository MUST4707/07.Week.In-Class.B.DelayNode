// --------------------- Variable Declarations -----------

 // * Time interval between frequency steps in milliseconds
let stepTime = 125.0;


//Glide time for frequency transitions in milliseconds

let glideTime = 10.0;


//Array of frequencies for the E♭ minor pentatonic scale

const ebMinPentFreqs = [
    77.78, 92.50, 103.83, 116.54, 138.59,
    155.56, 185.00, 207.65, 233.08, 277.18, 311.13
];

// --------------------- Function Expressions -----------

/**
 * Converts a linear amplitude to dB scale.
 * @param {number} linAmp - The linear amplitude value.
 * @returns {number} The corresponding amplitude in dB.
 */
const dBtoA = function(linAmp) {
    return Math.pow(10, linAmp / 20);
};

/**
 * Enables audio playback by resuming the AudioContext and starting the oscillator.
 */
const enableAudio = function() {
    audCtx.resume();
    sawOsc.start();
    randoStep();
};

/**
 * Updates the master gain based on the fader input.
 */
const updateMasterGain = function() {
    let amp = dBtoA(fader.value);
    masterGain.gain.exponentialRampToValueAtTime(amp, audCtx.currentTime + 0.01);
    faderLabel.innerText = `${fader.value} dBFS`;
};

/**
 * Updates the glide time based on the slider input.
 */
const updateGlide = function() {
    glideTime = glideSlider.value;
    glideLabel.innerText = `${glideSlider.value} ms`;
};

/**
 * Updates the step time based on the slider input.
 */
const updateStepTime = function() {
    stepTime = stepSlider.value;
    stepLabel.innerText = `${stepSlider.value} ms`;
};

/**
 * Updates the delay time based on the slider input.
 */
const updateDelay = function(){
    delayLabel.innerText = `${delaySlider.value} ms`
}
/**
 * Updates the feedback amount based on the slider input.
 */
const updateFeedback= function(){
    feedbackLabel.innerText = `${feedbackSlider.value} %`
}

/**
 * Updates the cutoff frequency based on the slider input.
 */
const updateEQ= function(){
    eqLabel.innerText = `${eqSlider.value} Hz`

}



/**
 * Randomly selects a frequency from the E♭ minor pentatonic scale
 * and sets it as the oscillator frequency with exponential glide.
 */
const randoStep = function() {
    //This is a formula to find a random integer between zero and the length of the array.
    //thisis good for getting a random element from the array
    let randIndex = Math.floor(Math.random() * ebMinPentFreqs.length);
    let newFreq = ebMinPentFreqs[randIndex];
    sawOsc.frequency.exponentialRampToValueAtTime(newFreq, audCtx.currentTime + glideTime / 1000);
    //we haven't covered this yet, but the next line is a form of recursion, "calling the function within itself"
    //setTimeout is a delay, it waits a certain number of milliseconds to execute the funtion.
    setTimeout(randoStep, stepTime);
};

// ------------------------- WebAudio Setup --------------------------

/** @type {AudioContext} */
const audCtx = new AudioContext();

// ------------------------- Main Oscillator --------------------------

/** @type {OscillatorNode} */
let sawOsc = audCtx.createOscillator();
sawOsc.type = "sawtooth";

// ------------------------- Master Gain --------------------------

/** @type {GainNode} */
let masterGain = audCtx.createGain();
masterGain.gain.value = 0.125; // Default to -12 dBFS

// ------------------------- Connections --------------------------
sawOsc.connect(masterGain);
masterGain.connect(audCtx.destination);

// ------------------------- Get HTML Elements --------------------------

let enableButton = document.getElementById("enableAudio");
let fader = document.getElementById("masterFader");
let faderLabel = document.getElementById("fadeLabel");
let glideSlider = document.getElementById("GlideTime");
let stepSlider = document.getElementById("StepTime");
let stepLabel = document.getElementById("stepLabel");
let glideLabel = document.getElementById("glideLabel");
let delaySlider = document.getElementById("DelayTime");
let delayLabel = document.getElementById("delayLabel");
let feedbackSlider = document.getElementById("FeedbackAmount");
let feedbackLabel = document.getElementById("fbLabel");
let eqSlider = document.getElementById("cutoffFreq");
let eqLabel = document.getElementById("eqLabel");

// ------------------------- Add Event Listeners --------------------------

enableButton.addEventListener("click", enableAudio);
fader.addEventListener("input", updateMasterGain);
glideSlider.addEventListener("input", updateGlide);
stepSlider.addEventListener("input", updateStepTime);
delaySlider.addEventListener("input", updateDelay);
feedbackSlider.addEventListener("input", updateFeedback);
eqSlider.addEventListener("input", updateEQ);

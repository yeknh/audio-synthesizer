const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');

// for recreating the color pattern
const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 540 ],
  animate: true
};

let audio;
let audioContext, audioData, sourceNode, analyserNode, bufferLength;
let manager;


const sketch = () => {
  random.setSeed(seed)
  console.log(seed)

  const rectColors = [
    random.pick(risoColors).hex,
    random.pick(risoColors).hex,
    random.pick(risoColors).hex
  ]


  return ({ context, width, height }) => {
    // canvas
    context.fillStyle = '#eeeae0';
    context.fillRect(0, 0, width, height);

    // synth
    const barWidth = width / bufferLength
    let barHeight;
    let x = 0;
    if(!audioContext) return;


  const animate = () => {
    analyserNode.getByteFrequencyData(audioData);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = audioData[i]
      context.fillStyle = random.pick(rectColors)
      context.fillRect(x, height - barHeight, barWidth, barHeight)
      x += barWidth
    }
  }

  animate()

  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio()

    if (audio.paused) {
      audio.play();
      manager.play();
    }
    else {
      audio.pause();
      manager.pause();
    }
  })
}

const createAudio = (src = 'audio/Ikoliks - Big City Lights.mp3') => {
  audio = document.createElement('audio')
  src = 'audio/NM - Thinking About You.mp3'
  audio.src = src
  audio.crossOrigin = "anonymous";

  audioContext = new AudioContext()

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 64;
  sourceNode.connect(analyserNode);

  bufferLength = analyserNode.frequencyBinCount
  audioData = new Uint8Array(analyserNode.frequencyBinCount)
}


const start = async () => {
  addListeners()
  manager = await canvasSketch(sketch, settings);
  manager.pause()
}

start()

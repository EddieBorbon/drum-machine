import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const drumPads = [
  { id: 'Heater-1', key: 'Q', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },
  { id: 'Heater-2', key: 'W', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },
  { id: 'Heater-3', key: 'E', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },
  { id: 'Heater-4', key: 'A', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },
  { id: 'Clap', key: 'S', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },
  { id: 'Open-HH', key: 'D', src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },
  { id: 'Kick-n-Hat', key: 'Z', src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },
  { id: 'Kick', key: 'X', src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },
  { id: 'Closed-HH', key: 'C', src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' },
];

const DrumMachine = () => {
  const [displayText, setDisplayText] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [sequence, setSequence] = useState(Array(drumPads.length).fill(Array(16).fill(false)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120); // Default BPM
  const intervalRef = useRef(null);

  const playSound = (key, id) => {
    const audio = document.getElementById(key);
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play();
    setDisplayText(id);
  };

  const toggleStep = (trackIndex, stepIndex) => {
    const newSequence = sequence.map((track, i) =>
      i === trackIndex ? track.map((step, j) => (j === stepIndex ? !step : step)) : track
    );
    setSequence(newSequence);
  };

  const startSequence = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const intervalTime = (60 / bpm) * 1000; // Calculate interval time based on BPM
    intervalRef.current = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % 16);
    }, intervalTime);
  };

  const stopSequence = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const pad = drumPads.find(pad => pad.key === e.key.toUpperCase());
      if (pad) {
        playSound(pad.key, pad.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      sequence.forEach((track, trackIndex) => {
        if (track[currentStep]) {
          playSound(drumPads[trackIndex].key, drumPads[trackIndex].id);
        }
      });
    }
  }, [currentStep, isPlaying, sequence]);

  return (
    <div id="app-container">
      <div id="title">Drum Machine and Sequencer</div>
      <div id="drum-machine">
        <div className="left-section">
          <div id="display">{displayText}</div>
          <div className="controls">
            <div className="control-group">
              <label htmlFor="volume" className="control-label">VOLUME</label>
              <input
                type="range"
                id="volume"
                className="volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>
            <div className="bpm-slider-container">
              <label htmlFor="bpm" className="control-label">BPM</label>
              <input
                type="range"
                id="bpm"
                className="bpm-slider"
                min="60"
                max="240"
                step="1"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
              />
              <span>{bpm}</span>
            </div>
          </div>
          <div className="drum-pads">
            {drumPads.map(pad => (
              <div
                key={pad.key}
                className="drum-pad"
                id={pad.id}
                onClick={() => playSound(pad.key, pad.id)}
              >
                {pad.key}
                <audio
                  src={pad.src}
                  className="clip"
                  id={pad.key}
                ></audio>
              </div>
            ))}
          </div>
        </div>
        <div className="right-section">
          <div className="sequencer">
            <div className="sequencer-tracks">
              {sequence.map((track, trackIndex) => (
                <div key={trackIndex} className="sequencer-track">
                  <div className="sequencer-track-label">{drumPads[trackIndex].id}</div>
                  <div className="sequencer-steps">
                    {track.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`sequencer-step ${step ? 'active' : ''}`}
                        onClick={() => toggleStep(trackIndex, stepIndex)}
                      >
                        {step ? '●' : '○'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="sequencer-controls">
              <button onClick={startSequence} disabled={isPlaying}>START</button>
              <button onClick={stopSequence} disabled={!isPlaying}>STOP</button>
            </div>
          </div>
        </div>
      </div>
      <div id="developer-message">Developed by Eddie Jonathan Garcia Borbon</div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <DrumMachine />
    </div>
  );
};

export default App;
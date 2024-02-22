import React, { useState } from 'react';
import '../../styles/SoundButton.css';

const SoundButton = () => {
  const [isMuted, setIsMuted] = useState(false); // State to track if sound is muted

  const handleClick = () => {
    setIsMuted(!isMuted); // Toggle the isMuted state
  };

  return (
    <button className="sound-button" onClick={handleClick}>
      {isMuted ? '🔇 MUTED...' : '🔊 SOUND PLAYING...'}
    </button>
  );
};

export default SoundButton;
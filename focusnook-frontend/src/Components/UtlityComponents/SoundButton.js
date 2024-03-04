import React, { useState } from 'react';
import '../../styles/SoundButton.css';
import { useTheme } from '../../contexts/ThemeContext';

const SoundButton = () => {

  const { isMuted, setIsMuted, playThemeAudio, pauseThemeAudio } = useTheme();

  const handleClick = () => {
    setIsMuted(!isMuted); // Toggle the isMuted state
    if (isMuted) {
      playThemeAudio(); // Play audio when unmuted
    } else {
      pauseThemeAudio(); // Pause audio when muted
    }
  };

  return (
    <button className="sound-button" onClick={handleClick}>
      {isMuted ? '🔇 MUTED...' : '🔊 SOUND PLAYING...'}
    </button>
  );
};

export default SoundButton;
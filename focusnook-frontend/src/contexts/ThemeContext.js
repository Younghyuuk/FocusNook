import React, { createContext, useContext, useState, useEffect } from 'react';
// Import audio files
import witchCottageAudio from '../sounds/witch-cottage.mp3';
import sunnyGreenhouseAudio from '../sounds/sunny-greenhouse.mp3';
import mermaidStudyAudio from '../sounds/mermaid-study.mp3';
import autumnDreamAudio from '../sounds/autumn-dream.mp3';
import magicDormAudio from '../sounds/magic-dorm.mp3';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [currTheme, setCurrTheme] = useState('');
  const [backgroundClass, setBackgroundClass] = useState('');
  const [backgroundAudio, setBackgroundAudio] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Define theme mappings
  const themeMappings = {
    'Witch Cottage': { class: 'background-witch-cottage', audioUrl: witchCottageAudio },
    'Sunny Greenhouse': { class: 'background-sunny-greenhouse', audioUrl: sunnyGreenhouseAudio },
    'Mermaid Study': { class: 'background-mermaid-study', audioUrl: mermaidStudyAudio },
    'Autumn Dream': { class: 'background-autumn-dream', audioUrl: autumnDreamAudio },
    'Magic Dorm': { class: 'background-magic-dorm', audioUrl: magicDormAudio },
  };

  useEffect(() => {
    // When currTheme changes, update background class
    const theme = themeMappings[currTheme];
    if (theme) {
      setBackgroundClass(theme.class); // Update the background class based on the current theme
    }
  }, [currTheme]); // This effect runs when currTheme changes

  const changeCurrTheme = (themeName) => {
    setCurrTheme(themeName); // Update the current theme
  };

  const changeThemeAudio = (themeName) => {
    const theme = themeMappings[themeName];
    if (!theme) return; // If theme name is not found, exit
  
    if (backgroundAudio) {
      backgroundAudio.pause(); // Pause the current audio if any
    }
    
    const audio = new Audio(theme.audioUrl);
    audio.loop = true;
    audio.play();
    setBackgroundAudio(audio); // Update the background audio
    
    setIsMuted(false); // Set isMuted to false
  };

  const playThemeAudio = () => {
    // Play audio for the current theme
    const theme = themeMappings[currTheme];
    if (!theme) return; // If theme name is not found, exit
  
    if (backgroundAudio) {
      if (backgroundAudio.paused) {
        // If audio is paused, resume playback
        backgroundAudio.play();
      } else {
        // If audio is not paused, pause the current audio and play the new one
        backgroundAudio.pause();
        const audio = new Audio(theme.audioUrl);
        audio.loop = true;
        audio.play();
        setBackgroundAudio(audio);
      }
    } else {
      // If no background audio is currently playing, play the new audio
      const audio = new Audio(theme.audioUrl);
      audio.loop = true;
      audio.play();
      setBackgroundAudio(audio);
    }
  };

  const pauseThemeAudio = () => {
    if (backgroundAudio) {
      backgroundAudio.pause();
    }
  };

  return (
    <ThemeContext.Provider value={{ backgroundClass, changeCurrTheme, playThemeAudio, changeThemeAudio, pauseThemeAudio, isMuted, setIsMuted}}>
      {children}
    </ThemeContext.Provider>
  );
};
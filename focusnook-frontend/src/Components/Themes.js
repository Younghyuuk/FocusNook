import React from 'react';
import '../styles/TopBar.css'; // Your CSS file for styling
import '../styles/Themes.css';
import witchCottageImg from '../assets/witch cottage.png';
import sunnyGreenhouseImg from '../assets/sunny greenhouse.png';
import mermaidStudyImg from '../assets/mermaid study.png';
import autumnDreamImg from '../assets/autumn dream.png';
import magicDormImg from '../assets/magic dorm.png';
import { useTheme } from '../contexts/ThemeContext';

function Themes() {
    const { changeBackgroundClass } = useTheme();
    const themes = [
        { name: 'Witch Cottage', image: witchCottageImg, class: 'background-witch-cottage' },
        { name: 'Sunny Greenhouse', image: sunnyGreenhouseImg, class: 'background-sunny-greenhouse' },
        { name: 'Mermaid Study', image: mermaidStudyImg, class: 'background-mermaid-study' },
        { name: 'Autumn Dream', image: autumnDreamImg, class: 'background-autumn-dream' },
        { name: 'Magic Dorm', image: magicDormImg, class: 'background-magic-dorm' },
    ];                                                          

    return (
        <div className="themes-main-container">
          <h1>Themes</h1>
          <div className="themes-container">
          <ul>
            {themes.map((theme, index) => (
              <li key={index}>
                <button className={`theme-button`} onClick={() => changeBackgroundClass(theme.class)}>
                  <img src={theme.image} className="image-inside-button" alt={`${theme.name} Theme` } />
                </button>
              </li>
            ))}
          </ul>
          </div>
        </div>
      );
    };

export default Themes;

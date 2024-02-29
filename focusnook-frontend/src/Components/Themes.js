import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TopBar.css'; // Your CSS file for styling
import '../styles/Themes.css';
import witchCottageImg from '../assets/witch cottage.png';
import sunnyGreenhouseImg from '../assets/sunny greenhouse.png';
import mermaidStudyImg from '../assets/mermaid study.png';
import autumnDreamImg from '../assets/autumn dream.png';
import magicDormImg from '../assets/magic dorm.png';

function Themes() {
    const themes = [
        { name: 'Witch Cottage', image: witchCottageImg },
        { name: 'Sunny Greenhouse', image: sunnyGreenhouseImg },
        { name: 'Mermaid Study', image: mermaidStudyImg },
        { name: 'Autumn Dream', image: autumnDreamImg },
        { name: 'Magic Dorm', image: magicDormImg },
        // Add more themes as needed
    ];

    return (
        <div className="themes-main-container">
          <h1>Themes</h1>
          <div className="themes-container">
          <ul>
            {themes.map((theme, index) => (
              <li key={index}>
                <button className={`theme-button`} onClick={() => console.log(theme.name)}>
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

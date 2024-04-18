import React, {useContext} from 'react';
import '../styles/TopBar.css'; // Your CSS file for styling
import '../styles/Themes.css';
import witchCottageImg from '../assets/witch cottage.png';
import sunnyGreenhouseImg from '../assets/sunny greenhouse.png';
import mermaidStudyImg from '../assets/mermaid study.png'; 
import autumnDreamImg from '../assets/autumn dream.png';
import magicDormImg from '../assets/magic dorm.png';
import axios from 'axios'; 
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from "../contexts/AuthContext";

function Themes() {
  const { changeCurrTheme, changeThemeAudio } = useTheme();
  const themes = [
    { name: 'Witch Cottage', image: witchCottageImg, class: 'background-witch-cottage' },
    { name: 'Sunny Greenhouse', image: sunnyGreenhouseImg, class: 'background-sunny-greenhouse', },
    { name: 'Mermaid Study', image: mermaidStudyImg, class: 'background-mermaid-study' },
    { name: 'Autumn Dream', image: autumnDreamImg, class: 'background-autumn-dream' },
    { name: 'Magic Dorm', image: magicDormImg, class: 'background-magic-dorm' },
  ];      
  const { authToken } = useContext(AuthContext);                                                    


  const handleThemeChange = async (themeName) => {
    try {
      // Make an API call to update the default_theme
      const response = await axios.put(
        "http://localhost:2000/profile/default-theme",
        { default_theme: themeName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log("User's default theme updated:", response.data);
      
      // If the API call is successful, update the theme in the frontend
      changeCurrTheme(themeName);
      changeThemeAudio(themeName);
    } catch (error) {
      console.error("Error updating default theme:", error);
    }
  };

  return (
    <div className="themes-main-container">
      <h1>Themes</h1>
      <div className="themes-container">
        <ul>
          {themes.map((theme, index) => (
            <li key={index}>
              <button className={`theme-button`} onClick={() => handleThemeChange(theme.name)}>
                <img src={theme.image} className="image-inside-button" alt={`${theme.name} Theme` } />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Themes;
import React, { useState, useEffect, useContext } from 'react';
import '../styles/Calendar.css';
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

function Calendar() {
  const { authToken } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarId, setCalendarId] = useState('');
  const [events, setEvents] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

 // Fetch calendar ID
 useEffect(() => {
  const fetchCalendarId = async () => {
    try {
      const response = await axios.get("http://localhost:2000/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCalendarId(response.data.calendarId);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  if (authToken) fetchCalendarId();
}, [authToken]);

// Fetch events for the current month
useEffect(() => {
  const fetchEvents = async () => {
    if (!calendarId) return;

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const response = await axios.get(`http://localhost:2000/calendarId/${calendarId}/events`, {
        params: {
          startTime: firstDayOfMonth.toISOString(),
          endTime: lastDayOfMonth.toISOString(),
        },
      });

      // Assuming the events are under the 'events' key and structured by date
      const eventsByDate = response.data.events;
      const allEvents = Object.keys(eventsByDate).reduce((acc, date) => {
        const eventsForDate = eventsByDate[date];
        return acc.concat(eventsForDate);
      }, []);

      setEvents(allEvents);
      console.log(allEvents); // This will log the flattened array of all events
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); // Set to an empty array on error
    }
  };

  fetchEvents();
}, [currentDate, calendarId]);


const generateMatrix = () => {
  let matrix = [];
  matrix[0] = daysOfWeek;

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  let firstDay = new Date(year, month, 1).getDay();
  let maxDays = new Date(year, month + 1, 0).getDate();
  let counter = 1;

  for (let row = 1; row < 7; row++) {
    matrix[row] = [];
    for (let col = 0; col < 7; col++) {
      matrix[row][col] = -1;
      if (row === 1 && col >= firstDay) {
        // Fill the first row from the first day of the month
        matrix[row][col] = counter++;
      } else if (row > 1 && counter <= maxDays) {
        // Fill the remaining rows until the end of the month
        matrix[row][col] = counter++;
      }
    }
  }

  matrix.forEach((row, rowIndex) => {
    if (rowIndex > 0) { // Skip the day of week header
      row.forEach((day, colIndex) => {
        if (day !== -1) {
          const eventForDay = events.find(event => {
            const eventDateUTC = new Date(event.endTime);
            // Create a date object for the UTC date to avoid timezone issues
            const eventDate = new Date(eventDateUTC.getUTCFullYear(), eventDateUTC.getUTCMonth(), eventDateUTC.getUTCDate());
            // Now we compare against a cellDate that is also in the local time zone
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);


            return eventDate.getFullYear() === cellDate.getFullYear() &&
                   eventDate.getMonth() === cellDate.getMonth() &&
                   eventDate.getDate() === cellDate.getDate();
          });
          matrix[rowIndex][colIndex] = { day, event: eventForDay };
        }
      });
    }
  });

  return matrix;
};
  const handlePrevMonth = () => {
    let newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    let newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(newDate);
  };

  let matrix = generateMatrix();

  return (
    <div id="calendar-container">
      <header>
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button onClick={handleNextMonth}>&gt;</button>
      </header>
      <table className="calendar">
    <tbody>
      {matrix.map((row, rowIndex) => {
        return (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              return (
                <td key={cellIndex} className={rowIndex === 0 ? "dayOfWeek" : ""}>
                  {cell.day !== -1 ? cell.day : ''}
                  {/* Render the event title if there is an event */}
                  {cell.event && (
                     <div className="event">
                     {cell.event.title.slice(0, 6)}
                     {cell.event.title.length > 10 ? "..." : ""}
                   </div>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
    </div>
  );
}

export default Calendar;

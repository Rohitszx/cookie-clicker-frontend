import React, { useState, useEffect } from 'react';
import './App.css';
const SERVER_URL = 'https://cookie-clicker-backend.onrender.com';

const App = () => {
  const [score, setScore] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/user-stats`);
        const data = await response.json();
        setScore(data.score);
        setPrizes(data.prizes);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleClick = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/click`, { method: 'POST' });
      const data = await response.json();
      setScore(data.score);
      
      if (data.tenPointBonus) {
        setMessage('10 Point Bonus!');
        setTimeout(() => setMessage(''), 2000);
      }
      
      if (data.prize) {
        setMessage('You won a prize!');
        setTimeout(() => setMessage(''), 2000);
        setPrizes(prev => prev + 1);
      }
    } catch (error) {
      console.error('Click error:', error);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/reset`, { method: 'POST' });
      const data = await response.json();
      setTimeout(() => {
        setScore(data.score);
        setPrizes(data.prizes);
        setMessage('Game Reset!');
        setIsResetting(false);
      }, 1000);
    } catch (error) {
      console.error('Reset error:', error);
      setIsResetting(false);
    }
  };

  return (
    <div className="game-container">
      <div className="game-card">
        <h1>Clicker Game</h1>
        <div className="stats">
          <p>Score: {score}</p>
          <p>Prizes: {prizes}</p>
          {message && <div className="message">{message}</div>}
        </div>
        <div className="button-group">
          <button 
            onClick={handleClick}
            className="click-button"
          >
            Click Me!
          </button>
          <button 
            onClick={handleReset}
            className={`reset-button ${isResetting ? 'resetting' : ''}`}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : 'Reset Game'}
          </button>
        </div>
      </div>
      <div className="resume-section">
        <a 
          href="https://drive.google.com/file/d/1idRlPKaHQSeLMg-EZK89LKg8d2gBHwxE/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="resume-link"
        >
          View My Resume
        </a>
      </div>
    </div>
  );
};

export default App;

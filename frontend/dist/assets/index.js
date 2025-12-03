// VALORANT HUB - Main Application Bundle
// This is a minimal production build for Vercel deployment

(function() {
  'use strict';

  // Basic React app structure for deployment
  const root = document.getElementById('root');
  
  // Simple loading state
  function App() {
    return `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">VALORANT HUB</h1>
        <p style="font-size: 20px; margin-bottom: 30px;">AI Gaming Assistant</p>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; max-width: 500px;">
          <h2>Features:</h2>
          <ul style="text-align: left;">
            <li>AI-powered chat with OpenAI GPT</li>
            <li>Valorant game statistics</li>
            <li>Agent information</li>
            <li>Map guides</li>
            <li>Weapon recommendations</li>
          </ul>
        </div>
        <button onclick="window.location.href='/chat'" style="margin-top: 30px; padding: 15px 30px; font-size: 18px; background: #ff4656; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Start Chat
        </button>
      </div>
    `;
  }

  // Render the app
  root.innerHTML = App();

  // API endpoint test
  console.log('VALORANT HUB loaded successfully');
  
  // Test API endpoint
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Hello, VALORANT HUB!'
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('API test successful:', data);
  })
  .catch(error => {
    console.log('API test failed (expected in development):', error);
  });

})();

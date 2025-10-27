const http = require('http');

const testData = [
  "порадь агентів для ascent",
  "створи агресивну стратегію для bind",
  "тестове повідомлення"
];

function testMessage(message) {
  const data = JSON.stringify({ message });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n📤 Request: "${message}"`);
    console.log(`📥 Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        console.log('📊 Response:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('📊 Response:', responseData);
      }
      console.log('─'.repeat(50));
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Error: ${error.message}`);
  });

  req.write(data);
  req.end();
}

console.log('🧪 Testing Valorant HUB API...');
console.log('Make sure test server is running on http://localhost:3001\n');

setTimeout(() => {
  testData.forEach((message, index) => {
    setTimeout(() => testMessage(message), index * 1000);
  });
}, 500);

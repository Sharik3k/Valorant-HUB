// Тестовий скрипт для перевірки OpenAI API агента
const http = require('http');

// Тестові повідомлення
const testMessages = [
  {
    name: "Привітання",
    message: "Привіт! Як справи?"
  },
  {
    name: "Питання про агентів",
    message: "Які агенти підходять для мапи Ascent?"
  },
  {
    name: "Стратегія",
    message: "Дай пораду по стратегії для Bind"
  }
];

// Функція для тестування через локальний сервер (якщо запущений)
function testLocalAPI(message, port = 3001) {
  return new Promise((resolve, reject) => {
    const messages = [
      { role: 'user', content: message }
    ];
    
    const data = JSON.stringify({ messages });
    
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

// Функція для тестування через Vercel (production)
async function testVercelAPI(message, url = 'https://your-project.vercel.app') {
  try {
    const messages = [
      { role: 'user', content: message }
    ];
    
    const response = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    throw error;
  }
}

// Головна функція тестування
async function runTests() {
  console.log('🧪 Тестування OpenAI API агента...\n');
  console.log('═'.repeat(60));
  
  // Перевірка змінних середовища
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('⚠️  УВАГА: OPENAI_API_KEY не знайдено в змінних середовища');
    console.log('   Створіть .env файл з OPENAI_API_KEY=sk-...\n');
  } else {
    console.log('✅ OPENAI_API_KEY знайдено');
    console.log(`   Ключ: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);
  }

  // Тестування локального API (якщо backend запущений)
  console.log('📡 Тестування локального API (localhost:3001)...\n');
  
  for (const test of testMessages) {
    try {
      console.log(`\n📤 Тест: ${test.name}`);
      console.log(`   Повідомлення: "${test.message}"`);
      
      const result = await testLocalAPI(test.message);
      
      if (result.status === 200) {
        console.log('   ✅ Успішно!');
        console.log(`   📥 Відповідь: ${result.data.reply?.substring(0, 100)}...`);
      } else {
        console.log(`   ❌ Помилка: ${result.status}`);
        console.log(`   📥 Відповідь: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`   ⚠️  Сервер не запущений на порту 3001`);
        console.log(`   💡 Запустіть: cd backend && npm run dev`);
      } else {
        console.log(`   ❌ Помилка: ${error.message}`);
      }
    }
    
    // Затримка між тестами
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n✨ Тестування завершено!\n');
  
  // Інструкції
  console.log('💡 Якщо локальний сервер не працює:');
  console.log('   1. cd backend');
  console.log('   2. npm install');
  console.log('   3. Створіть .env з OPENAI_API_KEY=sk-...');
  console.log('   4. npm run dev\n');
  
  console.log('💡 Для тестування на Vercel:');
  console.log('   - Оновіть URL в testVercelAPI()');
  console.log('   - Переконайтеся що OPENAI_API_KEY додано в Vercel Environment Variables\n');
}

// Запуск тестів
runTests().catch(console.error);


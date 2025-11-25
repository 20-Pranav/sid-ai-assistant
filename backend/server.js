import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

// Try these model names in order:
const MODEL_OPTIONS = [
  'gemini-1.5-flash-latest',  // Most likely to work
  'gemini-1.5-pro-latest',    // Alternative pro version
  'gemini-pro',               // Original model
  'gemini-1.0-pro'            // Legacy model
];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('🔑 Gemini API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');

const SYSTEM_PROMPT = `You are SID (Smart Intelligent Assistant), a helpful AI assistant.`;

// Function to try different models
async function tryGeminiModels(message) {
  for (const model of MODEL_OPTIONS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log(`🔄 Trying model: ${model}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 600,
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        console.log(`✅ Success with model: ${model}`);
        return {
          success: true,
          model: model,
          response: data.candidates[0].content.parts[0].text
        };
      } else if (data.error) {
        console.log(`❌ Model ${model} failed: ${data.error.message}`);
        // Continue to next model
      }
    } catch (error) {
      console.log(`❌ Model ${model} error: ${error.message}`);
      // Continue to next model
    }
  }
  
  return {
    success: false,
    message: 'All model attempts failed'
  };
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is missing'
      });
    }

    console.log('📨 Processing message:', message);

    const result = await tryGeminiModels(message);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          response: result.response,
          model: result.model
        }
      });
    } else {
      // Fallback to mock response
      const mockResponses = [
        "Hello! I'm SID AI Assistant. Currently testing different AI models.",
        "Hi there! I'm SID, your AI companion. We're configuring the backend right now.",
        "Greetings! I'm SID. The AI service is being optimized for better performance."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      res.json({
        success: true,
        data: {
          response: randomResponse,
          model: 'mock-service',
          note: 'Using mock response while configuring AI models'
        }
      });
    }
  } catch (error) {
    console.error('💥 Server error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'SID AI Backend (Gemini)',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 SID AI Assistant API is running!',
    description: 'Testing Gemini models',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /health'
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 SID AI Backend running on http://localhost:${port}`);
  console.log(`💬 Testing Gemini models...`);
  console.log(`🔑 API Key: ${GEMINI_API_KEY ? 'Loaded' : 'Missing'}`);
});


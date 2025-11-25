import { useState } from 'react'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock AI responses that work without backend
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hola')) {
      return "¡Hola! I'm SID AI Assistant. Nice to meet you! 😊 How can I help you today?"
    } else if (lowerMessage.includes('how are you')) {
      return "I'm doing great! Thanks for asking. I'm excited to chat with you! What would you like to talk about?"
    } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
      return "I can chat with you about anything! Technology, science, creative ideas, learning, or just have a friendly conversation. What interests you?"
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know or discuss?"
    } else if (lowerMessage.includes('name')) {
      return "I'm SID (Smart Intelligent Assistant), your AI companion! 🤖 I'm here to assist you with anything you need."
    } else if (lowerMessage.includes('weather')) {
      return "I don't have real-time weather data, but I'd be happy to discuss climate, seasons, or environmental topics!"
    } else {
      const responses = [
        "That's really interesting! Tell me more about what you're thinking.",
        "I'd love to help you explore that topic! Could you share more details?",
        "Great point! This sounds like a fascinating subject to discuss.",
        "Thanks for bringing that up! I have some thoughts I'd like to share with you.",
        "I understand what you're asking. Let me provide some insights on that.",
        "That's a wonderful question! From my knowledge, this is definitely worth exploring together."
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    // Simulate AI thinking (no API call needed)
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 800 + Math.random() * 400) // Random delay between 0.8-1.2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-center">SID AI Assistant 🚀</h1>
          <p className="text-center text-gray-400">Live Demo - Fully functional in browser</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">Welcome to SID AI Assistant!</p>
              <p className="text-sm">Start a conversation by typing a message below.</p>
              <p className="text-xs mt-2">Try saying: "Hello", "What can you do?", or ask me anything!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors duration-200"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

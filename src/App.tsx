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

  // Enhanced mock AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hola')) {
      return "¡Hola! 👋 I'm SID, your Smart Intelligent Assistant! I'm here to help you with anything - from answering questions to creative brainstorming. What's on your mind today?"
    } else if (lowerMessage.includes('how are you')) {
      return "I'm fantastic! 🤖✨ Ready to dive into some interesting conversations. How about you?"
    } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
      return "I'm your versatile AI companion! 🌟 I can:\n• Answer questions on any topic\n• Help with creative projects\n• Discuss technology & science\n• Assist with learning\n• Or just chat about life!\nWhat would you like to explore?"
    } else if (lowerMessage.includes('thank')) {
      return "You're very welcome! 😊 I'm always happy to help. Is there anything else you're curious about?"
    } else if (lowerMessage.includes('name')) {
      return "I'm SID - which stands for Smart Intelligent Assistant! 🤖 I'm designed to be helpful, knowledgeable, and always ready for a good conversation."
    } else if (lowerMessage.includes('weather')) {
      return "🌤️ I don't have real-time weather data, but I'd love to discuss climate science, seasons, or environmental topics! What interests you about weather?"
    } else if (lowerMessage.includes('love') || lowerMessage.includes('like')) {
      return "That's wonderful! ❤️ I think curiosity and passion are what make conversations truly special. Tell me more about what you enjoy!"
    } else if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      return "Why don't scientists trust atoms? \n\nBecause they make up everything! 😄 \n\nWant to hear another one?"
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! 👋 It was great chatting with you! Come back anytime you want to talk - I'm always here! 🌟"
    } else {
      const responses = [
        "That's fascinating! 🧠 I'd love to explore this topic with you. What specific aspect are you most curious about?",
        "Great question! 💫 This really makes me think. Let me share some perspectives on that...",
        "Interesting point! 🌈 I appreciate you bringing this up. Here's what I know about that topic...",
        "Thanks for sharing that! 🚀 I have some thoughts I'd like to discuss with you...",
        "That's a brilliant observation! 💡 Let me provide some insights based on what I understand...",
        "I love this conversation! 🤝 You've raised a really thoughtful point. Here's my take on it...",
        "That's an excellent question! 🌟 Let me break down what I know about this subject...",
        "Interesting! I've been learning about that too. Here's what I can share... 📚"
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

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Enhanced Header */}
        <header className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">SID AI Assistant</h1>
            <p className="text-blue-100 text-lg">Your intelligent companion for any conversation</p>
            <div className="flex justify-center mt-3 space-x-2">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🤖 AI Powered</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🚀 Live Demo</span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">💬 Smart Chat</span>
            </div>
          </div>
          
          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="absolute right-6 top-6 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm backdrop-blur-sm transition-colors"
            >
              Clear Chat
            </button>
          )}
        </header>

        {/* Messages with Avatars */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-800/20 to-transparent">
          {messages.length === 0 ? (
            <div className="text-center text-gray-300 mt-16">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-2xl font-light mb-2">Welcome to SID AI Assistant!</p>
              <p className="text-gray-400">I'm here to help you learn, create, and explore.</p>
              <div className="mt-6 text-sm text-gray-500 space-y-1">
                <p>Try asking me:</p>
                <p>"What can you help me with?"</p>
                <p>"Tell me a joke"</p>
                <p>"How does AI work?"</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  <span className="text-lg">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-bl-none border border-gray-600'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {/* Enhanced Loading Animation */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <span className="text-lg">🤖</span>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg border border-gray-600">
                <div className="flex space-x-2 items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div className="p-6 bg-gray-800/50 backdrop-blur-sm border-t border-gray-600/50">
          <div className="flex space-x-4 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... 🌟"
                className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400 text-lg transition-all duration-200 backdrop-blur-sm"
                disabled={loading}
              />
              {!inputMessage && !loading && (
                <div className="absolute right-3 top-3 text-gray-400 text-sm">
                  ⏎ Enter to send
                </div>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg flex items-center space-x-2 min-w-24 justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
          
          {/* Quick Suggestions */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "What can you do?",
                "Tell me a joke",
                "How does AI work?",
                "What's your name?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm transition-colors backdrop-blur-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App



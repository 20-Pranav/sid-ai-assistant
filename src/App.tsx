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

    try {
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      })

      const data = await response.json()
      
      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.data.response,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
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
          <p className="text-center text-gray-400">Powered by your local backend</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">Welcome to SID AI Assistant!</p>
              <p className="text-sm">Start a conversation by typing a message below.</p>
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
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

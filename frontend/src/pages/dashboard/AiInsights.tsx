import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

export default function AiInsights() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Hello! I am your FinSight AI advisor. Ask me anything about your spending trends or investment portfolio.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    
    try {
      console.log('--- CALLING AI v2.2 ---');
      const response = await api.post('/ai/ask-v2', { query: userMessage });
      const aiResponse = response.data.data.answer;
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Failed to get AI response', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to my servers right now. Please try again later." }]);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-6xl mx-auto h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">AI Insights</h1>
        <p className="text-muted text-sm mt-1">Chat with your personalized financial advisor.</p>
      </div>
      
      <div className="glass-panel p-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-surface border border-border text-foreground rounded-bl-none leading-relaxed'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="bg-background border border-border rounded-xl p-2 flex gap-2 shrink-0 items-center">
          <input 
            type="text" 
            placeholder="Ask about your spending..." 
            className="flex-1 bg-transparent text-foreground focus:outline-none px-4 py-2" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend} 
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

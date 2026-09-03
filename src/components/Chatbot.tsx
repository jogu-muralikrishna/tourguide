import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Minimize2, RefreshCw, Cpu, User } from 'lucide-react';
import { ChatMessageType, Vehicle, Hotel, Pitstop, UserData, WeatherData, PricingDetails } from '../types';

interface ChatbotProps {
  tripContext: {
    from: string;
    to: string;
    vehicle: Vehicle | null;
    hotel: Hotel | null;
    hotelNights: number;
    pitstops: Pitstop[];
    userData: UserData;
    weather: WeatherData | null;
    pricing: PricingDetails;
  };
}

export const Chatbot: React.FC<ChatbotProps> = ({ tripContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'msg-init',
      sender: 'sage',
      text: 'Hello! I am your **TourGuide AI** travel assistant. How can I help you plan or optimize your trip today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Plan a budget trip',
        'Find hotels',
        'Best restaurants nearby',
        'Build my itinerary',
        'Optimize my budget',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query || !query.trim() || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          tripContext,
        }),
      });

      if (!response.ok) {
        throw new Error('API communication error');
      }

      const data = await response.json();
      const sageMsg: ChatMessageType = {
        id: `sage-${Date.now()}`,
        sender: 'sage',
        text: data.reply || 'Here is what I found for your trip.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sageMsg]);
    } catch {
      const fallbackMsg: ChatMessageType = {
        id: `sage-fallback-${Date.now()}`,
        sender: 'sage',
        text: `Trip summary for ${tripContext.from || 'Hyderabad'} ➔ ${tripContext.to || 'Delhi'}. Your estimated total is **₹${tripContext.pricing.total.toLocaleString('en-IN')}**. Let me know if you would like recommendations for hotels, restaurants, or route options!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="sage-ai-chatbot-root" className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 no-print">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="open-sage-chat-btn"
          className="w-14 h-14 rounded-full gold-gradient-bg text-black shadow-[0_0_25px_rgba(212,175,55,0.5)] border-2 border-[#D4AF37] hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
          title="TourGuide AI Assistant"
        >
          <Bot className="w-7 h-7 text-black" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div 
          id="sage-chat-panel"
          className="w-[330px] sm:w-[380px] h-[520px] rounded-2xl ui-card-luxury shadow-[0_10px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-fade-in border-2 border-[#D4AF37]/40"
        >
          
          {/* Header */}
          <div className="p-3.5 bg-[#0b0b12] border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gold-gradient-bg text-black flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="font-bold text-sm text-white font-serif-luxury">
                  TourGuide AI
                </div>
                <div className="text-[10px] text-[#F3E5AB]">
                  Your personal luxury travel assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#07070b]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-zinc-400">
                    {isUser ? <span className="text-zinc-300 font-semibold">You</span> : <span className="text-[#F3E5AB] font-bold">TourGuide AI</span>}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed shadow-sm ${
                      isUser
                        ? 'gold-gradient-bg text-black font-bold rounded-tr-xs'
                        : 'bg-[#101018] text-zinc-100 border border-[#D4AF37]/25 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 rounded-full text-[10px] bg-[#12121b] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB] font-medium transition-colors cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-[11px] text-[#F3E5AB] py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                <span>AI is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#0a0a0f] border-t border-[#D4AF37]/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask TourGuide AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="ui-input flex-1 text-xs bg-[#12121b] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="ui-btn-primary py-2 px-3 text-xs"
              >
                <Send className="w-3.5 h-3.5 text-black" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

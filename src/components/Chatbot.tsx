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
      text: 'Greetings. I am **Sage AI**, your autonomous voyage concierge. I have synchronized with your trip telemetry. How may I refine your journey parameters?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Which hotel is cheapest?',
        'Explain my current bill',
        'Recommend best chariot',
        'Destination weather summary',
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
        text: data.reply || 'Route parameters updated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sageMsg]);
    } catch {
      // Local graceful fallback
      const fallbackMsg: ChatMessageType = {
        id: `sage-fallback-${Date.now()}`,
        sender: 'sage',
        text: `Telemetry synchronized for ${tripContext.from || 'Origin'} ➔ ${tripContext.to || 'Destination'}. Current live total is **₹${tripContext.pricing.total.toLocaleString('en-IN')}**. You can customize your fleet or sanctuary in the panels above.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="sage-ai-chatbot-root" className="fixed bottom-6 right-6 z-40 no-print">
      
      {/* Floating Gold Orb Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="open-sage-chat-btn"
          className="w-14 h-14 rounded-full gold-gradient-bg p-[2px] shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:shadow-[0_0_45px_rgba(212,175,55,0.9)] hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center cursor-pointer"
          title="Open Sage AI Copilot"
        >
          <div className="w-full h-full rounded-full bg-[#08080C] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#D4AF37]/10 animate-ping opacity-30" />
            <Bot className="w-6 h-6 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black" />
          </div>
        </button>
      )}

      {/* Futuristic Expanded Chat Terminal */}
      {isOpen && (
        <div 
          id="sage-chat-panel"
          className="w-[340px] sm:w-[400px] h-[520px] rounded-3xl bg-[#09090D]/95 backdrop-blur-2xl border-2 border-[#D4AF37]/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-fade-in"
        >
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#14120B] via-[#1A1810] to-[#0D0D12] border-b border-[#D4AF37]/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-luxury font-bold text-sm text-white">SAGE AI</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono-tech rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                    COPILOT
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono-tech flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Telemetry State Synchronized</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Minimize Terminal"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-mono-tech text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-zinc-500">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <User className="w-3 h-3 text-zinc-400" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[#D4AF37] font-semibold">Sage AI</span>
                      </>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8222] text-black font-semibold rounded-tr-sm shadow-md'
                        : 'bg-[#121218] text-zinc-200 border border-zinc-800/90 rounded-tl-sm shadow-inner'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="px-2.5 py-1 rounded-full text-[10px] bg-[#171722] hover:bg-[#252535] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB] transition-all"
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
              <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] py-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sage AI is querying flight & telemetry matrix...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Query Input */}
          <div className="p-3 bg-[#0B0B0E] border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Sage AI about routes, fares, hotels..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#121217] text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-zinc-800 focus:border-[#D4AF37] text-xs font-mono-tech outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  inputText.trim() && !isLoading
                    ? 'gold-gradient-bg text-black shadow-md cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, Briefcase, FileText, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: CalendarDays, text: "How many leave days do I have?" },
  { icon: Briefcase, text: "When is the next payday?" },
  { icon: FileText, text: "What is the remote work policy?" },
  { icon: MessageSquare, text: "How do I request a salary advance?" }
];

export default function HRChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Hello! I'm your AI HR Assistant. I can help you with questions about your leave balance, payroll, company policies, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    // Simulated Dialogflow / ChatGPT logic
    if (text.includes("leave") || text.includes("vacation") || text.includes("pto") || text.includes("time off")) {
      return "Based on your employee profile, you currently have 14 days of Annual Leave and 5 days of Sick Leave remaining for this year. Would you like me to guide you to the Leave Request page?";
    } else if (text.includes("pay") || text.includes("salary") || text.includes("payroll")) {
      return "The next payroll processing date is the 25th of this month. Your salary will be credited to your registered bank account ending in *4242 by the 28th. You can view your detailed pay slips in the Payroll section.";
    } else if (text.includes("policy") || text.includes("remote") || text.includes("wfh") || text.includes("work from home")) {
      return "Our current remote work policy allows employees to work from home up to 3 days a week. You must coordinate with your manager to lock in your WFH days. For the full policy document, you can check the Document Management portal.";
    } else if (text.includes("benefit") || text.includes("health") || text.includes("insurance")) {
      return "Your health insurance plan is active under the 'Premium Care' tier, which covers medical, dental, and vision for you and your dependents. Let me know if you need the insurance provider's contact details.";
    } else {
      return "I'm currently processing your request. Since I am an AI, I am constantly learning! For complex HR queries, I can also create a direct ticket with the HR team. Should I escalate this question to an HR representative?";
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate API delay (ChatGPT / Dialogflow API call)
    setTimeout(() => {
      const newBotMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: generateBotResponse(text),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5s to 2.5s delay
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            AI HR Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Powered by ChatGPT & Dialogflow integration to answer your HR questions instantly.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/20">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${message.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                }`}>
                  {message.sender === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                  }`}>
                    {message.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1.5 px-1 font-medium">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length < 3 && !isTyping && (
          <div className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-indigo-50 dark:bg-gray-700/50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                >
                  <q.icon className="w-4 h-4" />
                  {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about leave days, payroll, policies..."
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm flex items-center justify-center flex-shrink-0"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI can make mistakes. Consider verifying important policy details with HR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

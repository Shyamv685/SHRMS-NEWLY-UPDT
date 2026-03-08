import { useState, useEffect, useRef } from "react";
import { Send, Users, Megaphone, Hash, UserCircle, Search, MoreVertical, Paperclip, Image as ImageIcon, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  receiver: string;
  text: string;
  timestamp: string;
  isAnnouncement?: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'announcement' | 'team' | 'direct';
  icon: any;
  unread: number;
}

const initialMessages: Message[] = [
  { id: "M101", sender: "HR Department", senderRole: "hr", receiver: "All Employees", text: "Meeting at 3 PM regarding the new Q2 policies in the main conference room.", timestamp: "09:30 AM", isAnnouncement: true },
  { id: "M102", sender: "Alice Johnson", senderRole: "employee", receiver: "Engineering Team", text: "Has anyone reviewed the latest API documentation?", timestamp: "10:15 AM" },
  { id: "M103", sender: "Robert Smith", senderRole: "employee", receiver: "Engineering Team", text: "Yes, I left some comments on the PR earlier today.", timestamp: "10:18 AM" },
  { id: "M104", sender: "Maria Garcia", senderRole: "hr", receiver: "Engineering Team", text: "Just a reminder that timesheets are due by EOD Friday!", timestamp: "11:00 AM", isAnnouncement: true }
];

const channels: ChatChannel[] = [
  { id: "gen", name: "Company Announcements", type: "announcement", icon: Megaphone, unread: 2 },
  { id: "eng", name: "Engineering Team", type: "team", icon: Hash, unread: 0 },
  { id: "mkt", name: "Marketing Sync", type: "team", icon: Hash, unread: 5 },
  { id: "d1", name: "Alice Johnson", type: "direct", icon: UserCircle, unread: 0 },
  { id: "d2", name: "Robert Smith", type: "direct", icon: UserCircle, unread: 1 }
];

export default function InternalChat() {
  const [userRole, setUserRole] = useState<string>('employee');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeChannel, setActiveChannel] = useState<ChatChannel>(channels[0]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'employee');
      } catch (e) {
        setUserRole('employee');
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const isAnnouncementMsg = activeChannel.type === 'announcement';
    
    const msg: Message = {
      id: `M1${Math.floor(Math.random() * 90) + 10}`,
      sender: userRole === 'hr' ? 'HR Department' : 'Current User',
      senderRole: userRole,
      receiver: activeChannel.name,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAnnouncement: isAnnouncementMsg
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const getFilteredMessages = () => {
    if (activeChannel.type === 'announcement') {
      return messages.filter(m => m.isAnnouncement || m.receiver === 'Company Announcements');
    }
    return messages.filter(m => m.receiver === activeChannel.name && !m.isAnnouncement);
  };

  const currentMessages = getFilteredMessages();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative">
      <div className="flex h-full">
        {/* Sidebar / Channels List */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Communication</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Company Wide</p>
              {channels.filter(c => c.type === 'announcement').map(channel => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeChannel.id === channel.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <channel.icon className={`w-4 h-4 ${activeChannel.id === channel.id ? 'text-blue-600 dark:text-blue-400' : 'text-amber-500'}`} />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{channel.unread}</span>}
                </div>
              ))}
            </div>

            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Teams</span>
              </p>
              {channels.filter(c => c.type === 'team').map(channel => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeChannel.id === channel.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <channel.icon className="w-4 h-4 opacity-70" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{channel.unread}</span>}
                </div>
              ))}
            </div>

            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Direct Messages</p>
              {channels.filter(c => c.type === 'direct').map(channel => (
                <div 
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeChannel.id === channel.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${channel.name.toLowerCase().replace(' ', '')}`} alt={channel.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{channel.unread}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] dark:bg-gray-900">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeChannel.type === 'announcement' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'}`}>
                <activeChannel.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{activeChannel.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activeChannel.type === 'announcement' ? 'Company-wide read-only channel' : '14 Members'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Search className="w-5 h-5"/></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><Users className="w-5 h-5"/></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><MoreVertical className="w-5 h-5"/></button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" style={{ opacity: 0.98 }}>
            <AnimatePresence>
              {currentMessages.map((msg, idx) => {
                const isMe = msg.sender === 'Current User';
                const showAvatar = !isMe && (idx === 0 || currentMessages[idx - 1].sender !== msg.sender);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-full`}
                  >
                    <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMe && showAvatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 shadow-sm border border-gray-200 dark:border-gray-700">
                          {msg.senderRole === 'hr' || msg.sender.includes('HR') ? (
                            <div className="w-full h-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">HR</div>
                          ) : (
                            <img src={`https://i.pravatar.cc/150?u=${msg.sender.toLowerCase().replace(' ', '')}`} alt={msg.sender} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : !isMe ? (
                        <div className="w-8 flex-shrink-0"></div>
                      ) : null}

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {showAvatar && (
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{msg.sender}</span>
                            <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                            {msg.senderRole === 'hr' && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0 rounded">Admin</span>}
                          </div>
                        )}
                        {!showAvatar && !isMe && (
                           <div className="text-[10px] text-gray-400 mb-0.5 ml-1">{msg.timestamp}</div>
                        )}
                        
                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed relative ${
                          isMe 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : msg.isAnnouncement 
                              ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/50 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                              : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                        }`}>
                          {msg.isAnnouncement && <Megaphone className="w-4 h-4 text-amber-500 mb-2" />}
                          {msg.text}
                          {isMe && <div className="text-[10px] text-blue-200 mt-1 text-right">{msg.timestamp}</div>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Hash className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="font-medium text-lg text-gray-900 dark:text-gray-300">Welcome to #{activeChannel.name}</p>
                  <p className="text-sm">This is the start of the channel history.</p>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {activeChannel.type === 'announcement' && userRole !== 'hr' ? (
              <div className="text-center py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                Only HR Administrators can post in company announcements.
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <button type="button" className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hidden sm:block">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${activeChannel.type === 'direct' ? '' : '#'}${activeChannel.name}`}
                    className="flex-1 py-3 px-2 sm:px-0 bg-transparent text-gray-900 dark:text-white outline-none"
                  />
                  <div className="flex items-center gap-1 pr-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hidden sm:block">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-600 text-white rounded-xl transition-colors shadow-sm flex-shrink-0 flex items-center justify-center w-12 h-12"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

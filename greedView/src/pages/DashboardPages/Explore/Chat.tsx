import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Search,
  Check,
  CheckCheck,
  Circle,
  Image,
  Mic,
  ArrowLeft
} from 'lucide-react';

// Types
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'emoji';
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-[#00ff88] rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Message bubble component
function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const statusIcons = {
    sent: <Check className="w-3 h-3 text-gray-400" />,
    delivered: <CheckCheck className="w-3 h-3 text-gray-400" />,
    read: <CheckCheck className="w-3 h-3 text-[#00ff88]" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black rounded-br-md'
            : 'bg-[#1a1a2e] text-white rounded-bl-md'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-black/60' : 'text-gray-500'}`}>
          <span className="text-xs">{message.timestamp}</span>
          {isOwn && statusIcons[message.status]}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Contact list item
function ContactItem({ contact, isActive, onClick }: { 
  contact: ChatContact; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-[#00ff88]/10 border border-[#00ff88]/30' 
          : 'hover:bg-white/5'
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5">
          <div className="w-full h-full rounded-full bg-[#141420] flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {contact.name.charAt(0)}
            </span>
          </div>
        </div>
        {contact.isOnline && (
          <motion.div
            className="absolute bottom-0 right-0 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#0d0d14]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between">
          <span className={`font-medium truncate ${isActive ? 'text-[#00ff88]' : 'text-white'}`}>
            {contact.name}
          </span>
          <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
        </div>
        <div className="flex items-center justify-between">
          {contact.isTyping ? (
            <span className="text-[#00ff88] text-sm">typing...</span>
          ) : (
            <span className="text-gray-400 text-sm truncate">{contact.lastMessage}</span>
          )}
          {contact.unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#00ff88] text-black text-xs font-bold rounded-full">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Main Chat Component
export function Chat() {
  const [activeContact, setActiveContact] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: ChatContact[] = [
    { id: '1', name: 'Alex Hunter', lastMessage: 'Ready for the challenge?', lastMessageTime: '2m', unreadCount: 2, isOnline: true, isTyping: false },
    { id: '2', name: 'Sarah Dev', lastMessage: 'Great work on the project!', lastMessageTime: '15m', unreadCount: 0, isOnline: true, isTyping: true },
    { id: '3', name: 'Mike Coder', lastMessage: 'See you at the hackathon', lastMessageTime: '1h', unreadCount: 0, isOnline: false, isTyping: false },
    { id: '4', name: 'Emma Tech', lastMessage: 'Thanks for the tips!', lastMessageTime: '3h', unreadCount: 0, isOnline: true, isTyping: false },
    { id: '5', name: 'John Builder', lastMessage: "Let's team up", lastMessageTime: '1d', unreadCount: 5, isOnline: false, isTyping: false },
  ];

  const messages: Message[] = [
    { id: '1', senderId: '1', content: 'Hey! Ready for the coding challenge tonight?', timestamp: '10:30 AM', status: 'read', type: 'text' },
    { id: '2', senderId: 'me', content: 'Absolutely! Been preparing all week 💪', timestamp: '10:32 AM', status: 'read', type: 'text' },
    { id: '3', senderId: '1', content: "That's the spirit! What language are you going with?", timestamp: '10:33 AM', status: 'read', type: 'text' },
    { id: '4', senderId: 'me', content: 'TypeScript for sure. You?', timestamp: '10:35 AM', status: 'read', type: 'text' },
    { id: '5', senderId: '1', content: 'Same! We should pair up for the team round', timestamp: '10:36 AM', status: 'read', type: 'text' },
    { id: '6', senderId: 'me', content: "Great idea! Let's dominate 🔥", timestamp: '10:38 AM', status: 'delivered', type: 'text' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  const activeContactData = contacts.find(c => c.id === activeContact);

  return (
    <div className="h-[calc(100vh-120px)] flex rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d14]">
      {/* Contacts Sidebar */}
      <div className={`${showMobileChat ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 flex-col border-r border-white/10`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none text-sm"
            />
          </div>
        </div>
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={activeContact === contact.id}
              onClick={() => {
                setActiveContact(contact.id);
                setShowMobileChat(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
        {activeContactData ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowMobileChat(false)}
                  className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </motion.button>
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#141420] flex items-center justify-center">
                      <span className="font-bold text-white">
                        {activeContactData.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  {activeContactData.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#0d0d14]" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-white">{activeContactData.name}</h3>
                  <p className="text-xs text-[#00ff88]">
                    {activeContactData.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Video className="w-5 h-5 text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === 'me'}
                  />
                ))}
              </AnimatePresence>
              
              {activeContactData.isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-[#1a1a2e] rounded-2xl rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </motion.button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full px-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Smile className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl transition-all ${
                    message.trim()
                      ? 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black'
                      : 'bg-[#141420] text-gray-400'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#141420] flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ff88, #00d9ff);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

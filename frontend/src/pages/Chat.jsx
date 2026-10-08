import { useState } from 'react';
import { MessageSquare, Send, User, CheckCircle2, Repeat, Clock } from 'lucide-react';

export default function Chat() {
  const [conversations] = useState([
    {
      id: 1,
      name: 'Rohan Sharma',
      item: 'Vintage Denim Jacket',
      status: 'Negotiating',
      lastMessage: 'Would you be willing to swap for my Zara hoodie?',
      time: '10:45 AM',
    },
    {
      id: 2,
      name: 'Priya Verma',
      item: 'Floral Summer Dress',
      status: 'Agreement Reached',
      lastMessage: 'Awesome, let us confirm the local pickup point!',
      time: 'Yesterday',
    },
    {
      id: 3,
      name: 'Aman Gupta',
      item: 'Nike Air Windbreaker',
      status: 'Pending',
      lastMessage: 'Is the size standard M or relaxed fit?',
      time: '2 days ago',
    },
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    { sender: 'them', text: 'Hey! I saw your listed jacket. Looks great.', time: '10:30 AM' },
    { sender: 'me', text: 'Hi! Yes, gently used, condition is almost like new.', time: '10:35 AM' },
    { sender: 'them', text: 'Would you be willing to swap for my Zara hoodie?', time: '10:45 AM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'me',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
        
        {/* Left: Chat List */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="font-black text-gray-900 text-sm tracking-tight">Swap Negotiations</h2>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`w-full p-4 text-left transition flex flex-col gap-1 ${
                  activeChat.id === c.id ? 'bg-white shadow-sm border-l-4 border-emerald-600' : 'hover:bg-gray-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">{c.name}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 truncate">
                  Item: {c.item}
                </div>
                <div className="text-[11px] text-gray-500 truncate">{c.lastMessage}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                {activeChat.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{activeChat.name}</h3>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-emerald-600" /> Swapping for: <span className="font-semibold text-gray-700">{activeChat.item}</span>
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {activeChat.status}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[75%] ${
                  m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200/70 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Negotiate swap terms with ${activeChat.name}...`}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
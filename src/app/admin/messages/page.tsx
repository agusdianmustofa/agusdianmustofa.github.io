'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Search, 
  Star, 
  Trash2, 
  Reply, 
  MoreHorizontal,
  CheckCheck,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMessages, replyMessage } from '@/lib/api';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  read: boolean;
  starred: boolean;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    loadMessages();
    
    const interval = setInterval(() => {
      loadMessages();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const [prevCount, setPrevCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    if (!loading && messages.length > prevCount && prevCount > 0) {
      const newCount = messages.length - prevCount;
      setNewMessageCount(newCount);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    if (!loading) {
      setPrevCount(messages.length);
    }
  }, [messages, loading]);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread' && msg.read) return false;
    if (filter === 'starred' && !msg.starred) return false;
    if (searchQuery && !msg.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messages/${id}/read`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to mark as read');
    }
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const toggleStar = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messages/${id}/star`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to toggle star');
    }
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const deleteMessage = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messages/${id}`, {
        method: 'DELETE',
      });
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message');
    }
  };

  const markAllAsRead = async () => {
    for (const msg of messages.filter(m => !m.read)) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messages/${msg.id}/read`, {
        method: 'PATCH',
      });
    }
    setMessages(msgs => msgs.map(m => ({ ...m, read: true })));
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setSending(true);
    try {
      await replyMessage(selectedMessage.id, replyText);
      setSent(true);
      setReplyText('');
      loadMessages();
      setSelectedMessage({ ...selectedMessage, reply: replyText, repliedAt: new Date().toISOString() });
      setTimeout(() => {
        setSent(false);
        setReplyText('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="p-20 text-center text-[var(--text-muted)]">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <Mail size={20} />
            <span className="font-semibold">{newMessageCount} new message{newMessageCount > 1 ? 's' : ''} received!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Messages</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Manage inquiries from your contact form.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[0.82rem] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] hover:bg-[#6366f10d] transition-all"
        >
          <CheckCheck size={16} /> Mark All Read
        </button>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5">
        {/* Messages List */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-primary)] w-full focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div className="flex gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
              {(['all', 'unread', 'starred'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-[0.75rem] font-medium transition-all capitalize ${
                    filter === f 
                      ? 'bg-[var(--accent-primary)] text-white' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
            <AnimatePresence>
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]">
                  No messages found
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setSelectedMessage(message);
                      setSent(!!message.reply);
                      setReplyText('');
                      markAsRead(message.id);
                    }}
                    className={`p-4 border-b border-[var(--border-color)] cursor-pointer transition-all hover:bg-[#6366f108] ${
                      selectedMessage?.id === message.id ? 'bg-[#6366f110]' : ''
                    } ${!message.read ? 'border-l-2 border-l-[var(--accent-primary)]' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className={`font-bold text-[0.9rem] truncate ${!message.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {message.name}
                      </span>
                      <span className="text-[0.7rem] text-[var(--text-muted)] shrink-0">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-[0.85rem] text-[var(--text-primary)] font-medium truncate mb-1">{message.subject}</p>
                    <p className="text-[0.75rem] text-[var(--text-muted)] truncate">{message.message}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Message Detail */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden backdrop-blur-xl">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] flex items-center justify-center font-bold text-white">
                    {selectedMessage.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{selectedMessage.name}</h3>
                    <p className="text-[0.8rem] text-[var(--text-muted)]">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[0.75rem] text-[var(--text-muted)] flex items-center gap-1">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                  <button 
                    onClick={() => toggleStar(selectedMessage.id)}
                    className={`p-2 rounded-lg transition-all ${selectedMessage.starred ? 'text-amber-400' : 'text-[var(--text-muted)] hover:text-amber-400'}`}
                    title="Star"
                  >
                    <Star size={18} fill={selectedMessage.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-[#ef44441a] text-[var(--text-muted)] hover:text-[#ef4444] transition-all" 
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">{selectedMessage.subject}</h2>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {selectedMessage.reply && (
                  <div className="bg-[#22c55e1a] border border-[#22c55e33] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-[#22c55e] text-sm font-semibold">
                      <CheckCircle size={16} />
                      Replied on {new Date(selectedMessage.repliedAt!).toLocaleDateString()}
                    </div>
                    <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{selectedMessage.reply}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[var(--border-color)]">
                <div className="flex gap-3">
                  <textarea 
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={!!selectedMessage.reply}
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[0.9rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] resize-none h-24 disabled:opacity-50"
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <button 
                    onClick={handleReply}
                    disabled={sending || !replyText.trim() || !!selectedMessage.reply}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {sending ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending...</>
                    ) : sent || selectedMessage.reply ? (
                      <><CheckCircle size={16} /> Sent!</>
                    ) : (
                      <><Reply size={16} /> Send Reply</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#6366f11a] flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-[var(--accent-primary)]" />
                </div>
                <p className="text-[var(--text-muted)]">Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

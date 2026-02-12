'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  ArrowLeft,
  Menu,
  Sparkles,
  User,
  Camera,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const { userData, isComplete } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Redirect if onboarding not complete
  useEffect(() => {
    if (!isComplete) {
      router.push('/onboarding');
    }
  }, [isComplete, router]);

  // Initial greeting from teacher
  useEffect(() => {
    if (isComplete && messages.length === 0) {
      const greeting: Message = {
        id: 'initial',
        role: 'assistant',
        content: `Hallo ${userData.firstName}! Ich bin ${userData.favoriteTeacher}. 👋\n\nDu hast gesagt, dass dich "${userData.initialProblem}" in ${userData.subject} gerade beschäftigt. Lass uns doch direkt mal reinschauen – was genau ist dabei die größte Hürde за теб?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isComplete, userData, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userData: userData,
          userId: 'anonymous-user',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          'Entschuldige, ich habe gerade ein kleines technisches Problem. Kannst du es noch einmal versuchen? ✨',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-screen bg-background overflow-hidden relative'>
      {/* Dynamic Background Blurs */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none'>
        <div className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]' />
        <div className='absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]' />
      </div>

      {/* Header */}
      <header className='flex items-center justify-between px-4 h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/')}
            className='rounded-full cursor-pointer'
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20'>
              <Sparkles className='w-5 h-5 text-primary' />
            </div>
            <div>
              <h1 className='text-sm font-bold tracking-tight'>
                {userData.favoriteTeacher}
              </h1>
              <p className='text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5'>
                KI-Tutor • {userData.subject}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full cursor-pointer'
        >
          <RotateCcw className='w-5 h-5 text-muted-foreground' />
        </Button>
      </header>

      {/* Message Area */}
      <ScrollArea className='flex-1 p-4 pb-0 overflow-y-auto'>
        <div className='max-w-2xl mx-auto space-y-6 pb-32'>
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl p-4 shadow-sm relative group
                    ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-secondary/80 border border-border/50 backdrop-blur-sm rounded-tl-none'
                    }
                  `}
                >
                  <p className='text-sm md:text-base leading-relaxed whitespace-pre-wrap'>
                    {m.content}
                  </p>
                  <span className='absolute bottom-1 right-2 text-[8px] opacity-40 uppercase'>
                    {m.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex justify-start'
            >
              <div className='bg-secondary/40 rounded-2xl p-4 border border-border/50 rounded-tl-none'>
                <div className='flex gap-1.5'>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className='w-1.5 h-1.5 bg-primary rounded-full'
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className='w-1.5 h-1.5 bg-primary rounded-full'
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className='w-1.5 h-1.5 bg-primary rounded-full'
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className='absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background via-background to-transparent z-10'>
        <div className='max-w-2xl mx-auto relative group'>
          <div className='absolute inset-0 bg-primary/10 rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity' />
          <div className='relative flex items-center gap-2 bg-secondary/80 border border-border/50 backdrop-blur-xl rounded-3xl p-1.5 shadow-lg'>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full hidden sm:flex cursor-pointer'
            >
              <Camera className='w-5 h-5 text-muted-foreground' />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Schreib ${userData.favoriteTeacher} etwas...`}
              className='flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 px-2'
            />
            <Button
              size='icon'
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className='rounded-full h-11 w-11 shadow-md cursor-pointer'
            >
              <Send className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

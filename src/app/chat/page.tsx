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
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { FeedbackModal } from '@/components/features/feedback/FeedbackModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[]; // Array of Base64 images
  timestamp: Date;
}

const ChatPage = () => {
  const { userData, isComplete } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, images]);

  // Redirect if onboarding not complete
  useEffect(() => {
    if (!isComplete) {
      router.push('/onboarding');
    }
  }, [isComplete, router]);

  // Initial greeting from teacherg
  useEffect(() => {
    if (isComplete && messages.length === 0) {
      const greeting: Message = {
        id: 'initial',
        role: 'assistant',
        content: `Hallo ${userData.firstName}! Ich bin ${userData.favoriteTeacher}. 👋\n\nDu hast gesagt, dass dich "${userData.initialProblem}" in ${userData.subject} gerade beschäftigt. Lass uns doch direkt mal reinschauen – was genau ist dabei die größte Hürde für dich?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isComplete, userData, messages.length]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFiles = await Promise.all(
        files.map((file) => imageCompression(file, options)),
      );

      setImages((prev) => [...prev, ...compressedFiles]);

      // Reset input value to allow re-uploading the same file if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleSend = async () => {
    if ((!input.trim() && images.length === 0) || isLoading) return;

    let base64Images = undefined;
    if (images.length > 0) {
      base64Images = await Promise.all(
        images.map((img) => convertToBase64(img)),
      );
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      images: base64Images,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setImages([]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            images: m.images, // Pass array of images to backend
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
    <div className='flex flex-col h-[100dvh] bg-background relative overflow-hidden font-sans text-foreground selection:bg-primary/20'>
      {/* 1. Animated Background Blobs (Premium Style) */}
      <div className='absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none'>
        <div className='absolute inset-0 bg-background/80 backdrop-blur-[1px]' />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]'
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className='absolute top-[40%] -right-[10%] w-[50%] h-[60%] bg-blue-500/10 rounded-full blur-[130px]'
        />
      </div>

      {/* 2. Glassmorphism Header */}
      <header className='flex items-center justify-between px-4 md:px-6 py-3 md:py-4 z-30 sticky top-0 bg-background/40 backdrop-blur-xl border-b border-white/10 shadow-sm flex-shrink-0'>
        <div className='flex items-center gap-3 md:gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/')}
            className='rounded-full w-9 h-9 md:w-10 md:h-10 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-muted-foreground'
          >
            <ArrowLeft className='w-4 h-4 md:w-5 md:h-5' />
          </Button>

          <img src='/logo.svg' alt='Logo' className='w-8 h-8 md:w-10 md:h-10' />

          <div className='flex flex-col'>
            <h1 className='text-lg md:text-2xl font-bold tracking-tight'>
              <span className='text-foreground'>Lern</span>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400'>
                Buddy
              </span>
            </h1>
            <div className='flex items-center gap-2'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
              </span>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest'>
                {userData.subject}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex flex-col items-end mr-2'>
            <span className='text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse'>
              Deine Meinung?
            </span>
          </div>
          <FeedbackModal />
        </div>
      </header>

      {/* 3. Messages Area */}
      <ScrollArea className='flex-1 p-4 pb-0 z-10'>
        <div className='max-w-3xl mx-auto space-y-8 pb-10 pt-6'>
          <AnimatePresence initial={false} mode='popLayout'>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className='flex items-center gap-2 mb-2 px-1 opacity-80'>
                  {m.role === 'assistant' ? (
                    <div className='w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-primary/20'>
                      AI
                    </div>
                  ) : (
                    <div className='w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold'>
                      You
                    </div>
                  )}
                  <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                    {m.role === 'user'
                      ? userData.firstName
                      : userData.favoriteTeacher}
                  </span>
                  <span className='text-[10px] text-muted-foreground/60'>
                    •
                  </span>
                  <span className='text-[10px] text-muted-foreground/60'>
                    {m.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div
                  className={`
                    relative max-w-[90%] md:max-w-[80%] rounded-2xl p-4 md:p-5 shadow-sm overflow-hidden
                    ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-none shadow-primary/25'
                        : 'bg-secondary/40 backdrop-blur-md border border-white/10 text-foreground rounded-tl-none'
                    }
                  `}
                >
                  {m.role === 'user' && (
                    <div className='absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none' />
                  )}

                  {m.images && m.images.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {m.images.map((img, idx) => (
                        <motion.img
                          key={idx}
                          src={img}
                          alt='Sent content'
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className='max-w-[120px] md:max-w-[150px] max-h-[120px] md:max-h-[150px] rounded-xl border-2 border-white/20 shadow-md hover:scale-105 transition-transform object-cover'
                        />
                      ))}
                    </div>
                  )}

                  <div className='prose prose-sm dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap selection:bg-white/30 text-sm md:text-base'>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-start gap-3'
              >
                <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20'>
                  <Sparkles className='w-4 h-4 text-white animate-pulse' />
                </div>
                <div className='bg-secondary/40 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5'>
                  {[0, 0.2, 0.4].map((delay) => (
                    <motion.div
                      key={delay}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, delay }}
                      className='w-2 h-2 bg-primary rounded-full'
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* 4. Input Area (Fixed/Sticky for better mobile keyboard handle) */}
      <div className='relative w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-20 flex-shrink-0 safe-area-inset-bottom'>
        <div className='max-w-3xl mx-auto relative group'>
          {/* Images Preview - Floating above input */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className='absolute -top-32 left-0 w-full px-1 overflow-x-auto pb-4 flex gap-3 z-30'
              >
                {images.map((img, index) => (
                  <div key={index} className='relative flex-shrink-0 group/img'>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl border-2 border-primary/30 shadow-xl bg-background/50 backdrop-blur-sm'
                    />
                    <button
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }
                      className='absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 shadow-lg opacity-100 sm:scale-0 sm:group-hover/img:scale-100 hover:bg-red-600 transition-all cursor-pointer'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Glass Input Bar */}
          <div className='relative'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-[32px] blur opacity-10 group-focus-within:opacity-50 transition duration-500' />

            <div className='relative flex items-center gap-1 md:gap-2 bg-background/60 border border-white/10 backdrop-blur-2xl rounded-[30px] p-1.5 md:p-2 shadow-2xl'>
              <input
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={isLoading}
              />
              <Button
                variant='ghost'
                size='icon'
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className='rounded-full w-10 h-10 md:w-12 md:h-12 hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-colors'
              >
                <Camera className='w-5 h-5 md:w-6 md:h-6' />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  window.innerWidth < 640
                    ? 'Deine Frage...'
                    : `Schreib ${userData.favoriteTeacher} etwas...`
                }
                disabled={isLoading}
                className='flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base md:text-lg h-10 md:h-12 px-1 md:px-2 placeholder:text-muted-foreground/50'
              />

              <Button
                size='icon'
                onClick={handleSend}
                disabled={(!input.trim() && images.length === 0) || isLoading}
                className={`
                  rounded-full w-10 h-10 md:w-12 md:h-12 shadow-lg transition-all duration-300
                  ${
                    !input.trim() && images.length === 0
                      ? 'bg-secondary text-muted-foreground opacity-50 cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95'
                  }
                `}
              >
                <Send className='w-5 h-5 ml-0.5' />
              </Button>
            </div>
          </div>

          <p className='text-[10px] text-center mt-2.5 text-muted-foreground/40 font-medium tracking-widest uppercase'>
            KI kann Fehler machen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

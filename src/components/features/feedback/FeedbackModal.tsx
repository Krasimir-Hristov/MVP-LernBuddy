'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Send, Star, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { Input } from '@/components/ui/input';

export const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { userData, userId } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!rating && !message.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feedback',
          data: {
            user_id: userId || 'unknown',
            rating,
            message,
            email, // Send the optional email
            context: {
              grade: userData.grade,
              subject: userData.subject,
            },
          },
        }),
      });
      setIsSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSent(false);
        setRating(0);
        setMessage('');
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    // Return just the button if not mounted on client yet to match SSR (avoid hydration mismatch), or specific placeholder
    // But since the button is interactive, better to just return the button part or null portal
    // Actually, just returning the button is enough, the portal will be added after mount.
    // However, the button is part of the returned JSX.
    // Let's restructure the return.
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 pr-5 pl-4 py-2.5 rounded-full cursor-pointer hover:shadow-rose-500/50 transition-all font-medium border border-white/10'
      >
        <Heart className='w-5 h-5 fill-white animate-pulse' />
        <span className='text-sm font-bold'>Feedback</span>
      </motion.button>
    );
  }

  return (
    <>
      {/* Trigger Button - High Visibility */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 pr-5 pl-4 py-2.5 rounded-full cursor-pointer hover:shadow-rose-500/50 transition-all font-medium border border-white/10'
      >
        <Heart className='w-5 h-5 fill-white animate-pulse' />
        <span className='text-sm font-bold'>Feedback</span>
      </motion.button>

      {/* Modal Portal - Always rendered when mounted, AnimatePresence handles visibility */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6'>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className='absolute inset-0 bg-black/60 backdrop-blur-sm'
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className='relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col'
              >
                {/* Header Gradient */}
                <div className='bg-gradient-to-r from-rose-100 to-indigo-50 p-6 pb-8 flex-shrink-0'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2'>
                        Deine Meinung zählt!{' '}
                        <Heart className='text-rose-500 fill-rose-500 w-6 h-6' />
                      </h3>
                      <p className='text-sm text-slate-600 mt-2 leading-relaxed max-w-[90%]'>
                        LernBuddy wird mit deiner Hilfe besser. Erzähl uns, was
                        dir gefällt oder was wir ändern sollen.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className='p-1.5 bg-white/50 hover:bg-white/80 rounded-full transition-colors text-slate-500'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  </div>
                </div>

                {!isSent ? (
                  <div className='p-6 space-y-6 -mt-4 bg-white rounded-t-3xl relative flex-1 overflow-y-auto'>
                    {/* Rating */}
                    <div className='space-y-2'>
                      <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
                        Wie zufrieden bist du?
                      </label>
                      <div className='flex gap-2 touch-manipulation'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className='group focus:outline-none transition-transform active:scale-95'
                          >
                            <Star
                              className={`w-10 h-10 transition-colors ${
                                rating >= star
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                                  : 'text-slate-200 fill-slate-50 group-hover:text-amber-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Input */}
                    <div className='space-y-2'>
                      <label className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
                        Deine Nachricht
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Was fehlt dir? Was gefällt dir besonders gut?'
                        className='w-full min-h-[100px] p-4 rounded-xl border-2 border-slate-100 focus:border-rose-500/50 focus:ring-0 resize-none bg-slate-50/50 text-slate-800 text-sm transition-all focus:bg-white'
                      />
                    </div>

                    {/* Email Input (Optional) */}
                    <div className='space-y-2'>
                      <label className='text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 flex-wrap'>
                        E-Mail für Rückfragen{' '}
                        <span className='text-[10px] font-normal normal-case bg-slate-100 px-2 py-0.5 rounded-full text-slate-500'>
                          Optional
                        </span>
                      </label>
                      <div className='relative'>
                        <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <Input
                          type='email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder='deine@email.de'
                          className='pl-11 h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:border-rose-500/50 focus:ring-0 focus:bg-white'
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || (!rating && !message.trim())}
                      className='w-full rounded-xl h-14 text-lg font-bold shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all mb-2'
                    >
                      {isSubmitting ? (
                        <span className='animate-pulse flex items-center gap-2'>
                          Wird gesendet...
                        </span>
                      ) : (
                        <span className='flex items-center gap-2'>
                          Feedback absenden <Send className='w-5 h-5' />
                        </span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className='py-16 flex flex-col items-center text-center space-y-6 bg-white'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      className='w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm'
                    >
                      <Heart className='w-12 h-12 fill-current' />
                    </motion.div>
                    <div className='space-y-2'>
                      <h3 className='text-2xl font-bold text-slate-800'>
                        Vielen Dank! ❤️
                      </h3>
                      <p className='text-slate-600 max-w-xs mx-auto'>
                        Deine Nachricht ist sicher bei uns angekommen. Wir lesen
                        jedes Feedback!
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

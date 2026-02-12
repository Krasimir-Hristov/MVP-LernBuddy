'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { AlertCircle, X } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

/**
 * A premium, animated alert modal to replace native browser alerts.
 * Follows the LernBuddy design system with glassmorphism and smooth animations.
 */
const AlertModal = ({ isOpen, message, onClose }: AlertModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-background/80 backdrop-blur-sm'
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className='relative w-full max-w-sm bg-secondary/80 border border-border/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6'
          >
            <div className='bg-destructive/10 p-4 rounded-2xl'>
              <AlertCircle className='w-8 h-8 text-destructive' />
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-bold tracking-tight'>Hoppla!</h3>
              <p className='text-muted-foreground leading-relaxed'>{message}</p>
            </div>

            <Button
              onClick={onClose}
              className='w-full rounded-2xl py-6 font-bold cursor-pointer'
            >
              Alles klar!
            </Button>

            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2'
            >
              <X className='w-5 h-5' />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;

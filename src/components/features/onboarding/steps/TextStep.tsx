'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TextStepProps {
  title: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number';
}

const TextStep = ({
  title,
  description,
  value,
  onChange,
  placeholder,
  type = 'text',
}: TextStepProps) => {
  return (
    <div className='space-y-8 text-center'>
      <div className='space-y-4'>
        <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
        {description && <p className='text-muted-foreground'>{description}</p>}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='max-w-md mx-auto'
      >
        {type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className='min-h-[120px] text-lg bg-secondary/20 border-border/50 focus:border-primary/50 transition-all text-center resize-none p-6 rounded-2xl'
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className='h-16 text-2xl md:text-3xl bg-secondary/20 border-border/50 focus:border-primary/50 transition-all text-center px-6 rounded-2xl font-bold selection:bg-primary/30'
          />
        )}
      </motion.div>
    </div>
  );
};

export default TextStep;

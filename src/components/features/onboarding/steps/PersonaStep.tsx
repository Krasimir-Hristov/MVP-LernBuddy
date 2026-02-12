'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const TEACHERS = [
  {
    id: 'Sokrates',
    name: 'Sokrates',
    role: 'Der Weise',
    icon: '🏛️',
    bio: 'Meister der Fragen. Er hilft dir, die Wahrheit selbst zu entdecken.',
  },
  {
    id: 'Einstein',
    name: 'Albert Einstein',
    role: 'Der Physiker',
    icon: '🧪',
    bio: 'Neugierig und geduldig. Er liebt es, komplexe Dinge einfach zu erklären.',
  },
  {
    id: 'Marie',
    name: 'Marie Curie',
    role: 'Die Forscherin',
    icon: '✨',
    bio: 'Mutig und präzise. Sie motiviert dich, niemals aufzugeben.',
  },
  {
    id: 'Leonardo',
    name: 'Leonardo da Vinci',
    role: 'Das Universalgenie',
    icon: '🎨',
    bio: 'Kreativ und vielseitig. Er verbindet Kunst mit Wissenschaft.',
  },
];

interface PersonaStepProps {
  selected?: string;
  onSelect: (id: string) => void;
}

const PersonaStep = ({ selected, onSelect }: PersonaStepProps) => {
  return (
    <div className='space-y-8 text-center'>
      <div className='space-y-4'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Wähle deinen Mentor
        </h2>
        <p className='text-muted-foreground'>
          Wer soll dich auf deiner Lernreise begleiten?
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-left'>
        {TEACHERS.map((teacher) => (
          <motion.div
            key={teacher.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(teacher.id)}
            className='cursor-pointer'
          >
            <Card
              className={cn(
                'p-6 h-full transition-all duration-300 border-2',
                selected === teacher.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border/50 bg-secondary/20 hover:border-primary/30',
              )}
            >
              <div className='flex justify-between items-start mb-4'>
                <span className='text-4xl'>{teacher.icon}</span>
                {selected === teacher.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='bg-primary text-primary-foreground rounded-full p-1'
                  >
                    <Check className='w-4 h-4' />
                  </motion.div>
                )}
              </div>
              <div>
                <h3 className='text-xl font-bold'>{teacher.name}</h3>
                <p className='text-xs text-primary font-medium uppercase tracking-wider mb-2'>
                  {teacher.role}
                </p>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {teacher.bio}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PersonaStep;

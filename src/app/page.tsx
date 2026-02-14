'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rocket, Sparkles, Brain, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className='relative min-h-screen flex flex-col items-center bg-background px-4 py-8 md:py-12'>
      {/* Background Decorative Elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]'
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
          className='absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]'
        />
      </div>

      <main className='flex-1 flex flex-col items-center justify-center max-w-4xl w-full text-center space-y-12 my-8 md:my-12'>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='space-y-6'
        >
          <div className='flex justify-center mb-6'>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className='relative'
            >
              <img
                src='/logo.svg'
                alt='LernBuddy Logo'
                className='w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl'
              />
            </motion.div>
          </div>

          <h1 className='text-5xl md:text-7xl font-bold tracking-tight'>
            Dein{' '}
            <span className='text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400'>
              LernBuddy
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            Der Sokratische KI-Tutor, der dir nicht einfach die Antworten gibt,
            sondern dir hilft, sie selbst zu entdecken.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6'
        >
          {[
            { icon: Brain, title: 'Sokratisch', desc: 'Lernen durch Fragen' },
            {
              icon: Sparkles,
              title: 'Personalisiert',
              desc: 'Auf dich zugeschnitten',
            },
            { icon: Rocket, title: 'Effektiv', desc: 'Nachhaltiges Wissen' },
          ].map((feature, idx) => (
            <motion.div key={idx} whileHover={{ y: -5 }} className='group'>
              <Card className='p-6 bg-secondary/50 border-border/50 backdrop-blur-sm group-hover:border-primary/50 transition-colors'>
                <feature.icon className='w-8 h-8 mb-4 text-primary group-hover:animate-pulse' />
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground'>{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='pt-4 pb-8 md:pt-8'
        >
          <Link href='/onboarding' className='inline-block'>
            <Button
              size='lg'
              className='rounded-full px-12 py-8 text-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300'
            >
              Starten
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Rocket className='ml-3 w-6 h-6' />
              </motion.span>
            </Button>
          </Link>

          <p className='mt-6 text-sm text-muted-foreground italic'>
            "Sokratische Methode: Niemals die Lösung verraten, nur hinführen."
          </p>
        </motion.div>
      </main>

      {/* Footer / Privacy Note */}
      <footer className='w-full text-center mt-auto pb-8 md:pb-12 pointer-events-none'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className='flex flex-col items-center gap-2'
        >
          <p className='text-[10px] md:text-xs text-muted-foreground/80 uppercase tracking-widest font-medium'>
            Daten bleiben lokal im Browser
          </p>
          <div className='h-px w-8 bg-primary/20' />
          <p className='text-[10px] md:text-xs text-muted-foreground/60 uppercase tracking-widest'>
            Keine Speicherung persönlicher Daten
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default LandingPage;

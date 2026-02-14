'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TextStep from '@/components/features/onboarding/steps/TextStep';
import PersonaStep from '@/components/features/onboarding/steps/PersonaStep';
import AlertModal from '@/components/ui/AlertModal';

// Types for Step Configuration
type OnboardingStep =
  | 'name'
  | 'age'
  | 'grade'
  | 'subject'
  | 'hobby'
  | 'teacher'
  | 'style'
  | 'diagnostic';

const STEPS: OnboardingStep[] = [
  'name',
  'age',
  'grade',
  'subject',
  'hobby',
  'teacher',
  'style',
  'diagnostic',
];

const OnboardingPage = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const { userData, updateUserData } = useUser();
  const router = useRouter();

  // Custom Alert State
  const [alertState, setAlertState] = useState({ isOpen: false, message: '' });

  const currentStep = STEPS[currentStepIdx];
  const progress = ((currentStepIdx + 1) / STEPS.length) * 100;

  const nextStep = () => {
    // Basic validation
    const currentVal = (userData as any)[
      currentStep === 'name'
        ? 'firstName'
        : currentStep === 'diagnostic'
          ? 'initialProblem'
          : currentStep === 'style'
            ? 'teacherReason'
            : currentStep === 'teacher'
              ? 'favoriteTeacher'
              : currentStep
    ];

    if (
      currentStep !== 'teacher' &&
      (!currentVal || currentVal.toString().trim() === '')
    ) {
      setAlertState({
        isOpen: true,
        message: 'Bitte fülle dieses Feld aus, damit wir fortfahren können! ✨',
      });
      return;
    }

    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      router.push('/chat');
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    } else {
      router.push('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'name':
        return (
          <TextStep
            title='Wie heißt du?'
            value={userData.firstName}
            onChange={(val) => updateUserData({ firstName: val })}
            placeholder='Dein Vorname'
          />
        );
      case 'age':
        return (
          <TextStep
            title={`Hallo ${userData.firstName}!`}
            description='Wie alt bist du?'
            value={userData.age}
            type='number'
            onChange={(val) => updateUserData({ age: val })}
            placeholder='z.B. 12'
          />
        );
      case 'grade':
        return (
          <TextStep
            title='In welche Klasse gehst du?'
            value={userData.grade}
            type='number'
            onChange={(val) => updateUserData({ grade: val })}
            placeholder='z.B. 6'
          />
        );
      case 'subject':
        return (
          <TextStep
            title='Welches Fach lernen wir heute?'
            description='Mathe, Bio, Geschichte...?'
            value={userData.subject}
            onChange={(val) => updateUserData({ subject: val })}
            placeholder='z.B. Mathematik'
          />
        );
      case 'hobby':
        return (
          <TextStep
            title='Was machst du gerne in deiner Freizeit?'
            description='Ich nutze deine Hobbys für bessere Beispiele!'
            value={userData.hobby}
            onChange={(val) => updateUserData({ hobby: val })}
            placeholder='z.B. Fussball, Minecraft, Malen'
          />
        );
      case 'teacher':
        return (
          <TextStep
            title='Wie heißt dein absoluter Lieblingslehrer?'
            value={userData.favoriteTeacher}
            onChange={(val) => updateUserData({ favoriteTeacher: val })}
            placeholder='Vorname oder Nachname'
          />
        );
      case 'style':
        return (
          <TextStep
            title={`Warum magst du ${userData.favoriteTeacher}?`}
            description='Erzähl mir ein bisschen – erklärt er/sie z.B. besonders ruhig, lustig oder macht er/sie tolle Experimente?'
            value={userData.teacherReason}
            type='textarea'
            onChange={(val) => updateUserData({ teacherReason: val })}
            placeholder='z.B. Weil er alles ganz verständlich erklärt und immer geduldig ist...'
          />
        );
      case 'diagnostic':
        return (
          <TextStep
            title={`Letzte Frage von ${userData.favoriteTeacher}:`}
            description={`Womit kann ich dir heute in ${userData.subject} am besten helfen?`}
            value={userData.initialProblem}
            type='textarea'
            onChange={(val) => updateUserData({ initialProblem: val })}
            placeholder='Beschreibe kurz, was dich gerade fuchst...'
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-background flex flex-col items-center p-4 md:p-8 relative overflow-hidden'>
      {/* Background Glow */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10'>
        <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse' />
      </div>

      {/* Header / Progress Bar */}
      <header className='w-full max-w-2xl mb-12 space-y-4'>
        <div className='flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest font-medium'>
          <span>
            Schritt {currentStepIdx + 1} von {STEPS.length}
          </span>
          <span className='flex items-center gap-1'>
            <Sparkles className='w-3 h-3 text-primary' />
            LernBuddy Setup
          </span>
        </div>
        <div className='h-1.5 w-full bg-secondary rounded-full overflow-hidden'>
          <motion.div
            className='h-full bg-primary'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </div>
      </header>

      {/* Main Form Area */}
      <main className='flex-1 w-full max-w-2xl flex flex-col items-center justify-center relative'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='w-full'
          >
            {renderStep()}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex justify-center mt-12'
            >
              <Button
                onClick={nextStep}
                className='rounded-full px-12 py-8 text-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 cursor-pointer'
              >
                Weiter
                <ChevronRight className='ml-2 w-6 h-6' />
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Navigation */}
      <footer className='w-full max-w-2xl mt-8 flex justify-between gap-4'>
        <Button
          variant='ghost'
          onClick={prevStep}
          className='text-muted-foreground hover:text-foreground cursor-pointer'
        >
          <ChevronLeft className='mr-2 w-4 h-4' />
          Zurück
        </Button>
      </footer>

      {/* Custom Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default OnboardingPage;

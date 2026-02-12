'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

/**
 * User onboarding data as defined in the MVP requirement.
 * Data is persisted locally for privacy.
 */
export interface UserOnboardingData {
  firstName: string;
  age: string;
  grade: string;
  subject: string;
  favoriteTeacher: string; // The selected persona (e.g. "Einstein", "Leonardo")
  teacherReason: string; // Why the child likes this teacher (defines behavior)
  hobby: string;
  initialProblem: string; // The diagnostic question/topic
}

interface UserContextType {
  userData: UserOnboardingData;
  updateUserData: (data: Partial<UserOnboardingData>) => void;
  isComplete: boolean;
  clearUserData: () => void;
}

const defaultData: UserOnboardingData = {
  firstName: '',
  age: '',
  grade: '',
  subject: '',
  favoriteTeacher: '',
  teacherReason: '',
  hobby: '',
  initialProblem: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserOnboardingData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount (Privacy: Data remains in browser)
  useEffect(() => {
    const saved = localStorage.getItem('lernbuddy_user_data');
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateUserData = (newData: Partial<UserOnboardingData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('lernbuddy_user_data', JSON.stringify(updated));
      return updated;
    });
  };

  const clearUserData = () => {
    setUserData(defaultData);
    localStorage.removeItem('lernbuddy_user_data');
  };

  // Check if all required onboarding fields are filled
  const isComplete = Object.values(userData).every((val) => val.trim() !== '');

  return (
    <UserContext.Provider
      value={{ userData, updateUserData, isComplete, clearUserData }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

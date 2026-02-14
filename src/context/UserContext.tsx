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
  userId: string | null;
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

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserOnboardingData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load from local storage on mount (Privacy: Data remains in browser)
  useEffect(() => {
    // 1. Load User Data
    const savedData = localStorage.getItem('lernbuddy_user_data');
    if (savedData) {
      try {
        setUserData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }

    // 2. Load or Generate User ID for Analytics
    let existingId = localStorage.getItem('lernbuddy_user_id');
    if (!existingId) {
      existingId = generateUUID();
      localStorage.setItem('lernbuddy_user_id', existingId);
    }
    setUserId(existingId);

    // 3. Register User (Fire & Forget via Proxy)
    const register = async () => {
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'register_user',
            data: {
              user_id: existingId,
              user_agent: navigator.userAgent,
              locale: navigator.language,
            },
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          console.error('Analytics Proxy Error:', errData);
        } else {
          console.log('User registered successfully via proxy');
        }
      } catch (err) {
        console.error('Failed to call analytics proxy:', err);
      }
    };

    register();
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
    // Note: We intentionally do NOT clear user_id to keep tracking unique installs
  };

  // Check if all required onboarding fields are filled
  const isComplete = Object.values(userData).every((val) => val.trim() !== '');

  return (
    <UserContext.Provider
      value={{ userData, updateUserData, isComplete, clearUserData, userId }}
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

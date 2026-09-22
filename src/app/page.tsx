"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import Landing from '@/components/Landing';
import Onboarding, { UserData } from '@/components/Onboarding';

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

export default function Home() {
  const [stage, setStage] = useState<'landing' | 'onboarding' | 'game'>('landing');
  const [user, setUser] = useState<UserData | null>(null);

  const handleLandingProceed = () => {
    setStage('onboarding');
  };

  const handleStartGame = (userData: UserData) => {
    setUser(userData);
    setStage('game');
  };

  return (
    <main className={styles.main}>
      {stage === 'landing' && <Landing onProceed={handleLandingProceed} />}
      {stage === 'onboarding' && <Onboarding onStart={handleStartGame} />}
      {stage === 'game' && user && <Game user={user} />}
    </main>
  );
}

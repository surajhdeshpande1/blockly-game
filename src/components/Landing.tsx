"use client";

import { useState } from 'react';
import MatrixRain from './MatrixRain';
import styles from './Landing.module.css';

interface LandingProps {
  onProceed: () => void;
}

export default function Landing({ onProceed }: LandingProps) {
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  return (
    <div className={styles.container}>
      {!isVideoFinished && (
        <MatrixRain onEnded={() => setIsVideoFinished(true)} />
      )}
      
      {isVideoFinished && (
        <div className={styles.overlay}>
          <div className={styles.card}>
            <h1 className={styles.title}>SYSTEM_BREACH</h1>
            <div className={styles.subtitle}>&gt; INITIALIZING_MAZE_PROTOCOL...</div>
            <button className={styles.startBtn} onClick={onProceed}>
              ACCESS SYSTEM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

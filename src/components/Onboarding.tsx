"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Onboarding.module.css';

export interface UserData {
  name: string;
  year: string;
  usn: string;
  phone: string;
}

interface OnboardingProps {
  onStart: (userData: UserData) => void;
}

export default function Onboarding({ onStart }: OnboardingProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [usn, setUsn] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !year.trim() || !usn.trim() || !phone.trim()) {
      setError('ALL FIELDS ARE REQUIRED!');
      return;
    }

    // Security: Strict Input Validation
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    if (!nameRegex.test(name.trim())) {
      setError('INVALID NAME. USE ONLY LETTERS.');
      return;
    }

    const usnRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!usnRegex.test(usn.trim())) {
      setError('INVALID USN FORMAT.');
      return;
    }

    const yearRegex = /^[1-4]$/;
    if (!yearRegex.test(year.trim())) {
      setError('YEAR MUST BE 1, 2, 3, OR 4.');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('PHONE MUST BE EXACTLY 10 DIGITS.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // If keys are provided, insert into Supabase
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co') {
        const { error: dbError } = await supabase
          .from('players')
          .insert([{ name, year, usn, phone }]);
          
        if (dbError) throw dbError;
      }
      
      onStart({ name, year, usn, phone });
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        setError('THIS USN OR PHONE NUMBER HAS ALREADY BEEN REGISTERED!');
      } else {
        setError('DATABASE ERROR: ' + (err.message || 'Connection failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>PLAYER PROFILE</h1>
          <span className={styles.badge}>NEW CHALLENGER</span>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">FULL NAME</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ALAN TURING"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>USN/CSN</label>
              <input 
                type="text" 
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="e.g. 1AB23CS001"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="year">YEAR</label>
              <input 
                id="year"
                type="text" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2nd Year"
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="phone">PHONE NUMBER</label>
            <input 
              id="phone"
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.submitBtn}>
            INITIATE GAME
          </button>
        </form>
      </div>
    </div>
  );
}

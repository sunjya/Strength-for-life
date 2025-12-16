'use client'

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import recharts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });

// ============================================================================
// ICONS - Oura-style minimal outlined icons
// ============================================================================
const Icons = {
  readiness: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9" strokeLinecap="round"/>
      <path d="M12 3c2.5 0 4.5 2 4.5 4.5S14.5 12 12 12" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
    </svg>
  ),
  flame: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22c-2-2-4-3.5-4-6a4 4 0 018 0c0 2.5-2 4-4 6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  crown: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M2 8l4 12h12l4-12-5 4-5-8-5 8-5-4z"/>
    </svg>
  ),
  trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2M6 3h12v8a6 6 0 11-12 0V3zM9 21h6M12 17v4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dumbbell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M6 5v14M18 5v14M3 8h6v8H3zM15 8h6v8h-6zM6 12h12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  body: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v5M12 12l-4 8M12 12l4 8M8 10h8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M12 4.5a4.5 4.5 0 00-4.5 4.5c0 1.5.7 2.8 1.8 3.7-.5.5-.8 1.2-.8 2 0 1.7 1.3 3 3 3h1c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2 1.1-.9 1.8-2.2 1.8-3.7a4.5 4.5 0 00-4.5-4.5z" strokeLinecap="round"/>
    </svg>
  ),
  settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" strokeLinecap="round"/>
    </svg>
  ),
  plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
    </svg>
  ),
  chevron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  send: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
    </svg>
  ),
  mic: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M5 10v1a7 7 0 0014 0v-1M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  micOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M19 10v1a7 7 0 01-7 7m-7-8v1a7 7 0 005 6.7M12 19v4M8 23h8" strokeLinecap="round"/>
      <path d="M2 2l20 20" strokeLinecap="round"/>
    </svg>
  ),
  upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  muscle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M6 12c-2-1-4-4-4-6s2-4 4-4c1 0 2 .5 3 1.5C10 2.5 11 2 12 2s2 .5 3 1.5C16 2.5 17 2 18 2c2 0 4 2 4 4s-2 5-4 6" strokeLinecap="round"/>
      <path d="M6 12v6c0 2 2 4 6 4s6-2 6-4v-6" strokeLinecap="round"/>
      <path d="M12 12v6" strokeLinecap="round"/>
    </svg>
  ),
  x: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
    </svg>
  ),
  info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
    </svg>
  ),
};

// ============================================================================
// DATA & HELPERS
// ============================================================================
const EXERCISES = {
  pushups: { name: 'Push-ups', color: '#f97316', muscle: 'Chest • Triceps • Shoulders' },
  squats: { name: 'Squats', color: '#14b8a6', muscle: 'Quads • Glutes • Core' },
  lunges: { name: 'Lunges', color: '#eab308', muscle: 'Legs • Balance • Stability' },
  dips: { name: 'Dips', color: '#a855f7', muscle: 'Triceps • Shoulders' },
  crunches: { name: 'Crunches', color: '#22c55e', muscle: 'Core • Abdominals' }
};

// Learning center content for each exercise
const LEARNING_CONTENT = {
  pushups: {
    title: 'Push-ups',
    subtitle: 'The Ultimate Upper Body Exercise',
    icon: '💪',
    overview: `**Push-ups are one of the most powerful predictors of cardiovascular health and longevity.**

A landmark 2019 Harvard study published in JAMA Network Open found that men who could complete 40+ push-ups had a **96% reduced risk of cardiovascular disease** compared to those who could do fewer than 10.

**Why Push-ups Matter for Longevity:**
• **Functional strength**: Push-ups build the pushing muscles you need for daily activities
• **Bone density**: Weight-bearing exercise helps prevent osteoporosis
• **Metabolic health**: Muscle mass improves insulin sensitivity and glucose metabolism
• **Heart health**: Upper body strength is directly correlated with cardiovascular fitness
• **Independence**: Maintains ability to get up from the ground as you age

**Muscles worked:** Chest (pectoralis major), shoulders (anterior deltoids), triceps, core stabilizers, and serratus anterior.`,
    prompts: [
      "What's the proper form for push-ups?",
      "How do I progress if I can't do a full push-up?",
      "How many push-ups should I aim for at my age?",
      "What variations target different muscles?",
      "How do push-ups compare to bench press?"
    ]
  },
  squats: {
    title: 'Squats',
    subtitle: 'Foundation of Functional Movement',
    icon: '🦵',
    overview: `**Squats are the king of lower body exercises and essential for maintaining independence as you age.**

The ability to squat—getting up from a chair, a toilet, or the floor—is one of the strongest predictors of maintaining independence in later life. Research shows that leg strength is directly correlated with longevity.

**Why Squats Matter for Longevity:**
• **Fall prevention**: Strong legs dramatically reduce fall risk in older adults
• **Bone density**: Loading the spine and hips maintains bone mass
• **Metabolic engine**: Leg muscles are your largest muscle group and drive metabolism
• **Hormone optimization**: Heavy compound movements boost testosterone and growth hormone
• **Daily function**: Essential for sitting, standing, climbing stairs, and picking things up

**Muscles worked:** Quadriceps, glutes, hamstrings, core, spinal erectors, and calves.

The "Chair Test" (sitting and standing from a chair without using hands) is used by geriatricians to assess functional fitness and predict longevity.`,
    prompts: [
      "What's the proper squat depth?",
      "How do I squat if I have bad knees?",
      "What's the difference between squat variations?",
      "How do squats affect hormone levels?",
      "How many squats should I do daily?"
    ]
  },
  lunges: {
    title: 'Lunges',
    subtitle: 'Balance, Stability & Single-Leg Strength',
    icon: '🚶',
    overview: `**Lunges develop the unilateral strength and balance critical for preventing falls and maintaining mobility.**

Unlike bilateral exercises, lunges work each leg independently, addressing strength imbalances and developing the stabilizer muscles essential for real-world movement.

**Why Lunges Matter for Longevity:**
• **Balance training**: Single-leg stance is a key predictor of fall risk
• **Gait improvement**: Mimics walking pattern, improving stride and stability
• **Hip mobility**: Maintains range of motion in hip flexors (often tight from sitting)
• **Asymmetry correction**: Identifies and fixes strength differences between legs
• **Functional movement**: Mirrors real activities like climbing stairs and stepping over obstacles

**Muscles worked:** Quadriceps, glutes, hamstrings, hip flexors, core stabilizers, and ankle stabilizers.

Research shows that the ability to stand on one leg for 10+ seconds is associated with significantly reduced mortality risk in middle-aged and older adults.`,
    prompts: [
      "How do I keep my balance during lunges?",
      "What's the difference between forward and reverse lunges?",
      "How do lunges help prevent falls?",
      "Can lunges help with hip mobility?",
      "How do I progress with lunges?"
    ]
  },
  dips: {
    title: 'Tricep Dips',
    subtitle: 'Upper Body Pushing Power',
    icon: '🔱',
    overview: `**Dips build the triceps and pushing strength essential for maintaining upper body function and independence.**

The triceps make up about two-thirds of your upper arm mass and are crucial for any pushing movement. Strong triceps help you push yourself up from a chair, get out of a bathtub, or catch yourself during a fall.

**Why Dips Matter for Longevity:**
• **Pushing strength**: Essential for getting up from seated or lying positions
• **Tricep mass**: Larger triceps = greater upper arm strength and stability
• **Shoulder health**: When done correctly, dips strengthen the shoulder stabilizers
• **Bone loading**: Supports bone density in the arms, shoulders, and spine
• **Functional independence**: Critical for transfers (bed to wheelchair, chair to standing)

**Muscles worked:** Triceps (all three heads), anterior deltoids, pectoralis major (lower fibers), and core.

The ability to push yourself up from a chair without using momentum is a key indicator of functional fitness in older adults.`,
    prompts: [
      "How do I do dips without hurting my shoulders?",
      "What can I use at home for dips?",
      "How deep should I go on dips?",
      "What's the difference between bench and parallel dips?",
      "How do dips compare to push-ups?"
    ]
  },
  crunches: {
    title: 'Crunches',
    subtitle: 'Core Stability & Spinal Health',
    icon: '🎯',
    overview: `**A strong core is the foundation of all movement and essential for preventing back pain and maintaining posture.**

Your core isn't just about abs—it's the entire cylinder of muscles that stabilize your spine and transfer force between your upper and lower body.

**Why Core Training Matters for Longevity:**
• **Back pain prevention**: Strong core muscles support the spine and reduce injury risk
• **Posture**: Maintains upright posture as you age, preventing "forward head" and kyphosis
• **Balance**: Core stability is essential for balance and fall prevention
• **Force transfer**: Every movement from walking to lifting requires core engagement
• **Breathing**: Core muscles assist in respiration and maintaining intra-abdominal pressure

**Muscles worked:** Rectus abdominis, obliques (internal and external), transverse abdominis, and hip flexors.

Research shows that core strength is associated with reduced back pain, better balance, and improved quality of life in older adults. The ability to get up from the floor (the "Sitting-Rising Test") is a powerful predictor of longevity.`,
    prompts: [
      "Are crunches bad for my back?",
      "What's better: crunches or planks?",
      "How do I engage my core properly?",
      "What other core exercises should I do?",
      "How does core strength prevent back pain?"
    ]
  }
};

const ACHIEVEMENTS = [
  { id: 'first_rep', name: 'First Step', description: 'Log your first rep', icon: '🌱', check: (s) => s.totalReps > 0 },
  { id: 'century', name: 'Century Club', description: '100 reps in one day', icon: '💯', check: (s) => s.dailyTotal >= 100 },
  { id: 'full_circuit', name: 'Full Circuit', description: 'All 5 exercises in one day', icon: '🔄', check: (s) => s.exercisesToday >= 5 },
  { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '🔥', check: (s) => s.streak >= 7 },
  { id: 'thousand', name: 'Thousand Strong', description: '1,000 total reps', icon: '🏆', check: (s) => s.totalReps >= 1000 },
  { id: 'perfect_day', name: 'Perfect Day', description: 'Hit all 5 goals', icon: '⭐', check: (s) => s.goalsMetToday >= 5 },
];

// ALMI Reference Ranges by Age and Sex (from NHANES and EWGSOP research)
const ALMI_RANGES = {
  male: {
    young: { min: 7.0, typical: [8.0, 10.0], strong: 10.0, label: '20-39', ageRange: [20, 39] },
    middle: { min: 7.0, typical: [7.5, 9.5], strong: 9.5, label: '40-59', ageRange: [40, 59] },
    older: { min: 7.0, typical: [7.0, 9.0], strong: 9.0, label: '60+', ageRange: [60, 120] }
  },
  female: {
    young: { min: 5.5, typical: [5.5, 7.5], strong: 7.5, label: '20-39', ageRange: [20, 39] },
    middle: { min: 5.5, typical: [5.5, 7.0], strong: 7.0, label: '40-59', ageRange: [40, 59] },
    older: { min: 5.5, typical: [5.0, 6.8], strong: 6.8, label: '60+', ageRange: [60, 120] }
  }
};

const getAgeCategory = (age) => {
  if (age < 40) return 'young';
  if (age < 60) return 'middle';
  return 'older';
};

const getALMIInterpretation = (almi, gender, age) => {
  const category = getAgeCategory(age);
  const ranges = ALMI_RANGES[gender][category];
  
  if (almi >= ranges.strong) {
    return { 
      status: 'Strong/Athletic', 
      color: '#22c55e', 
      label: 'OPTIMAL', 
      desc: `Above average for your age group (${ranges.label}). Excellent muscle mass.`,
      recommendation: 'Maintain your current training and nutrition to preserve this advantage.'
    };
  }
  if (almi >= ranges.typical[1]) {
    return { 
      status: 'Upper Normal', 
      color: '#14b8a6', 
      label: 'GREAT', 
      desc: `Upper half of normal range for ${ranges.label} ${gender === 'male' ? 'men' : 'women'}.`,
      recommendation: 'Great foundation! Continue resistance training to maintain or build further.'
    };
  }
  if (almi >= ranges.typical[0]) {
    return { 
      status: 'Normal', 
      color: '#3b82f6', 
      label: 'GOOD', 
      desc: `Healthy range for your age group (${ranges.label}).`,
      recommendation: 'Consider increasing resistance training frequency to move into the upper range.'
    };
  }
  if (almi >= ranges.min) {
    return { 
      status: 'Low Normal', 
      color: '#f59e0b', 
      label: 'LOW', 
      desc: `Lower end of normal. Risk of sarcopenia if decline continues.`,
      recommendation: 'Prioritize strength training 3-4x/week and ensure 1.2-1.6g protein per kg body weight.'
    };
  }
  return { 
    status: 'Sarcopenic Range', 
    color: '#ef4444', 
    label: 'CRITICAL', 
    desc: `Below typical cutoff (${ranges.min} kg/m²). Sarcopenia risk.`,
    recommendation: 'Consult a physician. Focus on resistance training and protein intake (1.6g/kg). Consider creatine supplementation.'
  };
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

// Unit conversions
const cmToFtIn = (cm) => {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round(totalInches % 12);
  return { ft, inch };
};

const ftInToCm = (ft, inch) => ((parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0)) * 2.54;
const kgToLb = (kg) => (kg * 2.20462).toFixed(1);
const lbToKg = (lb) => (parseFloat(lb) / 2.20462);

const calculateALMI = (armKg, legKg, heightCm) => {
  const heightM = heightCm / 100;
  const alm = parseFloat(armKg) + parseFloat(legKg);
  return (alm / (heightM * heightM)).toFixed(2);
};

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    optimal: { text: '#14b8a6', label: 'OPTIMAL' },
    thriving: { text: '#22c55e', label: 'THRIVING' },
    good: { text: '#22c55e', label: 'LOOKING GOOD' },
    almost: { text: '#fbbf24', label: 'ALMOST THERE' },
    needscare: { text: '#ef4444', label: 'NEEDS CARE' },
    building: { text: '#3b82f6', label: 'BUILDING' }
  };
  const s = styles[status] || styles.building;
  return <span className="text-xs font-semibold tracking-wider" style={{ color: s.text }}>{s.label}</span>;
};

// Range slider component
const RangeSlider = ({ value, min, max, color = '#14b8a6' }) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: `${color}40` }} />
        <div className="absolute top-1/2 w-3 h-3 rounded-full border-2 transition-all" style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)', backgroundColor: color, borderColor: color }} />
      </div>
      <div className="flex gap-3 text-xs text-white/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// ============================================================================
// AI COACH LOGIC - Parse voice commands for exercise logging
// ============================================================================
const parseVoiceCommand = (text, workoutData, goals) => {
  const lower = text.toLowerCase();
  const today = getTodayKey();
  const todayData = workoutData[today] || {};

  // Exercise patterns to match
  const exercisePatterns = [
    { patterns: ['push-up', 'pushup', 'push up', 'pushups', 'push-ups'], key: 'pushups', name: 'Push-ups' },
    { patterns: ['squat', 'squats'], key: 'squats', name: 'Squats' },
    { patterns: ['lunge', 'lunges'], key: 'lunges', name: 'Lunges' },
    { patterns: ['dip', 'dips', 'tricep dip', 'tricep dips'], key: 'dips', name: 'Dips' },
    { patterns: ['crunch', 'crunches', 'ab', 'abs', 'core'], key: 'crunches', name: 'Crunches' }
  ];

  // Logging commands: "I did 20 push-ups", "log 15 squats", "20 pushups", etc.
  const loggingPhrases = ['did', 'log', 'done', 'finished', 'completed', 'just did', 'add'];
  const isLoggingCommand = loggingPhrases.some(p => lower.includes(p));

  if (isLoggingCommand) {
    // Try to find all number + exercise combinations
    const exercises = [];

    // Split by common separators
    const segments = lower.split(/\band\b|\,|then|also|plus/);

    for (const segment of segments) {
      // Extract number from this segment
      const numberMatch = segment.match(/(\d+)/);
      const count = numberMatch ? parseInt(numberMatch[1]) : null;

      // Find which exercise was mentioned in this segment
      let exerciseKey = null;
      let exerciseName = null;
      for (const ex of exercisePatterns) {
        if (ex.patterns.some(p => segment.includes(p))) {
          exerciseKey = ex.key;
          exerciseName = ex.name;
          break;
        }
      }

      if (count && exerciseKey) {
        exercises.push({ key: exerciseKey, count: count, name: exerciseName });
      }
    }

    // If we found multiple exercises, log them all
    if (exercises.length > 1) {
      const responses = [];
      for (const ex of exercises) {
        const currentTotal = (todayData[ex.key] || 0) + ex.count;
        const goalForExercise = goals[ex.key];
        const percentComplete = Math.round((currentTotal / goalForExercise) * 100);
        responses.push(`${ex.count} ${ex.name} (${percentComplete}%)`);
      }

      return {
        action: 'log_multiple',
        exercises: exercises,
        response: `✓ Logged: ${responses.join(', ')}. Great work! 💪`
      };
    }

    // Single exercise
    if (exercises.length === 1) {
      const ex = exercises[0];
      const currentTotal = (todayData[ex.key] || 0) + ex.count;
      const goalForExercise = goals[ex.key];
      const percentComplete = Math.round((currentTotal / goalForExercise) * 100);

      let encouragement = '';
      if (ex.count >= 50) encouragement = "Incredible set! 🔥";
      else if (ex.count >= 25) encouragement = "Excellent work! 💪";
      else if (ex.count >= 10) encouragement = "Nice set!";
      else encouragement = "Good job!";

      let goalStatus = '';
      if (currentTotal >= goalForExercise) {
        goalStatus = ` You've hit your daily goal! 🎯`;
      } else {
        goalStatus = ` ${goalForExercise - currentTotal} more to reach your goal.`;
      }

      return {
        action: 'log',
        exercise: ex.key,
        count: ex.count,
        response: `✓ Logged ${ex.count} ${ex.name}! ${encouragement} That's ${currentTotal} today (${percentComplete}%).${goalStatus}`
      };
    }
  }
  
  // Progress queries
  if (lower.includes('progress') || lower.includes('how am i') || lower.includes('how many') || lower.includes('status') || lower.includes("how's it going") || lower.includes('update')) {
    const totalToday = Object.values(todayData).reduce((a, b) => a + b, 0);
    const totalGoal = Object.values(goals).reduce((a, b) => a + b, 0);
    const exercisesDone = Object.keys(todayData).filter(k => todayData[k] > 0).length;
    
    if (totalToday === 0) {
      return { action: 'info', response: "You haven't logged any exercises today yet. Ready to get started? Just tell me what you did, like 'I did 20 push-ups'." };
    }
    
    const breakdown = Object.entries(todayData)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `${EXERCISES[k]?.name}: ${v}/${goals[k]}`)
      .join(', ');
    
    return {
      action: 'info',
      response: `Today's progress: ${totalToday}/${totalGoal} total reps (${Math.round((totalToday/totalGoal)*100)}%). ${exercisesDone}/5 exercises done. Breakdown: ${breakdown}`
    };
  }
  
  // Form/technique questions
  if (lower.includes('form') || lower.includes('how to') || lower.includes('proper') || lower.includes('technique')) {
    const formTips = {
      pushups: "**Push-up Form:**\n• Hands shoulder-width apart, fingers forward\n• Body in straight line from head to heels\n• Lower until chest nearly touches floor\n• Elbows at 45° angle (not flared out)\n• Exhale as you push up",
      squats: "**Squat Form:**\n• Feet shoulder-width, toes slightly out\n• Push hips back first, then bend knees\n• Keep chest up and core tight\n• Go to parallel or below\n• Drive through heels to stand",
      lunges: "**Lunge Form:**\n• Step forward 2-3 feet\n• Both knees to 90° at bottom\n• Front knee stays over ankle\n• Back knee hovers just above floor\n• Push through front heel to return",
      dips: "**Dip Form:**\n• Hands on edge, fingers forward\n• Lower until upper arms parallel to floor\n• Keep elbows pointing back, not flared\n• Don't go too deep (shoulder strain)\n• Squeeze triceps at top",
      crunches: "**Crunch Form:**\n• Knees bent, feet flat on floor\n• Hands behind head (don't pull neck)\n• Lift shoulder blades off floor\n• Exhale and squeeze abs at top\n• Lower slowly with control"
    };
    
    if (exerciseKey) {
      return { action: 'info', response: formTips[exerciseKey] };
    }
    return { action: 'info', response: "Which exercise would you like form tips for? I can help with push-ups, squats, lunges, dips, or crunches." };
  }
  
  // Motivation
  if (lower.includes('motivat') || lower.includes('encourage') || lower.includes('inspire')) {
    const motivations = [
      "Every rep counts. You're building a stronger, healthier future with each one.",
      "Consistency beats intensity. Show up today, and your future self will thank you.",
      "The ability to do 40+ push-ups correlates with 96% reduced cardiovascular disease risk. Every push-up is an investment in your longevity.",
      "Muscle is your metabolic armor. Each rep helps protect against age-related decline.",
      "You don't have to be perfect. You just have to be consistent. Let's get some reps in!"
    ];
    return { action: 'info', response: motivations[Math.floor(Math.random() * motivations.length)] };
  }
  
  // Help
  if (lower.includes('help') || lower.includes('what can you')) {
    return { 
      action: 'info', 
      response: "I can help you:\n• **Log exercises**: Say 'I did 20 push-ups' or '15 squats'\n• **Check progress**: Ask 'How am I doing today?'\n• **Form tips**: Ask 'How do I do proper squats?'\n• **Get motivated**: Say 'Motivate me'\n\nTry the mic button for voice input! 🎤" 
    };
  }
  
  // Default response
  return {
    action: 'info',
    response: "I can help you log exercises! Try saying something like:\n• 'I did 20 push-ups'\n• 'Log 15 squats'\n• 'How's my progress?'\n• 'Form tips for lunges'\n\nOr tap the mic to use voice! 🎤"
  };
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function StrengthForLife() {
  // Auth state
  const [user, setUser] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptDismissed, setAuthPromptDismissed] = useState(false); // Track if user dismissed this session
  const [authMode, setAuthMode] = useState('register');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');
  const [guestRepsLogged, setGuestRepsLogged] = useState(0);
  
  // App state
  const [currentView, setCurrentView] = useState('today');
  const [workoutData, setWorkoutData] = useState({});
  const [goals, setGoals] = useState({ pushups: 100, squats: 100, lunges: 100, dips: 100, crunches: 100 });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  
  // Expanded card states
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Learning center state
  const [learningExercise, setLearningExercise] = useState(null);
  const [learningMessages, setLearningMessages] = useState([]);
  const [learningInput, setLearningInput] = useState('');
  const [learningLoading, setLearningLoading] = useState(false);
  const learningChatRef = useRef(null);
  
  // DEXA state with unit preferences
  const [dexaScans, setDexaScans] = useState([]);
  const [showDexaForm, setShowDexaForm] = useState(false);
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'ft'
  const [massUnit, setMassUnit] = useState('kg'); // 'kg' or 'lb'
  const [dexaForm, setDexaForm] = useState({
    date: getTodayKey(),
    heightCm: '',
    heightFt: '',
    heightIn: '',
    armLeanMass: '',
    legLeanMass: '',
    totalBodyFat: '',
    gender: 'male',
    age: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsingFile, setParsingFile] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  
  // Chat/Voice state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Exercise logging state
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [repInput, setRepInput] = useState('');
  
  // Refs to track current state for speech recognition callbacks
  const workoutDataRef = useRef(workoutData);
  const goalsRef = useRef(goals);
  
  // Keep refs in sync with state
  useEffect(() => {
    workoutDataRef.current = workoutData;
  }, [workoutData]);
  
  useEffect(() => {
    goalsRef.current = goals;
  }, [goals]);
  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
      };
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        
        if (interim) {
          setInterimTranscript(interim);
        }
        
        if (final) {
          console.log('Final transcript:', final);
          setInterimTranscript('');
          // Use refs to get current state values (avoids stale closure)
          setChatMessages(prev => [...prev, { role: 'user', content: final }]);

          const result = parseVoiceCommand(final, workoutDataRef.current, goalsRef.current);

          // Handle single exercise logging
          if (result.action === 'log' && result.exercise && result.count) {
            const today = getTodayKey();
            setWorkoutData(prev => ({
              ...prev,
              [today]: {
                ...prev[today],
                [result.exercise]: (prev[today]?.[result.exercise] || 0) + result.count
              }
            }));
          }

          // Handle multiple exercises logging
          if (result.action === 'log_multiple' && result.exercises) {
            const today = getTodayKey();
            setWorkoutData(prev => {
              const newData = { ...prev };
              const todayData = { ...(newData[today] || {}) };

              for (const ex of result.exercises) {
                todayData[ex.key] = (todayData[ex.key] || 0) + ex.count;
              }

              newData[today] = todayData;
              return newData;
            });
          }

          setTimeout(() => {
            setChatMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
          }, 300);

          setIsListening(false);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: '🎤 Microphone access denied. Please allow microphone access in your browser settings and try again.' 
          }]);
        } else if (event.error === 'no-speech') {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I didn't hear anything. Tap the mic and try speaking again." 
          }]);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setInterimTranscript('');
      };
      
      recognitionRef.current = recognition;
    } else {
      console.log('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Load saved data on mount
  useEffect(() => {
    // Load app data
    const saved = localStorage.getItem('sfl_enhanced_v1');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.user) setUser(d.user);
        if (d.workoutData) setWorkoutData(d.workoutData);
        if (d.goals) setGoals(d.goals);
        if (d.achievements) setUnlockedAchievements(d.achievements);
        if (d.dexaScans) setDexaScans(d.dexaScans);
        if (d.guestRepsLogged) setGuestRepsLogged(d.guestRepsLogged);
        if (d.heightUnit) setHeightUnit(d.heightUnit);
        if (d.massUnit) setMassUnit(d.massUnit);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
    
    // Also check for logged in user separately (backup)
    const savedUser = localStorage.getItem('sfl_current_user');
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // Save data on changes
  useEffect(() => {
    localStorage.setItem('sfl_enhanced_v1', JSON.stringify({
      user, workoutData, goals, achievements: unlockedAchievements, dexaScans, guestRepsLogged, heightUnit, massUnit
    }));
    // Also save user separately for better persistence
    if (user) {
      localStorage.setItem('sfl_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sfl_current_user');
    }
  }, [user, workoutData, goals, unlockedAchievements, dexaScans, guestRepsLogged, heightUnit, massUnit]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Calculate stats
  const getStats = () => {
    const today = getTodayKey();
    const todayData = workoutData[today] || {};
    let totalReps = 0, dailyTotal = 0, exercisesToday = 0, goalsMetToday = 0;
    
    Object.values(workoutData).forEach(day => Object.values(day).forEach(r => totalReps += r));
    Object.entries(todayData).forEach(([ex, r]) => {
      dailyTotal += r;
      if (r > 0) exercisesToday++;
      if (r >= goals[ex]) goalsMetToday++;
    });
    
    let streak = 0;
    let d = new Date();
    while (workoutData[d.toISOString().split('T')[0]] && Object.values(workoutData[d.toISOString().split('T')[0]]).some(r => r > 0)) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    
    const totalGoal = Object.values(goals).reduce((a,b) => a+b, 0);
    const goalPct = totalGoal > 0 ? Math.round((dailyTotal / totalGoal) * 100) : 0;
    
    return { totalReps, dailyTotal, exercisesToday, goalsMetToday, streak, goalPct, dexaScans: dexaScans.length };
  };

  // Check achievements
  const checkAchievements = () => {
    const stats = getStats();
    ACHIEVEMENTS.forEach(a => {
      if (!unlockedAchievements.includes(a.id) && a.check(stats)) {
        setUnlockedAchievements(p => [...p, a.id]);
        setShowAchievement(a);
        setTimeout(() => setShowAchievement(null), 4000);
      }
    });
  };

  // Log reps
  const logReps = (ex, reps) => {
    const today = getTodayKey();
    setWorkoutData(p => ({ ...p, [today]: { ...p[today], [ex]: (p[today]?.[ex] || 0) + reps } }));
    if (!user) {
      const n = guestRepsLogged + reps;
      setGuestRepsLogged(n);
      // Only show auth prompt once per session, and only if not already dismissed
      if (n >= 50 && !showAuthPrompt && !authPromptDismissed) {
        setTimeout(() => setShowAuthPrompt(true), 1000);
      }
    }
    setTimeout(checkAchievements, 100);
  };

  // Auth handler
  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'register' && !authForm.name) { setAuthError('Enter your name'); return; }
    if (!authForm.email || !authForm.password) { setAuthError('Fill all fields'); return; }
    
    const users = JSON.parse(localStorage.getItem('sfl_users') || '{}');
    
    if (authMode === 'register') {
      if (users[authForm.email]) { setAuthError('Email already exists'); return; }
      users[authForm.email] = { name: authForm.name, password: authForm.password };
      localStorage.setItem('sfl_users', JSON.stringify(users));
      const newUser = { email: authForm.email, name: authForm.name };
      setUser(newUser);
      // Immediately save to localStorage
      localStorage.setItem('sfl_current_user', JSON.stringify(newUser));
    } else {
      const u = users[authForm.email];
      if (!u || u.password !== authForm.password) { setAuthError('Invalid email or password'); return; }
      const loggedInUser = { email: authForm.email, name: u.name };
      setUser(loggedInUser);
      // Immediately save to localStorage
      localStorage.setItem('sfl_current_user', JSON.stringify(loggedInUser));
    }
    
    setShowAuthPrompt(false);
    setAuthError('');
    setAuthForm({ email: '', password: '', name: '' }); // Clear form
  };

  // DEXA form helpers
  const getHeightInCm = () => {
    if (heightUnit === 'cm') return parseFloat(dexaForm.heightCm) || 0;
    return ftInToCm(dexaForm.heightFt, dexaForm.heightIn);
  };

  const getMassInKg = (value) => {
    if (massUnit === 'kg') return parseFloat(value) || 0;
    return lbToKg(value);
  };

  // Add DEXA scan
  const addDexaScan = () => {
    const heightCm = getHeightInCm();
    const armKg = getMassInKg(dexaForm.armLeanMass);
    const legKg = getMassInKg(dexaForm.legLeanMass);
    const age = parseInt(dexaForm.age) || 40;
    
    if (heightCm < 100 || heightCm > 250) {
      alert('Please enter a valid height');
      return;
    }
    if (armKg <= 0 || legKg <= 0) {
      alert('Please enter valid lean mass values');
      return;
    }
    if (age < 18 || age > 120) {
      alert('Please enter a valid age (18-120)');
      return;
    }
    
    const almi = calculateALMI(armKg, legKg, heightCm);
    
    setDexaScans(p => [...p, {
      date: dexaForm.date,
      heightCm,
      armLeanMass: armKg,
      legLeanMass: legKg,
      totalBodyFat: parseFloat(dexaForm.totalBodyFat) || null,
      gender: dexaForm.gender,
      age: age,
      almi,
      id: Date.now()
    }].sort((a,b) => new Date(a.date) - new Date(b.date)));
    
    setShowDexaForm(false);
    setDexaForm({ date: getTodayKey(), heightCm: '', heightFt: '', heightIn: '', armLeanMass: '', legLeanMass: '', totalBodyFat: '', gender: 'male', age: '' });
    setUploadedFile(null);
    setFileError('');
    setTimeout(checkAchievements, 100);
  };

  // File upload and AI parsing (PDF or Image)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Please upload a PDF or image file (PNG, JPG, WEBP)');
      return;
    }
    
    setUploadedFile(file);
    setParsingFile(true);
    setFileError('');
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result.split(',')[1];
      const isPdf = file.type === 'application/pdf';
      const mediaType = file.type;
      
      try {
        const response = await fetch("/api/parse-dexa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data,
            mediaType,
            isPdf
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `API error: ${response.status}`);
        }
        
        const parsed = await response.json();

        if (parsed && !parsed.error) {
          
          // Update form with extracted values
          setDexaForm(prev => ({
            ...prev,
            armLeanMass: parsed.armLeanMassKg ? parsed.armLeanMassKg.toFixed(2) : prev.armLeanMass,
            legLeanMass: parsed.legLeanMassKg ? parsed.legLeanMassKg.toFixed(2) : prev.legLeanMass,
            totalBodyFat: parsed.totalBodyFatPercent ? parsed.totalBodyFatPercent.toString() : prev.totalBodyFat,
            heightCm: parsed.heightCm ? parsed.heightCm.toString() : prev.heightCm,
            age: parsed.age ? parsed.age.toString() : prev.age,
            gender: parsed.gender || prev.gender
          }));
          
          // Set units to metric if we extracted values
          if (parsed.armLeanMassKg || parsed.legLeanMassKg) {
            setMassUnit('kg');
          }
          if (parsed.heightCm) {
            setHeightUnit('cm');
          }
          
          setFileError('');
        } else {
          setFileError('Could not parse values. Please enter manually.');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setFileError('Error reading file. Please enter values manually.');
      }
      
      setParsingFile(false);
    };
    
    reader.onerror = () => {
      setFileError('Error reading file. Please try again.');
      setParsingFile(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Voice input handling
  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not available');
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.' 
      }]);
      return;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        // Abort any existing recognition first
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
        
        recognitionRef.current.start();
        setIsListening(true);
        setInterimTranscript('');
        console.log('Started listening...');
      } catch (e) {
        console.error('Failed to start recognition:', e);
        setIsListening(false);
        if (e.message?.includes('already started')) {
          // Try to stop and restart
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (e2) {
              console.error('Retry failed:', e2);
            }
          }, 100);
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Could not start voice input. Please check microphone permissions and try again.' 
          }]);
        }
      }
    }
  };

  // handleVoiceInput now uses refs to avoid stale closures
  const handleVoiceInput = (transcript) => {
    setChatMessages(p => [...p, { role: 'user', content: transcript }]);

    // Use refs to get current state values
    const result = parseVoiceCommand(transcript, workoutDataRef.current, goalsRef.current);

    if (result.action === 'log' && result.exercise && result.count) {
      logReps(result.exercise, result.count);
    }

    if (result.action === 'log_multiple' && result.exercises) {
      for (const ex of result.exercises) {
        logReps(ex.key, ex.count);
      }
    }

    setChatInput('');
    setTimeout(() => {
      setChatMessages(p => [...p, { role: 'assistant', content: result.response }]);
    }, 300);
  };

  // Learning center AI chat
  const handleLearningChat = async (input) => {
    if (!input?.trim() || learningLoading) return;
    
    const userMessage = input.trim();
    setLearningInput('');
    setLearningMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLearningLoading(true);
    
    // Scroll to bottom
    setTimeout(() => learningChatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    
    const exercise = LEARNING_CONTENT[learningExercise];
    const systemPrompt = `You are a knowledgeable fitness and longevity expert helping someone learn about ${exercise.title} and their importance for healthspan and longevity.

Context about ${exercise.title}:
${exercise.overview}

Guidelines:
- Be encouraging and educational
- Focus on the health and longevity benefits
- Provide practical, actionable advice
- Reference scientific research when relevant
- Keep responses concise but informative (2-3 paragraphs max)
- Use **bold** for key terms
- If asked about form, be very specific about proper technique`;

    try {
      const response = await fetch("/api/learning-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          messages: learningMessages
            .filter(m => m.role !== 'system')
            .concat({ role: 'user', content: userMessage })
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API error');
      }

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";
      
      setLearningMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Learning chat error:', error);
      setLearningMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    }
    
    setLearningLoading(false);
    setTimeout(() => learningChatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { role: 'user', content: chatInput }]);

    // Use refs to get current state values
    const result = parseVoiceCommand(chatInput, workoutDataRef.current, goalsRef.current);

    if (result.action === 'log' && result.exercise && result.count) {
      logReps(result.exercise, result.count);
    }

    if (result.action === 'log_multiple' && result.exercises) {
      for (const ex of result.exercises) {
        logReps(ex.key, ex.count);
      }
    }

    setChatInput('');
    setTimeout(() => {
      setChatMessages(p => [...p, { role: 'assistant', content: result.response }]);
    }, 300);
  };

  // Chart data
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayData = workoutData[key] || {};
      data.push({ 
        date: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        total: Object.values(dayData).reduce((a,b) => a+b, 0),
        ...dayData 
      });
    }
    return data;
  };

  // Computed values
  const stats = getStats();
  const today = getTodayKey();
  const todayData = workoutData[today] || {};
  const chartData = getChartData();

  const getReadinessScore = () => {
    let score = 50;
    if (stats.streak > 0) score += Math.min(20, stats.streak * 3);
    if (stats.dailyTotal > 0) score += 10;
    if (stats.goalsMetToday > 0) score += stats.goalsMetToday * 4;
    return Math.min(100, score);
  };

  const getStrengthStatus = () => {
    const pct = stats.goalPct;
    if (pct >= 100) return 'optimal';
    if (pct >= 75) return 'thriving';
    if (pct >= 50) return 'good';
    if (pct >= 25) return 'almost';
    if (stats.dailyTotal > 0) return 'building';
    return 'needscare';
  };

  const readinessScore = getReadinessScore();

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen text-white" style={{ 
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%)', 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
    }}>
      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="card-gradient rounded-3xl p-8 animate-celebrate">
            <div className="text-6xl text-center mb-3">{showAchievement.icon}</div>
            <h3 className="text-xl font-semibold text-center">{showAchievement.name}</h3>
            <p className="text-white/50 text-center text-sm mt-1">{showAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-dark rounded-2xl max-w-sm w-full p-6 animate-slideUp relative">
            <button 
              onClick={() => {
                setShowAuthPrompt(false);
                setAuthError('');
                setAuthPromptDismissed(true); // Don't show again this session
              }} 
              className="absolute top-4 right-4 w-8 h-8 text-white/50 hover:text-white"
            >
              <Icons.x />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 text-teal-400"><Icons.trophy /></div>
              <h2 className="text-xl font-semibold">{user ? 'Account' : 'Save Your Progress'}</h2>
              <p className="text-white/50 text-sm mt-1">{guestRepsLogged > 0 ? `${guestRepsLogged} reps logged` : 'Sign in to sync your data'}</p>
            </div>
            <div className="flex gap-1 mb-4 p-1 bg-white/5 rounded-lg">
              <button onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'register' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}>Sign Up</button>
              <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'login' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}>Sign In</button>
            </div>
            {authError && <p className="text-red-400 text-sm mb-3 text-center">{authError}</p>}
            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'register' && (
                <input type="text" placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" />
              )}
              <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" />
              <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" />
              <button type="submit" className="w-full py-3 bg-teal-500 rounded-xl font-medium hover:bg-teal-600 transition">{authMode === 'register' ? 'Create Account' : 'Sign In'}</button>
            </form>
            <button 
              onClick={() => { 
                setShowAuthPrompt(false); 
                setAuthError(''); 
                setAuthPromptDismissed(true); // Don't show again this session
              }} 
              className="w-full mt-4 py-3 bg-white/10 rounded-xl text-white/80 text-sm font-medium hover:bg-white/20 transition"
            >
              Skip for now
            </button>
            <p className="text-center text-white/40 text-xs mt-2">You can sign in later from Settings</p>
          </div>
        </div>
      )}

      {/* DEXA Modal - Enhanced with Units */}
      {showDexaForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-dark rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Log DEXA Scan</h2>
              <button onClick={() => { setShowDexaForm(false); setUploadedFile(null); setFileError(''); }} className="w-8 h-8 text-white/50 hover:text-white">
                <Icons.x />
              </button>
            </div>
            
            {/* File Upload Section - PDF or Image */}
            <div className="mb-6">
              <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={parsingFile} 
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl hover:border-teal-500/50 transition flex items-center justify-center gap-3"
              >
                {parsingFile ? (
                  <>
                    <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/70">AI analyzing file...</span>
                  </>
                ) : uploadedFile ? (
                  <>
                    <div className="w-5 h-5 text-teal-400"><Icons.check /></div>
                    <span className="text-teal-400 truncate max-w-[200px]">{uploadedFile.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 text-white/50"><Icons.upload /></div>
                    <span className="text-white/70">Upload DEXA (PDF or Screenshot)</span>
                  </>
                )}
              </button>
              {fileError && <p className="text-amber-400 text-sm mt-2 text-center">{fileError}</p>}
              {uploadedFile && !parsingFile && !fileError && (
                <p className="text-teal-400/70 text-sm mt-2 text-center">✓ Values extracted - review and adjust below</p>
              )}
            </div>

            <div className="space-y-4">
              {/* Date and Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Date</label>
                  <input 
                    type="date" 
                    value={dexaForm.date} 
                    onChange={(e) => setDexaForm(p => ({ ...p, date: e.target.value }))} 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500/50" 
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Age *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 45" 
                    value={dexaForm.age} 
                    onChange={(e) => setDexaForm(p => ({ ...p, age: e.target.value }))} 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                  />
                </div>
              </div>
              
              {/* Gender */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Sex *</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDexaForm(p => ({ ...p, gender: 'male' }))} 
                    className={`flex-1 py-3 rounded-xl transition ${dexaForm.gender === 'male' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-white/5 text-white/70 border border-white/10'}`}
                  >
                    Male
                  </button>
                  <button 
                    onClick={() => setDexaForm(p => ({ ...p, gender: 'female' }))} 
                    className={`flex-1 py-3 rounded-xl transition ${dexaForm.gender === 'female' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-white/5 text-white/70 border border-white/10'}`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Height with unit toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">Height *</label>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                    <button 
                      onClick={() => setHeightUnit('cm')} 
                      className={`px-3 py-1 rounded text-xs font-medium transition toggle-btn ${heightUnit === 'cm' ? 'active' : 'text-white/50'}`}
                    >
                      cm
                    </button>
                    <button 
                      onClick={() => setHeightUnit('ft')} 
                      className={`px-3 py-1 rounded text-xs font-medium transition toggle-btn ${heightUnit === 'ft' ? 'active' : 'text-white/50'}`}
                    >
                      ft/in
                    </button>
                  </div>
                </div>
                {heightUnit === 'cm' ? (
                  <input 
                    type="number" 
                    placeholder="e.g. 175" 
                    value={dexaForm.heightCm} 
                    onChange={(e) => setDexaForm(p => ({ ...p, heightCm: e.target.value }))} 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                  />
                ) : (
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      placeholder="5" 
                      value={dexaForm.heightFt} 
                      onChange={(e) => setDexaForm(p => ({ ...p, heightFt: e.target.value }))} 
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                    />
                    <span className="text-white/50 text-sm">ft</span>
                    <input 
                      type="number" 
                      placeholder="10" 
                      value={dexaForm.heightIn} 
                      onChange={(e) => setDexaForm(p => ({ ...p, heightIn: e.target.value }))} 
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                    />
                    <span className="text-white/50 text-sm">in</span>
                  </div>
                )}
              </div>

              {/* Lean mass with unit toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">Appendicular Lean Mass *</label>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                    <button 
                      onClick={() => setMassUnit('kg')} 
                      className={`px-3 py-1 rounded text-xs font-medium transition toggle-btn ${massUnit === 'kg' ? 'active' : 'text-white/50'}`}
                    >
                      kg
                    </button>
                    <button 
                      onClick={() => setMassUnit('lb')} 
                      className={`px-3 py-1 rounded text-xs font-medium transition toggle-btn ${massUnit === 'lb' ? 'active' : 'text-white/50'}`}
                    >
                      lb
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-white/40 block mb-1">Arms (both)</span>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder={massUnit === 'kg' ? 'e.g. 6.5' : 'e.g. 14.3'} 
                      value={dexaForm.armLeanMass} 
                      onChange={(e) => setDexaForm(p => ({ ...p, armLeanMass: e.target.value }))} 
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                    />
                  </div>
                  <div>
                    <span className="text-xs text-white/40 block mb-1">Legs (both)</span>
                    <input 
                      type="number" 
                      step="0.1" 
                      placeholder={massUnit === 'kg' ? 'e.g. 18.5' : 'e.g. 40.8'} 
                      value={dexaForm.legLeanMass} 
                      onChange={(e) => setDexaForm(p => ({ ...p, legLeanMass: e.target.value }))} 
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                    />
                  </div>
                </div>
                <p className="text-xs text-white/30 mt-1">Sum of left + right limb lean tissue from your DEXA report</p>
              </div>

              {/* Body Fat (optional) */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1">Body Fat % (optional)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g. 22.5" 
                  value={dexaForm.totalBodyFat} 
                  onChange={(e) => setDexaForm(p => ({ ...p, totalBodyFat: e.target.value }))} 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                />
              </div>

              {/* ALMI Preview with Age-Based Interpretation */}
              {((heightUnit === 'cm' && dexaForm.heightCm) || (heightUnit === 'ft' && (dexaForm.heightFt || dexaForm.heightIn))) && dexaForm.armLeanMass && dexaForm.legLeanMass && dexaForm.age && (
                (() => {
                  const heightCm = getHeightInCm();
                  const armKg = getMassInKg(dexaForm.armLeanMass);
                  const legKg = getMassInKg(dexaForm.legLeanMass);
                  const almi = parseFloat(calculateALMI(armKg, legKg, heightCm));
                  const age = parseInt(dexaForm.age) || 40;
                  const interp = getALMIInterpretation(almi, dexaForm.gender, age);
                  const ranges = ALMI_RANGES[dexaForm.gender][getAgeCategory(age)];
                  
                  return (
                    <div className="card-gradient rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-white/50 block">CALCULATED ALMI</span>
                          <p className="number-large text-white">{almi} <span className="text-lg text-white/50">kg/m²</span></p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${interp.color}20`, color: interp.color }}>
                          {interp.label}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-white/70">{interp.desc}</p>
                        <p className="text-sm text-white/50">{interp.recommendation}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/40">
                          Reference for {dexaForm.gender === 'male' ? 'men' : 'women'} age {ranges.label}:
                        </p>
                        <p className="text-xs text-white/40">
                          Typical: {ranges.typical[0]}–{ranges.typical[1]} kg/m² • Strong: &gt;{ranges.strong} • Low: &lt;{ranges.min}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setShowDexaForm(false); setUploadedFile(null); setFileError(''); }} 
                className="flex-1 py-3 bg-white/5 rounded-xl text-white/70 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={addDexaScan} 
                disabled={!dexaForm.armLeanMass || !dexaForm.legLeanMass || !dexaForm.age || (!dexaForm.heightCm && !dexaForm.heightFt)} 
                className="flex-1 py-3 bg-teal-500 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Scan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentView('settings')} className="w-8 h-8 text-white/50 hover:text-white transition">
            <Icons.settings />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">STRENGTH</h1>
          {user ? (
            <button onClick={() => { 
              setUser(null); 
              localStorage.removeItem('sfl_current_user');
              setAuthForm({ email: '', password: '', name: '' });
              setAuthError('');
              setAuthMode('login');
            }} className="text-white/50 text-sm hover:text-white transition">Sign Out</button>
          ) : (
            <button onClick={() => {
              setAuthForm({ email: '', password: '', name: '' });
              setAuthError('');
              setAuthMode('login');
              setShowAuthPrompt(true);
            }} className="text-white/50 text-sm hover:text-white transition">Sign In</button>
          )}
        </div>
      </header>

      {/* Score Pills */}
      <div className="px-5 py-4 cosmic-bg stars">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {[
            { label: 'Readiness', value: readinessScore, color: '#14b8a6' },
            { label: 'Streak', value: stats.streak, color: '#f97316' },
            { label: 'Today', value: stats.dailyTotal, color: '#a855f7' },
            { label: 'Goals', value: `${stats.goalsMetToday}/5`, color: '#22c55e' }
          ].map((item, i) => (
            <div key={i} className="flex-shrink-0 w-20 text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2" style={{ background: `radial-gradient(circle, ${item.color}20 0%, transparent 70%)` }}>
                <div className="text-center">
                  <div className="w-4 h-4 mx-auto mb-1 opacity-60" style={{ color: item.color }}><Icons.crown /></div>
                  <span className="text-xl font-light">{item.value}</span>
                </div>
              </div>
              <span className="text-xs text-white/50">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-5 pb-28 space-y-4">
        
        {/* ==================== TODAY VIEW ==================== */}
        {currentView === 'today' && (
          <div className="space-y-4 animate-slideUp">
            
            {/* Strength Score Card - Expandable */}
            <div className="card-gradient rounded-2xl overflow-hidden glow-teal">
              <button 
                onClick={() => {
                  const newExpanded = expandedCard === 'strength' ? null : 'strength';
                  setExpandedCard(newExpanded);
                  if (!newExpanded) setSelectedExercise(null);
                }} 
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-teal-400"><Icons.muscle /></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Strength Score</h3>
                      <StatusBadge status={getStrengthStatus()} />
                    </div>
                  </div>
                  <div className={`w-5 h-5 text-white/30 transition-transform duration-200 ${expandedCard === 'strength' ? 'rotate-90' : ''}`}>
                    <Icons.chevron />
                  </div>
                </div>
                <div className="flex items-end gap-2 mt-4">
                  <span className="number-xl">{stats.goalPct}</span>
                  <span className="text-white/50 text-lg mb-2">%</span>
                  {stats.goalPct >= 100 && <div className="w-5 h-5 text-amber-400 mb-2"><Icons.crown /></div>}
                </div>
                <RangeSlider value={stats.goalPct} min={0} max={100} color="#14b8a6" />
              </button>
              
              {/* Expanded content */}
              {expandedCard === 'strength' && (
                <div className="px-5 pb-5 space-y-3 animate-slideUp border-t border-white/5 pt-4">
                  <h4 className="text-sm text-white/70 font-medium">Exercise Breakdown</h4>
                  {Object.entries(EXERCISES).map(([key, ex]) => {
                    const done = todayData[key] || 0;
                    const pct = Math.min(100, (done / goals[key]) * 100);
                    const isSelected = selectedExercise === key;
                    return (
                      <div key={key}>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedExercise(isSelected ? null : key); 
                          }}
                          className={`w-full flex items-center gap-3 p-2 -mx-2 rounded-lg transition ${isSelected ? 'bg-white/5' : 'hover:bg-white/5'}`}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ex.color}20` }}>
                            <div className="w-4 h-4" style={{ color: ex.color }}><Icons.dumbbell /></div>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/80">{ex.name}</span>
                              <span>
                                <span style={{ color: ex.color }}>{done}</span>
                                <span className="text-white/40">/{goals[key]}</span>
                                {done >= goals[key] && <span className="ml-1">✓</span>}
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: ex.color }} />
                            </div>
                          </div>
                        </button>
                        {isSelected && (
                          <div className="ml-11 mt-2 mb-3 animate-slideUp">
                            <div className="flex gap-2 flex-wrap">
                              {[5, 10, 15, 20, 25].map(n => (
                                <button 
                                  key={n} 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    logReps(key, n); 
                                  }} 
                                  className="px-3 py-1.5 bg-white/10 hover:bg-teal-500/30 rounded-lg text-sm font-medium text-white/80 hover:text-teal-400 transition"
                                >
                                  +{n}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentView('log'); setSelectedExercise(null); }} 
                    className="w-full mt-3 py-3 bg-teal-500/20 text-teal-400 rounded-xl font-medium hover:bg-teal-500/30 transition"
                  >
                    Custom Reps
                  </button>
                </div>
              )}
            </div>

            {/* Activity Goal Card - Expandable */}
            <div className="card-gradient rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpandedCard(expandedCard === 'activity' ? null : 'activity')} 
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-orange-400"><Icons.flame /></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Activity Goal</h3>
                      <StatusBadge status={stats.goalPct >= 100 ? 'optimal' : stats.goalPct >= 50 ? 'almost' : 'building'} />
                    </div>
                  </div>
                  <div className={`w-5 h-5 text-white/30 transition-transform duration-200 ${expandedCard === 'activity' ? 'rotate-90' : ''}`}>
                    <Icons.chevron />
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-end gap-1">
                    <span className="number-large">{stats.dailyTotal}</span>
                    <span className="text-white/50 text-sm mb-1">reps</span>
                  </div>
                  <div className="text-right text-sm text-white/50">
                    <div>{Object.values(goals).reduce((a,b) => a+b, 0)} goal</div>
                  </div>
                </div>
                <RangeSlider value={stats.dailyTotal} min={0} max={Object.values(goals).reduce((a,b) => a+b, 0)} color="#f97316" />
              </button>
              
              {/* Expanded content */}
              {expandedCard === 'activity' && (
                <div className="px-5 pb-5 space-y-4 animate-slideUp border-t border-white/5 pt-4">
                  <h4 className="text-sm text-white/70 font-medium">Weekly Progress</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} fill="url(#activityGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-white/5 rounded-lg py-3">
                      <div className="text-white font-medium text-lg">{stats.streak}</div>
                      <div className="text-white/40 text-xs">day streak</div>
                    </div>
                    <div className="bg-white/5 rounded-lg py-3">
                      <div className="text-white font-medium text-lg">{stats.totalReps.toLocaleString()}</div>
                      <div className="text-white/40 text-xs">all time</div>
                    </div>
                    <div className="bg-white/5 rounded-lg py-3">
                      <div className="text-white font-medium text-lg">{stats.exercisesToday}</div>
                      <div className="text-white/40 text-xs">exercises</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7-Day Chart */}
            <div className="card-dark rounded-2xl p-5">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-4">Last 7 Days</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} width={30} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} fill="url(#areaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LOG VIEW ==================== */}
        {currentView === 'log' && (
          <div className="space-y-3 animate-slideUp">
            <h2 className="text-lg font-semibold text-center mb-4">Log Workout</h2>
            {Object.entries(EXERCISES).map(([key, ex]) => {
              const done = todayData[key] || 0;
              const isOpen = selectedExercise === key;
              const goalMet = done >= goals[key];
              return (
                <div key={key}>
                  <button 
                    onClick={() => setSelectedExercise(isOpen ? null : key)} 
                    className={`w-full card-gradient rounded-2xl p-4 text-left transition-all ${isOpen ? 'ring-1 ring-teal-500/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ex.color}20` }}>
                          <div className="w-6 h-6" style={{ color: ex.color }}><Icons.dumbbell /></div>
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {ex.name}
                            {goalMet && <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">Goal met!</span>}
                          </h3>
                          <p className="text-xs text-white/40">{ex.muscle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-light" style={{ color: ex.color }}>{done}</div>
                        <div className="text-xs text-white/40">of {goals[key]}</div>
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-2 card-dark rounded-xl p-4 animate-slideUp">
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {[5, 10, 15, 20, 25].map(n => (
                          <button 
                            key={n} 
                            onClick={() => { logReps(key, n); setSelectedExercise(null); }} 
                            className="py-3 bg-white/5 hover:bg-teal-500/20 rounded-lg text-sm font-medium text-white/80 hover:text-teal-400 transition"
                          >
                            +{n}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={repInput} 
                          onChange={(e) => setRepInput(e.target.value)} 
                          placeholder="Custom amount" 
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50" 
                        />
                        <button 
                          onClick={() => { 
                            if (repInput > 0) { 
                              logReps(key, parseInt(repInput)); 
                              setRepInput(''); 
                              setSelectedExercise(null); 
                            }
                          }} 
                          className="px-6 py-3 bg-teal-500 rounded-xl font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ==================== VITALS VIEW ==================== */}
        {currentView === 'vitals' && (
          <div className="space-y-4 animate-slideUp">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Body Composition</h2>
              <button 
                onClick={() => setShowDexaForm(true)} 
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-500/20 rounded-full text-teal-400 text-sm hover:bg-teal-500/30 transition"
              >
                <div className="w-4 h-4"><Icons.plus /></div>
                Add Scan
              </button>
            </div>

            {/* ALMI Info Card */}
            <div className="card-gradient rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <div className="w-5 h-5 text-teal-400"><Icons.info /></div>
                </div>
                <div>
                  <h3 className="font-medium">Understanding ALMI</h3>
                  <span className="text-xs text-white/50">Appendicular Lean Mass Index</span>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-4">
                ALMI = (Arm + Leg Lean Mass) ÷ Height². Normal values depend on sex and age, as lean mass naturally declines after 50-60.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="text-white/50 block mb-1">Men 20-39</span>
                  <span className="text-teal-400">8.0–10.0 kg/m²</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="text-white/50 block mb-1">Women 20-39</span>
                  <span className="text-teal-400">5.5–7.5 kg/m²</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="text-white/50 block mb-1">Men 60+</span>
                  <span className="text-teal-400">7.0–9.0 kg/m²</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2.5">
                  <span className="text-white/50 block mb-1">Women 60+</span>
                  <span className="text-teal-400">5.0–6.8 kg/m²</span>
                </div>
              </div>
            </div>

            {dexaScans.length > 0 ? (
              <>
                {/* Latest Scan Card */}
                {(() => {
                  const latest = dexaScans[dexaScans.length - 1];
                  const interp = getALMIInterpretation(parseFloat(latest.almi), latest.gender, latest.age || 40);
                  const ranges = ALMI_RANGES[latest.gender][getAgeCategory(latest.age || 40)];
                  
                  return (
                    <div className="card-gradient rounded-2xl p-5 glow-teal">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">Latest ALMI</h3>
                          <span className="text-xs font-semibold tracking-wider" style={{ color: interp.color }}>{interp.label}</span>
                        </div>
                        <span className="text-xs text-white/50">{new Date(latest.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-end gap-2 mt-3">
                        <span className="number-xl">{latest.almi}</span>
                        <span className="text-white/50 text-lg mb-2">kg/m²</span>
                      </div>
                      <RangeSlider 
                        value={parseFloat(latest.almi)} 
                        min={ranges.min - 1} 
                        max={ranges.strong + 1} 
                        color={interp.color} 
                      />
                      <p className="text-sm text-white/60 mt-3">{interp.desc}</p>
                      <p className="text-sm text-white/50 mt-1">{interp.recommendation}</p>
                      <div className="text-xs text-white/40 mt-3 pt-3 border-t border-white/10">
                        Age {latest.age} • {latest.gender === 'male' ? 'Male' : 'Female'} • Reference: {ranges.typical[0]}–{ranges.typical[1]} kg/m²
                      </div>
                    </div>
                  );
                })()}

                {/* Trend Chart */}
                {dexaScans.length > 1 && (
                  <div className="card-dark rounded-2xl p-5">
                    <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-4">ALMI Trend</h3>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dexaScans.map(s => ({ 
                          date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), 
                          almi: parseFloat(s.almi) 
                        }))}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                          <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} width={35} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Line type="monotone" dataKey="almi" stroke="#14b8a6" strokeWidth={2} dot={{ fill: '#14b8a6', r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    {dexaScans.length >= 2 && (
                      <div className="mt-3 text-center">
                        {(() => {
                          const first = parseFloat(dexaScans[0].almi);
                          const last = parseFloat(dexaScans[dexaScans.length - 1].almi);
                          const change = (last - first).toFixed(2);
                          const isPositive = last >= first;
                          return (
                            <span className={`text-sm ${isPositive ? 'text-teal-400' : 'text-amber-400'}`}>
                              {isPositive ? '↑' : '↓'} {Math.abs(change)} kg/m² since first scan
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Scan History */}
                <div className="card-dark rounded-2xl p-5">
                  <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">Scan History</h3>
                  <div className="space-y-2">
                    {[...dexaScans].reverse().map((scan, i) => (
                      <div key={scan.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <span className="text-white/80">{new Date(scan.date).toLocaleDateString()}</span>
                          <span className="text-white/40 text-xs ml-2">Age {scan.age}</span>
                        </div>
                        <span className="text-teal-400 font-medium">{scan.almi} kg/m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card-dark rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-white/20"><Icons.body /></div>
                <h3 className="font-medium mb-1">No DEXA Scans Yet</h3>
                <p className="text-white/50 text-sm mb-4">Track your body composition over time to monitor muscle mass and prevent sarcopenia.</p>
                <button 
                  onClick={() => setShowDexaForm(true)} 
                  className="px-6 py-3 bg-teal-500 rounded-xl font-medium hover:bg-teal-600 transition"
                >
                  Add First Scan
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== HEALTH VIEW ==================== */}
        {currentView === 'health' && (
          <div className="space-y-4 animate-slideUp">
            
            {/* Health Summary */}
            <div className="card-gradient rounded-2xl p-6 cosmic-bg stars overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-30">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444"/>
                      <stop offset="25%" stopColor="#f97316"/>
                      <stop offset="50%" stopColor="#eab308"/>
                      <stop offset="75%" stopColor="#22c55e"/>
                      <stop offset="100%" stopColor="#14b8a6"/>
                    </linearGradient>
                  </defs>
                  <path d="M 10 90 A 40 40 0 0 1 90 90" fill="none" stroke="url(#arcGrad)" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold tracking-wider text-rose-400">NEEDS CARE</span>
                  <span className="text-white/30">—</span>
                  <span className="text-xs font-semibold tracking-wider text-teal-400">THRIVING</span>
                </div>
                <h2 className="text-2xl font-light leading-snug">
                  {stats.streak >= 7 ? 'Excellent consistency! Your training habits are building real strength.' : 
                   stats.dailyTotal > 0 ? 'Good progress today. Every rep brings you closer to your goals.' :
                   'Ready to train? Your body is waiting to get stronger.'}
                </h2>
              </div>
            </div>

            {/* Strength Training Tile - Expandable */}
            <div className="card-gradient rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpandedCard(expandedCard === 'training' ? null : 'training')} 
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-teal-400"><Icons.muscle /></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Strength Training</h3>
                      <StatusBadge status={stats.streak >= 7 ? 'thriving' : stats.streak >= 3 ? 'good' : 'building'} />
                    </div>
                  </div>
                  <div className={`w-5 h-5 text-white/30 transition-transform duration-200 ${expandedCard === 'training' ? 'rotate-90' : ''}`}>
                    <Icons.chevron />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="bg-white/5 rounded-lg px-3 py-1.5 text-sm text-white/70">{stats.streak}-day streak</span>
                  <span className="bg-white/5 rounded-lg px-3 py-1.5 text-sm text-white/70">{stats.totalReps.toLocaleString()} lifetime</span>
                </div>
              </button>
              
              {expandedCard === 'training' && (
                <div className="px-5 pb-5 space-y-4 animate-slideUp border-t border-white/5 pt-4">
                  <p className="text-sm text-white/60">
                    {stats.streak >= 7 
                      ? "Your consistency is paying off! Resistance training is the single most effective intervention for preventing age-related muscle loss."
                      : stats.streak >= 3 
                      ? "You're building momentum! Keep showing up to create lasting habits."
                      : "Every journey starts somewhere. Resistance training is critical for maintaining muscle mass and bone density as you age."
                    }
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl font-light text-teal-400">{stats.totalReps.toLocaleString()}</div>
                      <div className="text-xs text-white/50 mt-1">lifetime reps</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-3xl font-light text-orange-400">{stats.streak}</div>
                      <div className="text-xs text-white/50 mt-1">day streak</div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-sm text-white/70 mb-2">Today's Progress</h4>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, stats.goalPct)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/40">
                      <span>{stats.dailyTotal} reps</span>
                      <span>{Object.values(goals).reduce((a,b) => a+b, 0)} goal</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentView('log'); }} 
                    className="w-full py-3 bg-teal-500/20 text-teal-400 rounded-xl font-medium hover:bg-teal-500/30 transition"
                  >
                    Log Workout
                  </button>
                </div>
              )}
            </div>

            {/* Cardiovascular Tile - Expandable */}
            <div className="card-gradient rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpandedCard(expandedCard === 'cardio' ? null : 'cardio')} 
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 text-green-400"><Icons.heart /></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Cardiovascular</h3>
                      <StatusBadge status={(todayData.pushups || 0) >= 40 ? 'optimal' : stats.totalReps >= 1000 ? 'good' : 'building'} />
                    </div>
                  </div>
                  <div className={`w-5 h-5 text-white/30 transition-transform duration-200 ${expandedCard === 'cardio' ? 'rotate-90' : ''}`}>
                    <Icons.chevron />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="bg-white/5 rounded-lg px-3 py-1.5 text-sm text-white/70">
                    {todayData.pushups || 0}/40 push-ups today
                  </span>
                </div>
              </button>
              
              {expandedCard === 'cardio' && (
                <div className="px-5 pb-5 space-y-4 animate-slideUp border-t border-white/5 pt-4">
                  <p className="text-sm text-white/60">
                    A landmark 2019 JAMA study found that men who could do 40+ consecutive push-ups had a <strong className="text-white">96% reduced risk</strong> of cardiovascular disease compared to those who could do fewer than 10.
                  </p>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-white/70">Push-up capacity target</span>
                      <span className="text-sm text-green-400 font-medium">40+</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, ((todayData.pushups || 0) / 40) * 100)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/40">
                      <span>{todayData.pushups || 0} today</span>
                      <span>{(todayData.pushups || 0) >= 40 ? '✓ Target met!' : `${40 - (todayData.pushups || 0)} to go`}</span>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 italic">
                    Source: Yang J, et al. "Association Between Push-up Exercise Capacity and Future Cardiovascular Events Among Active Adult Men." JAMA Network Open. 2019.
                  </div>
                </div>
              )}
            </div>

            {/* AI Coach with Voice */}
            <div className="card-dark rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <div className="w-5 h-5 text-purple-400"><Icons.brain /></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">AI Coach</h3>
                    <span className="text-xs text-white/50">
                      {speechSupported ? 'Voice-enabled • Say "I did 20 push-ups"' : 'Type your exercises to log them'}
                    </span>
                  </div>
                  {speechSupported && (
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  )}
                </div>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {chatMessages.length === 0 && (
                  <div className="text-center py-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500/20 animate-listening' : 'bg-white/5'}`}>
                      <div className={`w-8 h-8 ${isListening ? 'text-red-400' : 'text-white/40'}`}>
                        <Icons.mic />
                      </div>
                    </div>
                    <p className="text-white/40 text-sm mb-4">
                      {isListening ? 'Listening...' : speechSupported ? 'Tap the mic or type to talk' : 'Type to log exercises'}
                    </p>
                    {interimTranscript && (
                      <p className="text-white/60 text-sm italic mb-4">"{interimTranscript}"</p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['I did 20 push-ups', "How's my progress?", 'Form tips'].map(q => (
                        <button 
                          key={q} 
                          onClick={() => setChatInput(q)} 
                          className="px-3 py-1.5 bg-white/5 rounded-full text-xs text-white/60 hover:text-white/80 hover:bg-white/10 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                    <div className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-white/5 text-white/80'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {interimTranscript && chatMessages.length > 0 && (
                  <div className="text-right">
                    <div className="inline-block max-w-[85%] px-4 py-2.5 rounded-2xl text-sm bg-teal-500/50 text-white/70 italic">
                      {interimTranscript}...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-3 border-t border-white/5">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleChat()} 
                    placeholder={isListening ? "Listening..." : "Type or use voice..."} 
                    disabled={isListening}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-teal-500/50 disabled:opacity-50" 
                  />
                  {speechSupported && (
                    <button 
                      onClick={toggleListening} 
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        isListening 
                          ? 'bg-red-500 animate-listening' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="w-5 h-5 text-white">
                        {isListening ? <Icons.micOff /> : <Icons.mic />}
                      </div>
                    </button>
                  )}
                  <button 
                    onClick={handleChat} 
                    disabled={!chatInput.trim() || isListening}
                    className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-teal-600 transition"
                  >
                    <div className="w-5 h-5 text-white"><Icons.send /></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LEARNING VIEW ==================== */}
        {currentView === 'learning' && !learningExercise && (
          <div className="space-y-4 animate-slideUp">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Strength for Life</h2>
              <h3 className="text-lg text-teal-400 mb-3">Learning Center</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Understand why resistance training and muscle mass are essential for your healthspan and longevity.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(LEARNING_CONTENT).map(([key, content]) => {
                const ex = EXERCISES[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setLearningExercise(key);
                      setLearningMessages([{ role: 'assistant', content: content.overview }]);
                    }}
                    className="w-full card-gradient rounded-2xl p-4 text-left hover:ring-1 hover:ring-white/20 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${ex.color}20` }}>
                        {content.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{content.title}</h4>
                        <p className="text-sm text-white/50">{content.subtitle}</p>
                        <p className="text-xs mt-1" style={{ color: ex.color }}>{ex.muscle}</p>
                      </div>
                      <div className="w-5 h-5 text-white/30">
                        <Icons.chevron />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="card-dark rounded-2xl p-5 mt-6">
              <h4 className="font-medium mb-2">Why Resistance Training?</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                After age 30, we lose 3-5% of muscle mass per decade. This accelerates after 60. 
                Resistance training is the <span className="text-teal-400">only intervention</span> proven to reverse this decline, 
                improving metabolic health, bone density, cognitive function, and independence.
              </p>
            </div>
          </div>
        )}

        {/* Learning Exercise Detail View */}
        {currentView === 'learning' && learningExercise && (
          <div className="space-y-4 animate-slideUp">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => {
                  setLearningExercise(null);
                  setLearningMessages([]);
                  setLearningInput('');
                }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <div className="w-5 h-5 text-white/70 rotate-180"><Icons.chevron /></div>
              </button>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${EXERCISES[learningExercise].color}20` }}>
                  {LEARNING_CONTENT[learningExercise].icon}
                </div>
                <div>
                  <h3 className="font-medium">{LEARNING_CONTENT[learningExercise].title}</h3>
                  <p className="text-xs text-white/50">{LEARNING_CONTENT[learningExercise].subtitle}</p>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="card-dark rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
              <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                  {learningMessages.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                      <div className={`inline-block max-w-[90%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-teal-500 text-white' 
                          : 'bg-white/5 text-white/80'
                      }`}>
                        {msg.content.split('**').map((part, j) => 
                          j % 2 === 0 ? part : <strong key={j} className="text-white">{part}</strong>
                        )}
                      </div>
                    </div>
                  ))}
                  {learningLoading && (
                    <div className="flex items-center gap-2 text-white/50">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                  <div ref={learningChatRef} />
                </div>

                {/* Suggested Prompts */}
                {learningMessages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-white/40 mb-2">Ask me about {LEARNING_CONTENT[learningExercise].title.toLowerCase()}:</p>
                    <div className="flex flex-wrap gap-2">
                      {LEARNING_CONTENT[learningExercise].prompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleLearningChat(prompt)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white/70 hover:text-white transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-white/5">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={learningInput} 
                      onChange={(e) => setLearningInput(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && !learningLoading && handleLearningChat(learningInput)} 
                      placeholder={`Ask about ${LEARNING_CONTENT[learningExercise].title.toLowerCase()}...`}
                      disabled={learningLoading}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-teal-500/50 disabled:opacity-50" 
                    />
                    <button 
                      onClick={() => !learningLoading && handleLearningChat(learningInput)}
                      disabled={!learningInput.trim() || learningLoading}
                      className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-teal-600 transition"
                    >
                      <div className="w-5 h-5 text-white"><Icons.send /></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS VIEW ==================== */}
        {currentView === 'settings' && (
          <div className="space-y-4 animate-slideUp">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            
            <div className="card-dark rounded-2xl p-5">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-4">Daily Goals</h3>
              {Object.entries(EXERCISES).map(([key, ex]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <span className="text-white/80">{ex.name}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setGoals(p => ({ ...p, [key]: Math.max(10, p[key] - 10) }))} 
                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/10 transition"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium">{goals[key]}</span>
                    <button 
                      onClick={() => setGoals(p => ({ ...p, [key]: p[key] + 10 }))} 
                      className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/10 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-dark rounded-2xl p-5">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">
                Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = unlockedAchievements.includes(ach.id);
                  return (
                    <div key={ach.id} className={`text-center p-3 rounded-xl transition ${unlocked ? 'bg-teal-500/10' : 'bg-white/5 opacity-40'}`}>
                      <div className="text-2xl mb-1">{ach.icon}</div>
                      <p className="text-xs text-white/60">{ach.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-dark rounded-2xl p-5">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">Preferred Units</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Height</span>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                    <button 
                      onClick={() => setHeightUnit('cm')} 
                      className={`px-4 py-1.5 rounded text-sm font-medium transition ${heightUnit === 'cm' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}
                    >
                      cm
                    </button>
                    <button 
                      onClick={() => setHeightUnit('ft')} 
                      className={`px-4 py-1.5 rounded text-sm font-medium transition ${heightUnit === 'ft' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}
                    >
                      ft/in
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Mass</span>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
                    <button 
                      onClick={() => setMassUnit('kg')} 
                      className={`px-4 py-1.5 rounded text-sm font-medium transition ${massUnit === 'kg' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}
                    >
                      kg
                    </button>
                    <button 
                      onClick={() => setMassUnit('lb')} 
                      className={`px-4 py-1.5 rounded text-sm font-medium transition ${massUnit === 'lb' ? 'bg-teal-500/20 text-teal-400' : 'text-white/50'}`}
                    >
                      lb
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-dark rounded-2xl p-5">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-3">Account</h3>
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{user.name}</p>
                    <p className="text-white/50 text-sm">{user.email}</p>
                  </div>
                  <button onClick={() => { 
                    setUser(null); 
                    localStorage.removeItem('sfl_current_user');
                    setAuthForm({ email: '', password: '', name: '' });
                    setAuthError('');
                    setAuthMode('login');
                  }} className="px-4 py-2 bg-white/5 rounded-lg text-white/60 text-sm hover:bg-white/10 transition">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-white/50 text-sm">Sign in to sync across devices</p>
                  <button onClick={() => {
                    setAuthForm({ email: '', password: '', name: '' });
                    setAuthError('');
                    setAuthMode('login');
                    setShowAuthPrompt(true);
                  }} className="px-4 py-2 bg-teal-500 rounded-lg text-white text-sm hover:bg-teal-600 transition">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-1 px-2 py-2 rounded-full" style={{ 
          background: 'rgba(30, 40, 50, 0.95)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255,255,255,0.1)' 
        }}>
          {[
            { id: 'today', icon: Icons.activity, label: 'Today' },
            { id: 'vitals', icon: Icons.body, label: 'DEXA' },
            { id: 'learning', icon: Icons.brain, label: 'Learn' },
            { id: 'health', icon: Icons.heart, label: 'Coach' },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { 
                setCurrentView(tab.id); 
                setExpandedCard(null); 
                if (tab.id !== 'learning') {
                  setLearningExercise(null);
                  setLearningMessages([]);
                }
              }} 
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-full transition-all ${currentView === tab.id ? 'bg-white/10' : ''}`}
            >
              <div className={`w-5 h-5 ${currentView === tab.id ? 'text-white' : 'text-white/40'}`}>
                <tab.icon />
              </div>
              <span className={`text-[10px] ${currentView === tab.id ? 'text-white' : 'text-white/40'}`}>{tab.label}</span>
            </button>
          ))}
          <button 
            onClick={() => { setCurrentView('log'); setExpandedCard(null); }} 
            className={`w-12 h-12 ml-1 rounded-full flex items-center justify-center transition ${currentView === 'log' ? 'bg-teal-500' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <div className="w-6 h-6 text-white"><Icons.plus /></div>
          </button>
        </div>
      </nav>
    </div>
  );
}

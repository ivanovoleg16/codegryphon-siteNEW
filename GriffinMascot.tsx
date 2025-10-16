"use client";
import { motion } from 'framer-motion';
import React from 'react';

// Simple animated SVG Griffin (original). Idle: gentle float + blink.
export default function GriffinMascot({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Маскот грифон"
      initial={{ y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#38E8FF" />
          <stop offset="100%" stopColor="#0B6DFF" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="160" r="150" fill="#0C1324" />
      <g>
        <path d="M95 140c0-35 28-63 63-63s63 28 63 63v40c0 28-22 50-50 50h-26c-28 0-50-22-50-50v-40z" fill="url(#g1)"/>
        <path d="M118 116c-14 0-26 12-26 26v5c0 9 7 16 16 16s16-7 16-16v-31z" fill="#fff" opacity=".85"/>
        <path d="M202 116c14 0 26 12 26 26v5c0 9-7 16-16 16s-16-7-16-16v-31z" fill="#fff" opacity=".85"/>
        <circle cx="138" cy="152" r="10" fill="#0B1020"/>
        <circle cx="182" cy="152" r="10" fill="#0B1020"/>
        <motion.rect x="120" y="166" width="80" height="8" rx="4" fill="#0B1020"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 3.6, repeat: Infinity }}
          aria-hidden
        />
        <path d="M88 140l-16-10 10-6c14-8 28-30 30-44l2-12 22 22c-6 14-24 36-48 50z" fill="#38E8FF"/>
        <path d="M232 140l16-10-10-6c-14-8-28-30-30-44l-2-12-22 22c6 14 24 36 48 50z" fill="#38E8FF"/>
      </g>
    </motion.svg>
  );
}

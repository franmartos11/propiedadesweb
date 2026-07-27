'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

type Tab = 'Venta' | 'Alquiler';

interface PropertyTypeTabProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  className?: string;
}

export function PropertyTypeTab({ activeTab, onChange, className = '' }: PropertyTypeTabProps) {
  const tabs: Tab[] = ['Venta', 'Alquiler'];

  return (
    <div className={`flex items-center border-b border-border mb-8 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-6 py-4 text-sm font-sans tracking-wide transition-colors ${
            activeTab === tab ? 'text-gold' : 'text-gray hover:text-foreground'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

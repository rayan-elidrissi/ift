'use client'

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSProvider, useCMS } from '../../context/CMSContext';
import { Edit3, X } from 'lucide-react';

const CMSToggle = () => {
  const { isEditing, toggleEditMode, canEdit } = useCMS();

  if (!canEdit) return null;

  return (
    <button
      onClick={toggleEditMode}
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
        isEditing 
          ? 'bg-neutral-900 text-white hover:bg-red-600 rotate-0' 
          : 'bg-teal-500 text-white hover:bg-teal-600 hover:scale-110'
      }`}
      title={isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
    >
      {isEditing ? <X className="w-6 h-6" /> : <Edit3 className="w-6 h-6" />}
    </button>
  );
};

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
  >
    <svg
      className="w-12 h-12 text-neutral-900 fill-current mb-8"
      viewBox="0 0 32 33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.0811 8.4182L5.83462 0.190918H2.99992L9.67261 13.1182C10.5858 12.4441 10.9873 10.1747 10.0811 8.4182Z" fill="#007F7F" />
      <path d="M15.718 2.23543L13.1494 7.23357C13.1494 7.23357 10.7002 3.40679 11.9444 1.22143C12.9961 -0.412105 14.5318 0.34164 14.7541 0.518363C14.9764 0.694577 15.652 1.06534 15.718 2.23543Z" fill="#007F7F" />
      <path d="M4.56792 32.1182H0.919922V16.5902H4.56792V32.1182Z" />
      <path d="M18.2125 19.4222H12.3325V22.7822H17.9245V25.5662H12.3325V32.1182H8.68448V16.5902H18.2125V19.4222Z" />
      <path d="M31.774 19.4222H27.67V32.1182H23.998V19.4222H19.894V16.5902H31.774V19.4222Z" />
    </svg>
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-teal-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </motion.div>
);

const CMSContent = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isApiConfigured, hasCache } = useCMS();
  const showLoader = isApiConfigured && isLoading && !hasCache;

  return (
    <>
      <AnimatePresence>{showLoader && <LoadingScreen />}</AnimatePresence>
      {children}
      <CMSToggle />
    </>
  );
};

export const CMSWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <CMSProvider>
      <CMSContent>{children}</CMSContent>
    </CMSProvider>
  );
};

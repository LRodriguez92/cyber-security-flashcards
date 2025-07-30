// Animation utilities for enhanced user experience

export const cardFlipAnimation = {
  initial: { rotateY: 0 },
  animate: { rotateY: 180 },
  transition: { duration: 0.6, ease: "easeInOut" }
};

export const buttonPressAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1 }
};

export const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const slideInAnimation = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const scaleInAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.2, ease: "easeOut" }
};

export const bounceAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.1, 1] },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// CSS classes for animations
export const animationClasses = {
  fadeIn: "animate-in fade-in duration-300",
  slideInFromTop: "animate-in slide-in-from-top-2 duration-300",
  slideInFromBottom: "animate-in slide-in-from-bottom-2 duration-300",
  slideInFromLeft: "animate-in slide-in-from-left-2 duration-300",
  slideInFromRight: "animate-in slide-in-from-right-2 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
  ping: "animate-ping"
};

// Haptic feedback utilities (for mobile devices)
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }
};

// Progress bar animation
export const progressBarAnimation = {
  initial: { width: 0 },
  animate: (progress: number) => ({ width: `${progress}%` }),
  transition: { duration: 0.5, ease: "easeOut" }
};

// Toast notification animations
export const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.9 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Card flip animation with 3D transform
export const cardFlip3D = {
  front: {
    transform: 'rotateY(0deg)',
    backfaceVisibility: 'hidden' as const,
  },
  back: {
    transform: 'rotateY(180deg)',
    backfaceVisibility: 'hidden' as const,
  },
  container: {
    transformStyle: 'preserve-3d' as const,
  }
};

// Loading spinner animation
export const loadingSpinnerAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
};

// Success checkmark animation
export const successCheckAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { 
    type: "spring" as const,
    stiffness: 200,
    damping: 15
  }
};

// Error shake animation
export const errorShakeAnimation = {
  animate: { 
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}; 
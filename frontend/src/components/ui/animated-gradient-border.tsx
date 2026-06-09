'use client';

import React, { CSSProperties, ReactNode, HTMLAttributes } from 'react';

type AnimationMode = 'auto-rotate' | 'rotate-on-hover' | 'stop-rotate-on-hover';

interface BorderRotateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
 
  // Animation customization
  animationMode?: AnimationMode;
  animationSpeed?: number; // Duration in seconds
 
  // Color customization
  gradientColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  backgroundColor?: string;
 
  // Border customization
  borderWidth?: number;
  borderRadius?: number;
 
  // Container styling
  style?: CSSProperties;
}

const defaultGradientColors = {
  primary: '#3b82f6', // blue-500
  secondary: '#8b5cf6', // purple-500
  accent: '#ec4899' // pink-500
};

const BorderRotate: React.FC<BorderRotateProps> = ({
  children,
  className = '',
  animationMode = 'auto-rotate',
  animationSpeed = 4,
  gradientColors = defaultGradientColors,
  backgroundColor = 'transparent',
  borderWidth = 1.5,
  borderRadius = 12,
  style = {},
  ...props
}) => {
  // Get animation class based on mode
  const getAnimationClass = () => {
    switch (animationMode) {
      case 'auto-rotate':
        return 'gradient-border-auto';
      case 'rotate-on-hover':
        return 'gradient-border-hover';
      case 'stop-rotate-on-hover':
        return 'gradient-border-stop-hover';
      default:
        return '';
    }
  };
 
  const combinedStyle: CSSProperties = {
    '--gradient-primary': gradientColors.primary,
    '--gradient-secondary': gradientColors.secondary,
    '--gradient-accent': gradientColors.accent,
    '--bg-color': backgroundColor,
    '--border-width': `${borderWidth}px`,
    '--border-radius': `${borderRadius}px`,
    '--animation-duration': `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: `${borderRadius}px`,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle, 0deg),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 37%,
        ${gradientColors.accent} 50%,
        ${gradientColors.secondary} 63%,
        ${gradientColors.primary} 100%
      )
    `,
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    ...style,
  } as CSSProperties;
 
  return (
    <div
      className={`gradient-border-component ${getAnimationClass()} ${className}`}
      style={combinedStyle}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @property --gradient-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes gradient-rotate {
          from {
            --gradient-angle: 0deg;
          }
          to {
            --gradient-angle: 360deg;
          }
        }

        .gradient-border-component {
          position: relative;
        }

        .gradient-border-auto {
          animation: gradient-rotate var(--animation-duration, 4s) linear infinite;
        }

        .gradient-border-hover {
          /* Start un-animated, animate on hover */
        }

        .gradient-border-hover:hover {
          animation: gradient-rotate var(--animation-duration, 4s) linear infinite;
        }

        .gradient-border-stop-hover {
          animation: gradient-rotate var(--animation-duration, 4s) linear infinite;
        }

        .gradient-border-stop-hover:hover {
          animation-play-state: paused;
        }
      `}} />
      {children}
    </div>
  );
};

export { BorderRotate };
export default BorderRotate;

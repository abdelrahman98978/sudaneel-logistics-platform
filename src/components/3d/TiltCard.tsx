'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // max tilt in degrees
  perspective?: number; // perspective depth in px
  glowColor?: string; // spotlight color
  scaleOnHover?: number;
}

export function TiltCard({
  children,
  className = '',
  maxRotation = 12,
  perspective = 1000,
  glowColor = 'rgba(11, 94, 215, 0.15)',
  scaleOnHover = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Invert X for natural tilt feel
    const rotX = -mouseY * maxRotation * 2;
    const rotY = mouseX * maxRotation * 2;

    setRotation({ x: rotX, y: rotY });

    // Glow position percentage
    const glowX = ((e.clientX - rect.left) / width) * 100;
    const glowY = ((e.clientY - rect.top) / height) * 100;
    setGlowPosition({ x: glowX, y: glowY, opacity: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlowPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out will-change-transform ${className}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `perspective(${perspective}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, ${scaleOnHover})`
          : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      }}
    >
      {/* 3D Dynamic Radial Glow Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500 z-10"
        style={{
          opacity: glowPosition.opacity,
          background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Card Content with 3D Depth Layering */}
      <div
        className="w-full h-full relative z-20"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

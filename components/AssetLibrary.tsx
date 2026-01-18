import React from 'react';
import { StickerType } from '../types';

// Extended types for internal frame assets + stickers
export type AssetType = StickerType | 'shark' | 'jellyfish' | 'school';

export const SVG_STRINGS: Record<string, string> = {
  betta: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bettaGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:rgb(244,63,94);stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:rgb(136,19,55);stop-opacity:0" />
        </radialGradient>
        <linearGradient id="bettaBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#be123c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fb7185;stop-opacity:1" />
        </linearGradient>
      </defs>
      <g filter="drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))">
        <path d="M140,80 Q160,50 120,40 Q90,30 60,60 Q30,40 10,70 Q20,110 50,130 Q90,160 130,130 Q180,140 190,100 Z" fill="url(#bettaBody)" />
        <path d="M130,85 Q170,60 180,90 T140,110" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
        <circle cx="150" cy="70" r="15" fill="url(#bettaGlow)" opacity="0.3" />
        <path d="M60,60 Q40,20 80,30" fill="#9f1239" opacity="0.8" />
        <path d="M50,130 Q40,170 80,150" fill="#9f1239" opacity="0.8" />
        <circle cx="50" cy="85" r="4" fill="white" />
        <circle cx="51" cy="85" r="1.5" fill="black" />
      </g>
    </svg>
  `,
  starfish: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
        </radialGradient>
      </defs>
      <g filter="drop-shadow(2px 2px 2px rgb(0 0 0 / 0.3))">
        <path d="M50,5 L63,35 L95,38 L70,58 L78,90 L50,72 L22,90 L30,58 L5,38 L37,35 Z" fill="url(#starGrad)" stroke="#b45309" stroke-width="1" stroke-linejoin="round" />
        <circle cx="50" cy="50" r="2" fill="#fff" opacity="0.6"/>
        <circle cx="50" cy="20" r="1" fill="#fff" opacity="0.5"/>
        <circle cx="75" cy="40" r="1" fill="#fff" opacity="0.5"/>
      </g>
    </svg>
  `,
  shell: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="shellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
           <stop offset="0%" style="stop-color:#fde68a;stop-opacity:1" />
           <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
         </linearGradient>
       </defs>
       <g filter="drop-shadow(2px 2px 1px rgb(0 0 0 / 0.3))">
         <path d="M20,80 Q50,10 80,80 L50,90 Z" fill="url(#shellGrad)" />
         <path d="M20,80 Q35,45 50,90" fill="none" stroke="#92400e" stroke-width="1" />
         <path d="M80,80 Q65,45 50,90" fill="none" stroke="#92400e" stroke-width="1" />
         <path d="M50,90 L50,25" fill="none" stroke="#92400e" stroke-width="1" opacity="0.5" />
       </g>
    </svg>
  `,
  bubble: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <radialGradient id="bubbleGrad" cx="30%" cy="30%" r="70%">
         <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
         <stop offset="80%" style="stop-color:#bae6fd;stop-opacity:0.2" />
         <stop offset="100%" style="stop-color:#0ea5e9;stop-opacity:0.1" />
       </radialGradient>
       <circle cx="50" cy="50" r="40" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
       <path d="M60,25 Q75,30 75,45" fill="none" stroke="white" stroke-width="2" opacity="0.6" stroke-linecap="round" />
    </svg>
  `,
  seaweed: `
    <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="weedGrad" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" style="stop-color:#84cc16;stop-opacity:1" />
           <stop offset="100%" style="stop-color:#14532d;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M50,200 Q20,150 50,120 Q80,90 40,60 Q10,30 50,0 Q80,40 60,80 Q40,120 70,160 Q90,190 50,200 Z" fill="url(#weedGrad)" opacity="0.9" />
    </svg>
  `,
  coral: `
     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coralGrad" x1="0" y1="1" x2="1" y2="0">
           <stop offset="0%" style="stop-color:#fda4af;stop-opacity:1" />
           <stop offset="100%" style="stop-color:#e11d48;stop-opacity:1" />
        </linearGradient>
      </defs>
      <g filter="drop-shadow(2px 2px 2px rgb(0 0 0 / 0.4))">
         <path d="M100,200 C100,200 20,150 50,80 C60,50 30,30 20,50 M100,200 C100,200 180,150 150,80 C140,50 170,30 180,50 M100,200 L100,100 C100,100 80,60 90,30 M100,100 C100,100 120,60 110,30" 
         stroke="url(#coralGrad)" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" />
         <circle cx="50" cy="80" r="5" fill="#ffe4e6" opacity="0.6"/>
         <circle cx="150" cy="80" r="5" fill="#ffe4e6" opacity="0.6"/>
      </g>
    </svg>
  `,
  crab: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.2))">
        <!-- Legs -->
        <path d="M20,60 Q10,50 15,40" stroke="#f87171" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M80,60 Q90,50 85,40" stroke="#f87171" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M25,65 Q10,70 15,80" stroke="#f87171" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M75,65 Q90,70 85,80" stroke="#f87171" stroke-width="5" fill="none" stroke-linecap="round" />
        <!-- Body -->
        <ellipse cx="50" cy="60" rx="30" ry="20" fill="#ef4444" />
        <!-- Eyes -->
        <circle cx="35" cy="45" r="5" fill="white" stroke="#ef4444" stroke-width="2"/>
        <circle cx="35" cy="45" r="2" fill="black"/>
        <circle cx="65" cy="45" r="5" fill="white" stroke="#ef4444" stroke-width="2"/>
        <circle cx="65" cy="45" r="2" fill="black"/>
        <!-- Smile -->
        <path d="M45,65 Q50,68 55,65" fill="none" stroke="#7f1d1d" stroke-width="2" stroke-linecap="round"/>
        <!-- Claws -->
        <path d="M15,40 Q5,30 15,25 Q20,35 15,40" fill="#ef4444" />
        <path d="M85,40 Q95,30 85,25 Q80,35 85,40" fill="#ef4444" />
      </g>
    </svg>
  `,
  octopus: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.2))">
        <!-- Tentacles -->
        <path d="M30,70 Q20,90 35,90" stroke="#d8b4fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M45,70 Q45,95 55,90" stroke="#d8b4fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M60,70 Q70,90 80,80" stroke="#d8b4fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M70,65 Q90,70 90,50" stroke="#d8b4fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M20,65 Q10,70 10,50" stroke="#d8b4fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- Head -->
        <path d="M20,50 Q20,10 50,10 Q80,10 80,50 L80,60 Q80,70 50,70 Q20,70 20,60 Z" fill="#c084fc" />
        <!-- Eyes -->
        <circle cx="35" cy="45" r="4" fill="white" />
        <circle cx="35" cy="45" r="2" fill="black" />
        <circle cx="65" cy="45" r="4" fill="white" />
        <circle cx="65" cy="45" r="2" fill="black" />
        <!-- Blush -->
        <circle cx="28" cy="55" r="3" fill="#f0abfc" opacity="0.6"/>
        <circle cx="72" cy="55" r="3" fill="#f0abfc" opacity="0.6"/>
      </g>
    </svg>
  `,
  bow: `
    <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.2))">
         <path d="M50,30 Q30,0 10,20 Q0,30 10,40 Q30,60 50,30 Z" fill="#f9a8d4" />
         <path d="M50,30 Q70,0 90,20 Q100,30 90,40 Q70,60 50,30 Z" fill="#f9a8d4" />
         <circle cx="50" cy="30" r="8" fill="#f472b6" />
         <path d="M20,25 Q25,25 25,30" fill="none" stroke="#fbcfe8" stroke-width="2" />
         <path d="M80,25 Q75,25 75,30" fill="none" stroke="#fbcfe8" stroke-width="2" />
      </g>
    </svg>
  `,
  sparkles: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#fef08a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
        </radialGradient>
      </defs>
      <path d="M50,10 Q60,40 90,50 Q60,60 50,90 Q40,60 10,50 Q40,40 50,10 Z" fill="#fef08a" />
      <path d="M20,20 Q25,30 35,35 Q25,40 20,50 Q15,40 5,35 Q15,30 20,20 Z" fill="#fef9c3" opacity="0.8" />
      <path d="M80,80 Q82,85 85,87 Q82,89 80,94 Q78,89 75,87 Q78,85 80,80 Z" fill="#fef9c3" opacity="0.8" />
    </svg>
  `,
  heart: `
     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <path d="M50,85 C50,85 10,55 10,30 C10,15 25,5 40,10 C45,12 50,20 50,20 C50,20 55,12 60,10 C75,5 90,15 90,30 C90,55 50,85 50,85 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="2" stroke-linejoin="round"/>
       <path d="M25,20 Q30,15 35,20" fill="none" stroke="white" stroke-width="3" opacity="0.5" stroke-linecap="round"/>
     </svg>
  `,
  jellyfish_cute: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.1))">
        <!-- Tentacles -->
        <path d="M30,60 Q20,80 30,90" stroke="#f0abfc" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M50,60 Q50,85 50,90" stroke="#f0abfc" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M70,60 Q80,80 70,90" stroke="#f0abfc" stroke-width="4" fill="none" stroke-linecap="round"/>
        
        <!-- Head -->
        <path d="M15,60 Q15,10 50,10 Q85,10 85,60 Z" fill="#e879f9" />
        
        <!-- Face -->
        <circle cx="35" cy="45" r="3" fill="black" />
        <circle cx="65" cy="45" r="3" fill="black" />
        <path d="M45,52 Q50,55 55,52" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
        <circle cx="28" cy="50" r="4" fill="#f5d0fe" opacity="0.6"/>
        <circle cx="72" cy="50" r="4" fill="#f5d0fe" opacity="0.6"/>
      </g>
    </svg>
  `,
  star_cute: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.1))">
         <!-- Rounded Star -->
         <path d="M50,5 Q60,35 90,35 Q65,55 75,85 Q50,70 25,85 Q35,55 10,35 Q40,35 50,5 Z" 
               fill="#fef08a" stroke="#fde047" stroke-width="2" stroke-linejoin="round"/>
         <!-- Face -->
         <circle cx="40" cy="45" r="3" fill="black"/>
         <circle cx="60" cy="45" r="3" fill="black"/>
         <path d="M45,55 Q50,60 55,55" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>
  `,
  clam_cute: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.1))">
        <!-- Shell Bottom -->
        <path d="M20,60 Q50,95 80,60" fill="#bae6fd" stroke="#7dd3fc" stroke-width="2"/>
        <!-- Shell Top -->
        <path d="M20,60 Q10,20 50,20 Q90,20 80,60" fill="#bae6fd" stroke="#7dd3fc" stroke-width="2"/>
        <!-- Pearl -->
        <circle cx="50" cy="60" r="12" fill="#fdf2f8" stroke="#fce7f3" stroke-width="1"/>
        <!-- Face on Shell -->
        <circle cx="38" cy="45" r="3" fill="black"/>
        <circle cx="62" cy="45" r="3" fill="black"/>
        <path d="M45,50 Q50,53 55,50" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>
  `,
  seahorse: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.1))">
         <!-- Body -->
         <path d="M40,20 Q30,10 50,10 Q65,10 65,25 Q65,40 55,45 Q45,50 45,60 Q45,75 55,80 Q65,85 60,95 Q50,100 40,90 Q30,80 35,60 Q40,50 50,45" 
           fill="#fdba74" stroke="#fb923c" stroke-width="2" stroke-linecap="round"/>
         <!-- Snout -->
         <path d="M40,20 L30,22" stroke="#fb923c" stroke-width="3" fill="none" stroke-linecap="round"/>
         <!-- Eye -->
         <circle cx="50" cy="20" r="3" fill="black"/>
         <!-- Fin -->
         <path d="M65,35 Q75,35 70,45" fill="#fed7aa" stroke="#fb923c" stroke-width="1"/>
      </g>
    </svg>
  `,
  narwhal: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.1))">
         <!-- Horn -->
         <path d="M30,40 L10,25" stroke="#fcd34d" stroke-width="3" stroke-linecap="round"/>
         <!-- Body -->
         <path d="M30,40 Q25,70 50,70 Q80,70 90,50 Q80,30 50,30 Q35,30 30,40 Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
         <!-- Tail -->
         <path d="M90,50 Q95,40 100,50 Q95,60 90,50" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
         <!-- Eye -->
         <circle cx="45" cy="45" r="3" fill="black"/>
         <circle cx="40" cy="50" r="3" fill="#fecaca" opacity="0.6"/>
      </g>
    </svg>
  `,
  shark: `
    <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sharkGrad" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
           <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M280,75 Q250,70 220,60 Q180,40 140,45 Q150,20 130,10 Q120,40 100,50 Q60,55 20,70 Q40,80 20,90 Q60,100 100,95 Q130,120 160,100 Q190,100 220,90 Q250,85 280,75 Z" 
        fill="url(#sharkGrad)" opacity="0.7" />
      <path d="M140,45 Q130,70 160,75" fill="none" stroke="#475569" stroke-width="2" opacity="0.5"/>
    </svg>
  `,
  jellyfish: `
    <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jellyHead" cx="50%" cy="40%" r="50%">
          <stop offset="0%" style="stop-color:#e879f9;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#a21caf;stop-opacity:0.1" />
        </radialGradient>
      </defs>
      <g opacity="0.8">
        <path d="M10,50 Q50,-20 90,50 Z" fill="url(#jellyHead)" filter="drop-shadow(0 0 5px #e879f9)"/>
        <path d="M20,50 Q10,100 25,140" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M40,50 Q30,110 45,150" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.8"/>
        <path d="M60,50 Q70,110 55,150" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.8"/>
        <path d="M80,50 Q90,100 75,140" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.6"/>
      </g>
    </svg>
  `,
  school: `
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
       <g fill="#fde047" opacity="0.6">
         <path d="M10,20 Q20,15 30,20 Q20,25 10,20 Z" />
         <path d="M40,30 Q50,25 60,30 Q50,35 40,30 Z" />
         <path d="M25,50 Q35,45 45,50 Q35,55 25,50 Z" />
         <path d="M60,10 Q70,5 80,10 Q70,15 60,10 Z" />
       </g>
    </svg>
  `
};

export const getSvgUrl = (type: string) => {
  const svgString = SVG_STRINGS[type];
  if (!svgString) return '';
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

export const StickerAsset: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  if (!SVG_STRINGS[type]) return null;
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: SVG_STRINGS[type] }} />
  );
};
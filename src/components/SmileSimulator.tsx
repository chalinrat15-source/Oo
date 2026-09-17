import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, RefreshCw, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { BRACE_COLORS } from '../data/colorsData';
import { BraceColor } from '../types';

interface SmileSimulatorProps {
  upperColors: string[];
  lowerColors: string[];
  onToothColorChange?: (isUpper: boolean, index: number, colorHex: string) => void;
  bracketType?: 'metal' | 'ceramic' | 'gold';
  bandStyle?: 'oring' | 'chain' | 'flower';
  className?: string;
  isInteractive?: boolean;
}

export const SmileSimulator: React.FC<SmileSimulatorProps> = ({
  upperColors,
  lowerColors,
  onToothColorChange,
  bracketType = 'metal',
  bandStyle = 'oring',
  className = '',
  isInteractive = true,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<{ isUpper: boolean; index: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredTooth, setHoveredTooth] = useState<{ isUpper: boolean; index: number } | null>(null);

  // Upper teeth count: 8 teeth (Left to right: Premolar2, Premolar1, Canine, Lateral, Central, Central, Lateral, Canine, Premolar1, Premolar2)
  // Let's model 8 prominent upper teeth and 8 lower teeth
  const upperTeethData = [
    { id: 'u1', x: 70, y: 78, w: 26, h: 44, rx: 6, label: 'ฟันกรามน้อย' },
    { id: 'u2', x: 104, y: 74, w: 30, h: 50, rx: 7, label: 'ฟันกรามน้อย' },
    { id: 'u3', x: 142, y: 70, w: 34, h: 56, rx: 8, label: 'ฟันเขี้ยว' },
    { id: 'u4', x: 184, y: 68, w: 38, h: 62, rx: 9, label: 'ฟันตัดข้าง' },
    { id: 'u5', x: 230, y: 66, w: 42, h: 68, rx: 9, label: 'ฟันหน้ากลาง (ซ้าย)' },
    { id: 'u6', x: 280, y: 66, w: 42, h: 68, rx: 9, label: 'ฟันหน้ากลาง (ขวา)' },
    { id: 'u7', x: 330, y: 68, w: 38, h: 62, rx: 9, label: 'ฟันตัดข้าง' },
    { id: 'u8', x: 376, y: 70, w: 34, h: 56, rx: 8, label: 'ฟันเขี้ยว' },
    { id: 'u9', x: 418, y: 74, w: 30, h: 50, rx: 7, label: 'ฟันกรามน้อย' },
    { id: 'u10', x: 456, y: 78, w: 26, h: 44, rx: 6, label: 'ฟันกรามน้อย' },
  ];

  const lowerTeethData = [
    { id: 'l1', x: 86, y: 136, w: 24, h: 40, rx: 6, label: 'ฟันกรามน้อยล่าง' },
    { id: 'l2', x: 118, y: 138, w: 28, h: 44, rx: 6, label: 'ฟันกรามน้อยล่าง' },
    { id: 'l3', x: 154, y: 140, w: 30, h: 48, rx: 7, label: 'ฟันเขี้ยวล่าง' },
    { id: 'l4', x: 192, y: 142, w: 32, h: 50, rx: 7, label: 'ฟันตัดข้างล่าง' },
    { id: 'l5', x: 232, y: 144, w: 34, h: 52, rx: 7, label: 'ฟันหน้าล่าง' },
    { id: 'l6', x: 274, y: 144, w: 34, h: 52, rx: 7, label: 'ฟันหน้าล่าง' },
    { id: 'l7', x: 316, y: 142, w: 32, h: 50, rx: 7, label: 'ฟันตัดข้างล่าง' },
    { id: 'l8', x: 356, y: 140, w: 30, h: 48, rx: 7, label: 'ฟันเขี้ยวล่าง' },
    { id: 'l9', x: 394, y: 138, w: 28, h: 44, rx: 6, label: 'ฟันกรามน้อยล่าง' },
    { id: 'l10', x: 430, y: 136, w: 24, h: 40, rx: 6, label: 'ฟันกรามน้อยล่าง' },
  ];

  // Helper for bracket fill
  const getBracketStyle = () => {
    switch (bracketType) {
      case 'ceramic':
        return {
          fill: '#F1F5F9',
          stroke: '#CBD5E1',
          highlight: '#FFFFFF',
          slot: '#94A3B8',
        };
      case 'gold':
        return {
          fill: '#F59E0B',
          stroke: '#D97706',
          highlight: '#FDE68A',
          slot: '#78350F',
        };
      case 'metal':
      default:
        return {
          fill: '#94A3B8',
          stroke: '#64748B',
          highlight: '#E2E8F0',
          slot: '#334155',
        };
    }
  };

  const bracket = getBracketStyle();

  const handleToothClick = (isUpper: boolean, index: number) => {
    if (!isInteractive) return;
    if (selectedTooth?.isUpper === isUpper && selectedTooth?.index === index) {
      setSelectedTooth(null);
    } else {
      setSelectedTooth({ isUpper, index });
    }
  };

  const handleQuickColorPick = (colorHex: string) => {
    if (!selectedTooth || !onToothColorChange) return;
    onToothColorChange(selectedTooth.isUpper, selectedTooth.index, colorHex);
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Simulation Screen Container */}
      <div className="relative w-full max-w-xl aspect-[16/10] bg-gradient-to-b from-rose-50/50 via-white to-pink-50/60 rounded-3xl border border-pink-100 shadow-xl overflow-hidden p-2 sm:p-4 flex items-center justify-center">
        
        {/* Subtle decorative glow & spark background */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-pink-600 border border-pink-100 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>จำลองรอยยิ้มสดใส 3D</span>
        </div>

        {/* Zoom Controls & Help */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-pink-100 shadow-xs z-10">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-1.5 text-slate-500 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
            title="ย่อขนาด"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-medium text-slate-600 px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.15))}
            className="p-1.5 text-slate-500 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
            title="ขยายขนาด"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-pink-600 rounded-full"
              title="รีเซ็ตขนาด"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Main Interactive Cartoon Smile SVG */}
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full h-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 550 250"
            className="w-full h-auto max-h-full drop-shadow-md overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Natural Lip Gradient */}
              <linearGradient id="lipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="45%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>

              {/* Lower Lip Gradient */}
              <linearGradient id="lowerLipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="60%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#FDA4AF" />
              </linearGradient>

              {/* Gum Gradient */}
              <linearGradient id="gumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FDA4AF" />
              </linearGradient>

              {/* Teeth Ivory Highlight Gradient */}
              <linearGradient id="toothGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#FCFBF7" />
                <stop offset="100%" stopColor="#F5F3EB" />
              </linearGradient>

              {/* Archwire Metallic Gradient */}
              <linearGradient id="archwireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="30%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Mouth Cavity Shadow */}
              <radialGradient id="mouthShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3F0E1E" />
                <stop offset="85%" stopColor="#280510" />
                <stop offset="100%" stopColor="#1B020A" />
              </radialGradient>

              {/* Elastic Band Shading Filter */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Rosy Cheek Accents */}
            <circle cx="45" cy="125" r="28" fill="#FDA4AF" opacity="0.35" filter="blur(8px)" />
            <circle cx="505" cy="125" r="28" fill="#FDA4AF" opacity="0.35" filter="blur(8px)" />

            {/* Mouth Cavity Background */}
            <path
              d="M 50,115 C 80,185 180,215 275,215 C 370,215 470,185 500,115 C 460,95 380,80 275,80 C 170,80 90,95 50,115 Z"
              fill="url(#mouthShadow)"
            />

            {/* Upper Gum Arch */}
            <path
              d="M 60,110 C 120,72 200,60 275,60 C 350,60 430,72 490,110 C 470,95 380,75 275,75 C 170,75 80,95 60,110 Z"
              fill="url(#gumGradient)"
            />

            {/* Lower Gum Arch */}
            <path
              d="M 75,145 C 130,195 210,210 275,210 C 340,210 420,195 475,145 C 430,175 350,190 275,190 C 200,190 120,175 75,145 Z"
              fill="url(#gumGradient)"
              opacity="0.8"
            />

            {/* ====== UPPER TEETH ====== */}
            <g id="upper-teeth-group">
              {upperTeethData.map((tooth, idx) => {
                const colorHex = upperColors[idx % upperColors.length] || '#FFB7D5';
                const isSelected = selectedTooth?.isUpper && selectedTooth?.index === idx;
                const isHovered = hoveredTooth?.isUpper && hoveredTooth?.index === idx;

                const bracketX = tooth.x + tooth.w / 2;
                const bracketY = tooth.y + tooth.h / 2 + 2;

                return (
                  <g
                    key={tooth.id}
                    className={isInteractive ? 'cursor-pointer transition-transform duration-150' : ''}
                    onClick={() => handleToothClick(true, idx)}
                    onMouseEnter={() => isInteractive && setHoveredTooth({ isUpper: true, index: idx })}
                    onMouseLeave={() => isInteractive && setHoveredTooth(null)}
                  >
                    {/* Tooth Body with realistic enamel shape */}
                    <rect
                      x={tooth.x}
                      y={tooth.y}
                      width={tooth.w}
                      height={tooth.h}
                      rx={tooth.rx}
                      ry={tooth.rx}
                      fill="url(#toothGradient)"
                      stroke="#E2E8F0"
                      strokeWidth="1.2"
                    />

                    {/* Tooth Gloss Reflection */}
                    <path
                      d={`M ${tooth.x + 3},${tooth.y + 4} Q ${tooth.x + tooth.w / 2},${tooth.y + 1} ${tooth.x + tooth.w - 3},${tooth.y + 4} L ${tooth.x + tooth.w - 5},${tooth.y + 12} Q ${tooth.x + tooth.w / 2},${tooth.y + 6} ${tooth.x + 5},${tooth.y + 12} Z`}
                      fill="#FFFFFF"
                      opacity="0.65"
                    />

                    {/* Selection / Hover Indicator halo */}
                    {(isSelected || isHovered) && (
                      <rect
                        x={tooth.x - 2}
                        y={tooth.y - 2}
                        width={tooth.w + 4}
                        height={tooth.h + 4}
                        rx={tooth.rx + 2}
                        fill="none"
                        stroke={isSelected ? '#EC4899' : '#F472B6'}
                        strokeWidth="2"
                        strokeDasharray={isSelected ? 'none' : '3,3'}
                        className="animate-pulse"
                      />
                    )}

                    {/* LIGATURE ELASTIC BAND (The Color!) */}
                    {bandStyle === 'chain' ? (
                      // Power Chain connected look
                      <ellipse
                        cx={bracketX}
                        cy={bracketY}
                        rx="13"
                        ry="11"
                        fill={colorHex}
                        filter="url(#softGlow)"
                      />
                    ) : bandStyle === 'flower' ? (
                      // Cute 4-Petal Flower Ligature
                      <g filter="url(#softGlow)">
                        <circle cx={bracketX - 6} cy={bracketY - 6} r="4.5" fill={colorHex} />
                        <circle cx={bracketX + 6} cy={bracketY - 6} r="4.5" fill={colorHex} />
                        <circle cx={bracketX - 6} cy={bracketY + 6} r="4.5" fill={colorHex} />
                        <circle cx={bracketX + 6} cy={bracketY + 6} r="4.5" fill={colorHex} />
                        <circle cx={bracketX} cy={bracketY} r="8" fill={colorHex} />
                      </g>
                    ) : (
                      // Standard Orthodontic O-Ring Ligature
                      <g filter="url(#softGlow)">
                        {/* Outer Elastic Ring */}
                        <rect
                          x={bracketX - 10}
                          y={bracketY - 9}
                          width="20"
                          height="18"
                          rx="6"
                          ry="6"
                          fill={colorHex}
                        />
                        {/* Highlight on Rubber Band */}
                        <path
                          d={`M ${bracketX - 7},${bracketY - 6} Q ${bracketX},${bracketY - 8} ${bracketX + 7},${bracketY - 6}`}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                      </g>
                    )}

                    {/* Orthodontic Metal/Ceramic Bracket Body (Sits inside the elastic) */}
                    <g>
                      {/* Center Bracket Wing Structure */}
                      <rect
                        x={bracketX - 6.5}
                        y={bracketY - 6.5}
                        width="13"
                        height="13"
                        rx="2.5"
                        fill={bracket.fill}
                        stroke={bracket.stroke}
                        strokeWidth="1"
                      />
                      {/* Bracket Wing Notches */}
                      <rect x={bracketX - 5} y={bracketY - 6} width="3" height="12" fill={bracket.highlight} opacity="0.5" />
                      <rect x={bracketX + 2} y={bracketY - 6} width="3" height="12" fill={bracket.highlight} opacity="0.5" />
                      {/* Archwire Slot in the center */}
                      <rect x={bracketX - 6} y={bracketY - 1.5} width="12" height="3" fill={bracket.slot} />
                    </g>
                  </g>
                );
              })}
            </g>

            {/* UPPER ARCHWIRE (Continuous metallic wire threading through brackets) */}
            <path
              d="M 68,103 C 145,95 210,91 275,91 C 340,91 405,95 482,103"
              stroke="url(#archwireGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3))"
            />

            {/* ====== LOWER TEETH ====== */}
            <g id="lower-teeth-group">
              {lowerTeethData.map((tooth, idx) => {
                const colorHex = lowerColors[idx % lowerColors.length] || '#87CEEB';
                const isSelected = !selectedTooth?.isUpper && selectedTooth?.index === idx;
                const isHovered = !hoveredTooth?.isUpper && hoveredTooth?.index === idx;

                const bracketX = tooth.x + tooth.w / 2;
                const bracketY = tooth.y + tooth.h / 2 - 2;

                return (
                  <g
                    key={tooth.id}
                    className={isInteractive ? 'cursor-pointer transition-transform duration-150' : ''}
                    onClick={() => handleToothClick(false, idx)}
                    onMouseEnter={() => isInteractive && setHoveredTooth({ isUpper: false, index: idx })}
                    onMouseLeave={() => isInteractive && setHoveredTooth(null)}
                  >
                    {/* Tooth Body */}
                    <rect
                      x={tooth.x}
                      y={tooth.y}
                      width={tooth.w}
                      height={tooth.h}
                      rx={tooth.rx}
                      ry={tooth.rx}
                      fill="url(#toothGradient)"
                      stroke="#E2E8F0"
                      strokeWidth="1.2"
                    />

                    {/* Tooth Gloss */}
                    <path
                      d={`M ${tooth.x + 3},${tooth.y + tooth.h - 4} Q ${tooth.x + tooth.w / 2},${tooth.y + tooth.h - 1} ${tooth.x + tooth.w - 3},${tooth.y + tooth.h - 4} L ${tooth.x + tooth.w - 5},${tooth.y + tooth.h - 10} Q ${tooth.x + tooth.w / 2},${tooth.y + tooth.h - 6} ${tooth.x + 5},${tooth.y + tooth.h - 10} Z`}
                      fill="#FFFFFF"
                      opacity="0.5"
                    />

                    {/* Selection Indicator halo */}
                    {(isSelected || isHovered) && (
                      <rect
                        x={tooth.x - 2}
                        y={tooth.y - 2}
                        width={tooth.w + 4}
                        height={tooth.h + 4}
                        rx={tooth.rx + 2}
                        fill="none"
                        stroke={isSelected ? '#3B82F6' : '#60A5FA'}
                        strokeWidth="2"
                        strokeDasharray={isSelected ? 'none' : '3,3'}
                        className="animate-pulse"
                      />
                    )}

                    {/* LIGATURE ELASTIC BAND */}
                    {bandStyle === 'chain' ? (
                      <ellipse
                        cx={bracketX}
                        cy={bracketY}
                        rx="12"
                        ry="10"
                        fill={colorHex}
                        filter="url(#softGlow)"
                      />
                    ) : bandStyle === 'flower' ? (
                      <g filter="url(#softGlow)">
                        <circle cx={bracketX - 5.5} cy={bracketY - 5.5} r="4" fill={colorHex} />
                        <circle cx={bracketX + 5.5} cy={bracketY - 5.5} r="4" fill={colorHex} />
                        <circle cx={bracketX - 5.5} cy={bracketY + 5.5} r="4" fill={colorHex} />
                        <circle cx={bracketX + 5.5} cy={bracketY + 5.5} r="4" fill={colorHex} />
                        <circle cx={bracketX} cy={bracketY} r="7.5" fill={colorHex} />
                      </g>
                    ) : (
                      <g filter="url(#softGlow)">
                        <rect
                          x={bracketX - 9}
                          y={bracketY - 8}
                          width="18"
                          height="16"
                          rx="5"
                          ry="5"
                          fill={colorHex}
                        />
                        <path
                          d={`M ${bracketX - 6},${bracketY - 5} Q ${bracketX},${bracketY - 7} ${bracketX + 6},${bracketY - 5}`}
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                      </g>
                    )}

                    {/* Bracket Body */}
                    <g>
                      <rect
                        x={bracketX - 6}
                        y={bracketY - 5.5}
                        width="12"
                        height="11"
                        rx="2"
                        fill={bracket.fill}
                        stroke={bracket.stroke}
                        strokeWidth="1"
                      />
                      <rect x={bracketX - 5.5} y={bracketY - 1} width="11" height="2.5" fill={bracket.slot} />
                    </g>
                  </g>
                );
              })}
            </g>

            {/* LOWER ARCHWIRE */}
            <path
              d="M 85,156 C 150,165 210,169 275,169 C 340,169 400,165 465,156"
              stroke="url(#archwireGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3))"
            />

            {/* UPPER LIP (Natural smiling cupid's bow) */}
            <path
              d="M 35,115 C 80,100 160,82 245,86 C 260,86 270,89 275,91 C 280,89 290,86 305,86 C 390,82 470,100 515,115 C 470,88 385,68 295,70 C 285,70 278,72 275,73 C 272,72 265,70 255,70 C 165,68 80,88 35,115 Z"
              fill="url(#lipGradient)"
              filter="drop-shadow(0 2px 4px rgba(225, 29, 72, 0.2))"
            />

            {/* LOWER LIP (Plump, friendly smile outline) */}
            <path
              d="M 35,115 C 85,190 170,225 275,225 C 380,225 465,190 515,115 C 465,178 380,205 275,205 C 170,205 85,178 35,115 Z"
              fill="url(#lowerLipGradient)"
              filter="drop-shadow(0 4px 6px rgba(225, 29, 72, 0.25))"
            />

            {/* Lip Gloss Highlights */}
            <ellipse cx="275" cy="214" rx="55" ry="3" fill="#FFFFFF" opacity="0.45" />
            <path d="M 230,88 Q 245,84 260,86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
            <path d="M 290,86 Q 305,84 320,88" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
          </svg>
        </motion.div>

        {/* Quick tooltip when hovering or selecting tooth */}
        {isInteractive && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-slate-600 border border-pink-100 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            {selectedTooth ? (
              <>
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span>
                  กำลังเลือก {selectedTooth.isUpper ? 'ฟันบน' : 'ฟันล่าง'} ซี่ที่ {selectedTooth.index + 1}
                </span>
                <button
                  onClick={() => setSelectedTooth(null)}
                  className="ml-1 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </>
            ) : hoveredTooth ? (
              <>
                <Eye className="w-3.5 h-3.5 text-pink-500" />
                <span>
                  คลิกเพื่อเปลี่ยนสี {hoveredTooth.isUpper ? 'ฟันบน' : 'ฟันล่าง'} ซี่ที่ {hoveredTooth.index + 1}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>คลิกที่แต่ละซี่ฟันเพื่อแต้มสี หรือใช้ปุ่มสุ่ม/เลือกสีด้านล่าง</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Color Swatch Bar when a tooth is clicked */}
      <AnimatePresence>
        {selectedTooth && isInteractive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-xl mt-3 p-3 bg-white rounded-2xl border border-pink-200 shadow-md flex flex-col gap-2 z-20"
          >
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-medium text-pink-600">
                เลือกสีสำหรับ {selectedTooth.isUpper ? 'ฟันบน' : 'ฟันล่าง'} ซี่ที่ {selectedTooth.index + 1}
              </span>
              <button
                onClick={() => setSelectedTooth(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
              >
                เสร็จสิ้น
              </button>
            </div>

            {/* Quick Palette Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {BRACE_COLORS.slice(0, 15).map((col) => {
                const currentColor = selectedTooth.isUpper
                  ? upperColors[selectedTooth.index % upperColors.length]
                  : lowerColors[selectedTooth.index % lowerColors.length];
                const isCurrent = currentColor.toLowerCase() === col.hex.toLowerCase();

                return (
                  <button
                    key={col.id}
                    onClick={() => handleQuickColorPick(col.hex)}
                    title={`${col.nameTh} (${col.nameEn})`}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative ${
                      isCurrent ? 'border-pink-500 scale-110 shadow-sm ring-2 ring-pink-200' : 'border-white hover:scale-105 shadow-xs'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isCurrent && <Check className="w-4 h-4 text-slate-800 drop-shadow-xs" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-stone-900 uppercase">Before & After Comparison</h3>
        <p className="text-xs text-stone-500">Drag slider to compare</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-stone-300 shadow-lg cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          {/* After Label */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          {/* Before Label */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-stone-300">
            <MoveHorizontal size={20} className="text-stone-600" />
          </div>

          {/* Top Arrow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white shadow-xl"></div>

          {/* Bottom Arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white shadow-xl"></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          {beforeLabel}
        </span>
        <span>→</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          {afterLabel}
        </span>
      </div>
    </div>
  );
}

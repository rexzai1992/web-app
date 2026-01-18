import React, { useState, useRef } from 'react';
import { LayoutType, Sticker, StickerType } from '../types';
import { StickerAsset } from './AssetLibrary';
import { generateComposite } from '../utils/canvasUtils';
import { savePhotoToGallery } from '../utils/storage';
import { Download, Printer, RotateCcw, X, Plus, RotateCw, Palette, Image as ImageIcon, Sliders } from 'lucide-react';

interface Props {
  photos: string[];
  layout: LayoutType;
  onRestart: () => void;
}

const STICKER_TYPES: StickerType[] = [
  'betta', 'starfish', 'shell', 'bubble', 'coral', 'seaweed', 
  'crab', 'octopus', 'bow', 'heart', 'sparkles',
  'jellyfish_cute', 'star_cute', 'clam_cute', 'seahorse', 'narwhal'
];

const FRAME_COLORS = [
  { name: 'Classic White', hex: '#ffffff' },
  { name: 'Cream', hex: '#fffbeb' },
  { name: 'Soft Rose', hex: '#ffe4e6' },
  { name: 'Pale Azure', hex: '#e0f2fe' },
  { name: 'Mint', hex: '#d1fae5' },
  { name: 'Lavender', hex: '#f3e8ff' },
  { name: 'Peach', hex: '#ffedd5' },
  { name: 'Obsidian', hex: '#0f172a' },
];

const PhotoEditor: React.FC<Props> = ({ photos, layout, onRestart }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [frameColor, setFrameColor] = useState<string>('#ffffff');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'paper' | 'stickers'>('stickers');
  
  // Snap state now holds the coordinate value (0-100) or null if not snapped
  const [snapX, setSnapX] = useState<number | null>(null);
  const [snapY, setSnapY] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ 
    id: string; 
    mode: 'move' | 'transform';
    startX: number; 
    startY: number; 
    initialX: number; 
    initialY: number;
    initialScale: number;
    initialRotation: number;
  } | null>(null);

  const activeSticker = stickers.find(s => s.id === activeStickerId);

  const addSticker = (type: StickerType) => {
    const newSticker: Sticker = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 50, // Center
      y: 50,
      scale: 1,
      rotation: 0
    };
    setStickers([...stickers, newSticker]);
    setActiveStickerId(newSticker.id);
  };

  const removeSticker = (id: string, e?: React.MouseEvent | React.PointerEvent) => {
    e?.stopPropagation();
    setStickers(stickers.filter(s => s.id !== id));
    if (activeStickerId === id) setActiveStickerId(null);
  };

  const updateStickerScale = (newScale: number) => {
    if (!activeStickerId) return;
    setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, scale: newScale } : s));
  };

  const handlePointerDown = (e: React.PointerEvent, id: string, mode: 'move' | 'transform') => {
    e.stopPropagation();
    e.preventDefault(); 
    setActiveStickerId(id);
    setActiveTab('stickers'); // Auto-switch tab when interacting with stickers
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;
    draggingRef.current = {
      id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      initialX: sticker.x,
      initialY: sticker.y,
      initialScale: sticker.scale,
      initialRotation: sticker.rotation
    };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !containerRef.current) return;
    e.preventDefault();

    const { id, mode, startX, startY, initialX, initialY } = draggingRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    if (mode === 'move') {
        const deltaXPx = e.clientX - startX;
        const deltaYPx = e.clientY - startY;
        const deltaXPct = (deltaXPx / containerRect.width) * 100;
        const deltaYPct = (deltaYPx / containerRect.height) * 100;

        let nextX = Math.max(0, Math.min(100, initialX + deltaXPct));
        let nextY = Math.max(0, Math.min(100, initialY + deltaYPct));

        const SNAP_THRESHOLD = 3.0;
        const GUIDES = [0, 50, 100];
        
        let snappedX: number | null = null;
        let snappedY: number | null = null;

        // Snap X
        for (const guide of GUIDES) {
            if (Math.abs(nextX - guide) < SNAP_THRESHOLD) {
                nextX = guide;
                snappedX = guide;
                break;
            }
        }

        // Snap Y
        for (const guide of GUIDES) {
            if (Math.abs(nextY - guide) < SNAP_THRESHOLD) {
                nextY = guide;
                snappedY = guide;
                break;
            }
        }

        setSnapX(snappedX);
        setSnapY(snappedY);
        setStickers(prev => prev.map(s => s.id === id ? { ...s, x: nextX, y: nextY } : s));

    } else if (mode === 'transform') {
        const sticker = stickers.find(s => s.id === id);
        if (!sticker) return;
        const centerX = containerRect.left + (initialX / 100) * containerRect.width;
        const centerY = containerRect.top + (initialY / 100) * containerRect.height;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);
        const rotation = angleDeg - 45;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const baseRadius = (containerRect.width * 0.125) / 1.414; 
        const newScale = Math.max(0.2, distance / baseRadius);

        setStickers(prev => prev.map(s => s.id === id ? { ...s, rotation: rotation, scale: newScale } : s));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
        (e.target as Element).releasePointerCapture(e.pointerId);
        draggingRef.current = null;
        setSnapX(null);
        setSnapY(null);
    }
  };

  const handleExport = async (action: 'download' | 'print') => {
    setIsExporting(true);
    try {
      const dataUrl = await generateComposite(layout, photos, stickers, frameColor);
      
      // Save asynchronously to IndexedDB
      await savePhotoToGallery(dataUrl);

      if (action === 'download') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `deep-blue-memory-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (action === 'print') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            // DNP DS-RX1 Optimized Printing Logic
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Deep Blue Print</title>
                    <style>
                        /* Zero out all default browser margins */
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                        }
                        
                        /* @page rule to remove headers/footers and set size */
                        @page {
                            size: 4in 6in;
                            margin: 0 !important;
                        }

                        html, body {
                            width: 100%;
                            height: 100%;
                            background-color: white;
                            overflow: hidden;
                        }

                        /* Ensure image fills the viewport exactly */
                        img {
                            display: block;
                            width: 100vw;
                            height: 100vh;
                            object-fit: cover;
                        }
                    </style>
                </head>
                <body>
                    <img src="${dataUrl}" />
                    <script>
                        window.onload = function() {
                            // Slight delay to ensure render before print dialog
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating your masterpiece.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-row h-[100dvh] w-full relative z-20 overflow-hidden bg-slate-950">
      
      {/* 1. Canvas Preview Area (Left side, takes remaining width) */}
      <div 
        className="flex-1 h-full relative overflow-hidden bg-slate-900 flex items-center justify-center p-4 lg:p-8"
        onPointerDown={() => setActiveStickerId(null)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)' }}>
        </div>
        
        {/* The Scalable Canvas Container */}
        <div 
          ref={containerRef}
          className="relative shrink-0 transition-all group border-4 border-slate-800 shadow-2xl touch-none"
          style={{ 
             // We use a CSS trick to keep aspect ratio while fitting in parent
             height: 'auto',
             width: 'auto',
             maxHeight: '100%', 
             maxWidth: '100%',
             aspectRatio: '2/3', 
             background: frameColor,
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        > 
           {/* Aspect Ratio Enforcer: Invisible SVG matches the 2/3 aspect ratio to prevent collapse */}
           <svg 
              viewBox="0 0 200 300" 
              className="w-full h-full opacity-0 pointer-events-none block" 
              style={{ maxHeight: '100%', maxWidth: '100%' }}
           />

           {/* ================= Photos Layer ================= */}
           <div className="absolute inset-0 p-4 flex flex-col items-center z-10 select-none">
              {layout === 'postcard' && (
                <div className="w-full h-full flex flex-col gap-2 items-center justify-start py-6 px-2">
                  {photos.map((src, i) => (
                    <div key={i} className="bg-transparent shadow-md w-full flex-1 relative overflow-hidden">
                        <img src={src} alt={`Capture ${i}`} className="w-full h-full object-cover block pointer-events-none" />
                    </div>
                  ))}
                  <div className="h-4 md:h-6 w-full"></div>
                </div>
              )}
              
              {layout === 'strips' && (
                <div className="w-full h-full flex gap-0 justify-center px-0 py-0 items-center">
                  {[0, 1].map(stripIdx => (
                    <div key={stripIdx} className="flex-1 h-full flex flex-col py-[1.5%] px-[3.3%] gap-[1%]" style={{ backgroundColor: frameColor }}>
                      {photos.map((src, i) => (
                         <div key={`${stripIdx}-${i}`} className="w-full relative overflow-hidden pointer-events-none" style={{ aspectRatio: '4/3' }}>
                             <img src={src} className="absolute inset-0 w-full h-full object-cover" alt="strip" />
                         </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* ================= Stickers Layer ================= */}
           {stickers.map(sticker => (
             <div
               key={sticker.id}
               style={{
                 position: 'absolute',
                 left: `${sticker.x}%`,
                 top: `${sticker.y}%`,
                 width: `${12.5 * sticker.scale}%`, 
                 height: 'auto',
                 transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                 cursor: activeStickerId === sticker.id ? 'move' : 'grab',
                 touchAction: 'none'
               }}
               className={`group transition-all duration-75 ${activeStickerId === sticker.id ? 'z-50' : 'z-40'}`}
             >
                <div 
                    onPointerDown={(e) => handlePointerDown(e, sticker.id, 'move')}
                    className={`relative transition-all duration-200 rounded-lg ${
                        activeStickerId === sticker.id 
                        ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-transparent shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-white/5' 
                        : 'hover:ring-1 hover:ring-white/30'
                    }`}>
                    <StickerAsset type={sticker.type} className="w-full h-full drop-shadow-lg select-none pointer-events-none" />
                    
                    {activeStickerId === sticker.id && (
                        <>
                            <button
                                onPointerDown={(e) => removeSticker(sticker.id, e)}
                                className="absolute -top-8 -right-8 bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 transition-colors z-50 transform hover:scale-110 active:scale-90"
                            >
                                <X size={16} />
                            </button>
                            <div
                                onPointerDown={(e) => handlePointerDown(e, sticker.id, 'transform')}
                                className="absolute -bottom-8 -right-8 bg-amber-400 text-slate-900 rounded-full p-3 shadow-lg hover:bg-amber-300 transition-colors z-50 cursor-nwse-resize transform hover:scale-110 active:scale-90"
                            >
                                <RotateCw size={16} />
                            </div>
                        </>
                    )}
                </div>
             </div>
           ))}

           {/* Snap Guides */}
           {snapX !== null && (
               <div 
                  className="absolute top-0 bottom-0 w-px bg-amber-400 z-50 opacity-80 shadow-[0_0_8px_rgba(251,191,36,0.8)]" 
                  style={{ left: `${snapX}%` }} 
               />
           )}
           {snapY !== null && (
               <div 
                  className="absolute left-0 right-0 h-px bg-amber-400 z-50 opacity-80 shadow-[0_0_8px_rgba(251,191,36,0.8)]" 
                  style={{ top: `${snapY}%` }} 
               />
           )}
        </div>
      </div>

      {/* 2. Tools Panel (Right side sidebar) */}
      <div className="w-72 md:w-80 h-full flex-shrink-0 bg-slate-950 border-l border-white/5 flex flex-col p-4 md:p-6 z-30 overflow-hidden">
        {/* Retouching Header & Tabs */}
        <div className="shrink-0 mb-4 sticky top-0 bg-slate-950 z-10">
            <h2 className="text-xl md:text-2xl font-serif text-amber-100 mb-4">Retouching</h2>
            
            <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('stickers')}
                  className={`flex-1 py-3 text-center text-xs md:text-sm uppercase tracking-widest font-serif transition-all flex items-center justify-center gap-2 ${activeTab === 'stickers' ? 'text-amber-200 border-b-2 border-amber-200 bg-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  <ImageIcon size={14} /> Embellish
                </button>
                <button 
                  onClick={() => setActiveTab('paper')}
                  className={`flex-1 py-3 text-center text-xs md:text-sm uppercase tracking-widest font-serif transition-all flex items-center justify-center gap-2 ${activeTab === 'paper' ? 'text-amber-200 border-b-2 border-amber-200 bg-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                >
                  <Palette size={14} /> Paper
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
            {activeTab === 'stickers' && (
              <div className="animate-fade-in space-y-4">
                  {/* Sticker Size Slider (Visible only when sticker selected) */}
                  {activeSticker ? (
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-amber-200/20">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs uppercase tracking-widest text-amber-100 flex items-center gap-2">
                          <Sliders size={12} /> Size
                        </label>
                        <span className="text-xs text-amber-200 font-mono">{(activeSticker.scale * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="2.5" 
                        step="0.05"
                        value={activeSticker.scale}
                        onChange={(e) => updateStickerScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-600 text-xs italic border border-white/5 rounded">
                       Tap a sticker on canvas to edit size
                    </div>
                  )}

                  {/* Sticker Grid - Changed to 3 cols for sidebar fit */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {STICKER_TYPES.map(type => (
                      <button
                          key={type}
                          onClick={() => addSticker(type)}
                          className="aspect-square bg-slate-900 rounded border border-white/5 hover:border-amber-200/40 hover:bg-slate-800 transition-all p-1 md:p-2 flex items-center justify-center relative group active:scale-95"
                      >
                          <StickerAsset type={type} className="w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </button>
                      ))}
                  </div>
              </div>
            )}

            {activeTab === 'paper' && (
              <div className="animate-fade-in pt-2">
                  <div className="flex flex-wrap gap-4 justify-center">
                      {FRAME_COLORS.map(color => (
                      <button
                          key={color.name}
                          onClick={() => setFrameColor(color.hex)}
                          className={`w-16 h-16 rounded-full border border-white/10 transition-all transform hover:scale-110 active:scale-95 shadow-lg ${frameColor === color.hex ? 'ring-4 ring-amber-200 ring-offset-4 ring-offset-slate-950 scale-110' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                      />
                      ))}
                  </div>
                  <p className="text-center text-slate-500 mt-6 text-sm font-serif italic">Select a paper stock for your print.</p>
              </div>
            )}
        </div>

        {/* Actions - Fixed at bottom of tools panel, side-by-side layout */}
        <div className="pt-4 border-t border-white/5 bg-slate-950 mt-2">
           <div className="flex gap-2 mb-2">
              <button 
                onClick={() => handleExport('download')}
                disabled={isExporting}
                className="flex-1 bg-amber-200 text-slate-900 py-3 rounded font-serif font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(253,230,138,0.3)] transition-all disabled:opacity-50 text-sm active:scale-[0.98]"
              >
                {isExporting ? '...' : <><Download size={16} /> Save</>}
              </button>
              
              <button 
                onClick={() => handleExport('print')}
                disabled={isExporting}
                className="flex-1 bg-transparent border border-amber-200/30 text-amber-100 py-3 rounded font-serif flex items-center justify-center gap-2 hover:bg-amber-200/5 transition-colors disabled:opacity-50 text-sm active:scale-[0.98]"
              >
                <Printer size={16} /> Print
              </button>
           </div>

           <button 
             onClick={onRestart}
             className="w-full text-slate-500 py-2 text-xs uppercase tracking-widest hover:text-red-400 transition-colors"
           >
             Start Over
           </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
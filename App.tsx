import React, { useState, useRef } from 'react';
import { AppState, LayoutType } from './types';
import LayoutSelection from './components/LayoutSelection';
import CameraCapture from './components/CameraCapture';
import PhotoEditor from './components/PhotoEditor';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'home',
    layout: 'postcard',
    photos: [],
    stickers: []
  });

  // Triple Tap State
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  const handleLayoutSelect = (layout: LayoutType) => {
    setState(prev => ({ ...prev, layout, step: 'capture' }));
  };

  const handleCaptureComplete = (photos: string[]) => {
    setState(prev => ({ ...prev, photos, step: 'editor' }));
  };

  const handleRestart = () => {
    setState({
      step: 'home',
      layout: 'postcard',
      photos: [],
      stickers: []
    });
  };

  const handleAdminEnter = () => {
    setState(prev => ({ ...prev, step: 'admin' }));
  };

  // Background Bubbles Renderer (Subtle)
  const renderBubbles = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div 
        key={i} 
        className="bubble opacity-5" 
        style={{
          left: `${Math.random() * 100}%`,
          width: `${10 + Math.random() * 20}px`,
          height: `${10 + Math.random() * 20}px`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 20}s`
        }} 
      />
    ));
  };

  const handleCornerClick = () => {
    const now = Date.now();
    const timeSinceLast = now - lastTapRef.current;
    
    // Reset if too slow (more than 400ms between taps)
    if (timeSinceLast > 400) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    
    lastTapRef.current = now;

    // Check if it's the 3rd tap (since we incremented to 1 or higher)
    // Note: setTapCount is async, so we check logic carefully or use ref for instant check
    // Actually, simple logic:
    // T1: count=1
    // T2 (<400ms): count=2
    // T3 (<400ms): count=3 -> Trigger
    
    // Since state update is pending, we can't read `tapCount` immediately reliably for the 3rd tap logic inside the same event loop easily without refs.
    // Let's rely on the tapCount check in the next render or use a simpler ref based logic.
  };

  // Improved Tap Logic using only Refs for immediate action
  const handleCornerTapRef = useRef(0);
  const handleCornerClickInstant = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      handleCornerTapRef.current += 1;
    } else {
      handleCornerTapRef.current = 1;
    }
    lastTapRef.current = now;

    if (handleCornerTapRef.current === 3) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen blocked', e));
      } else {
        document.exitFullscreen().catch(e => console.log('Exit fullscreen error', e));
      }
      handleCornerTapRef.current = 0; // Reset
    }
  };

  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden bg-slate-950">
      
      {/* Triple Tap Trigger Zone (Top Right) */}
      <div 
        className="fixed top-0 right-0 w-20 h-20 z-[100] cursor-default active:bg-white/5 transition-colors"
        onClick={handleCornerClickInstant}
      />

      {state.step !== 'admin' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {/* Classic Light Rays */}
          <div className="absolute -top-40 left-1/4 w-1/2 h-[150%] bg-gradient-to-b from-blue-900/10 to-transparent transform -skew-x-12 blur-3xl rounded-full" />
          {renderBubbles()}
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 w-full h-full">
        {state.step === 'home' && (
          <LayoutSelection onSelect={handleLayoutSelect} onAdmin={handleAdminEnter} />
        )}
        
        {state.step === 'capture' && (
          <CameraCapture 
            layout={state.layout} 
            onComplete={handleCaptureComplete} 
          />
        )}
        
        {state.step === 'editor' && (
          <PhotoEditor 
            photos={state.photos} 
            layout={state.layout}
            onRestart={handleRestart} 
          />
        )}

        {state.step === 'admin' && (
          <AdminDashboard onBack={handleRestart} />
        )}
      </main>
    </div>
  );
};

export default App;
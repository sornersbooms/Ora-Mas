import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RefreshCw, Volume2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioLayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'playing'
  const [isExpanded, setIsExpanded] = useState(false); // Por defecto minimalista
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.8;
    audio.src = '/sounds/atmosfera.mp3';
    
    audio.onplaying = () => { setStatus('playing'); setIsPlaying(true); };
    audio.onpause = () => { setStatus('idle'); setIsPlaying(false); };
    audio.onwaiting = () => setStatus('loading');
    audio.onerror = () => {
      console.warn("Archivo 'atmosfera.mp3' no encontrado en public/sounds/");
      setStatus('idle');
    };

    return () => audio.pause();
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      setStatus('loading');
      audio.play().catch(e => {
        console.warn("Reproducción bloqueada por el navegador. Interactúa con la página.");
        setStatus('idle');
      });
    }
  };

  return (
    <div className="audio-layer" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999 }}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // BOTÓN FLOTANTE (FAB)
          <motion.button
            key="fab"
            onClick={() => setIsExpanded(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: isPlaying ? 'var(--accent-main)' : 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isPlaying ? '0 0 20px rgba(205, 127, 50, 0.4)' : 'none',
              cursor: 'pointer', color: isPlaying ? '#000' : '#fff',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isPlaying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                <Music size={24} />
              </motion.div>
            ) : (
              <Music size={24} />
            )}
          </motion.button>
        ) : (
          // PANEL EXPANDIDO
          <motion.div 
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="audio-panel glass"
            style={{ 
              padding: '1.5rem', 
              width: '280px',
              background: 'rgba(15, 12, 41, 0.98)',
              border: '2px solid var(--accent-main)',
              borderRadius: '28px',
              boxShadow: '0 15px 50px rgba(0,0,0,0.8)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsExpanded(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={20} color="#000" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', display: 'block', color: '#fff' }}>ATMÓSFERA</span>
                <span style={{ fontSize: '0.6rem', color: '#64748b' }}>Paz en el espíritu</span>
              </div>
            </div>

            <button 
              onClick={toggle}
              className="btn-play-audio"
              style={{
                width: '100%', padding: '1.2rem',
                background: isPlaying ? 'rgba(255,255,255,0.05)' : 'var(--accent-main)',
                color: isPlaying ? '#fff' : '#000',
                border: isPlaying ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderRadius: '20px', fontWeight: '900', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
              }}
            >
              {status === 'loading' ? (
                <RefreshCw className="spin" size={24} />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
              <span>{status === 'loading' ? 'CARGANDO...' : isPlaying ? 'ESTÁ SONANDO' : 'INICIAR ATMÓSFERA'}</span>
            </button>

            <p style={{ fontSize: '0.55rem', color: '#475569', marginTop: '1.2rem', textAlign: 'center' }}>
              * 'atmosfera.mp3' detectado en tu librería local
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1.5s linear infinite; }
        .audio-panel { backdrop-filter: blur(20px); }
        .btn-play-audio:hover { transform: scale(1.02); }
        .btn-play-audio:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default AudioLayer;

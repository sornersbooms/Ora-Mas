import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RefreshCw, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioLayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'playing'
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.8;
    audio.src = '/sounds/atmosfera.mp3'; // Buscamos específicamente este archivo
    
    audio.onplaying = () => { setStatus('playing'); setIsPlaying(true); };
    audio.onpause = () => { setStatus('idle'); setIsPlaying(false); };
    audio.onwaiting = () => setStatus('loading');
    audio.onerror = () => {
      console.warn("Archivo 'atmosfera.mp3' no encontrado en public/sounds/");
      setStatus('idle');
    };

    return () => audio.pause();
  }, []);

  const toggle = () => {
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
    <div className="audio-layer" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="audio-panel glass"
          style={{ 
            padding: '1.2rem', 
            width: '240px',
            background: 'rgba(15, 12, 41, 0.95)',
            border: '2px solid var(--accent-main)',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <Music size={18} color="var(--accent-main)" />
            <span style={{ fontSize: '0.7rem', fontWeight: '900', color: '#fff', letterSpacing: '0.2em' }}>ATMÓSFERA</span>
          </div>

          <button 
            onClick={toggle}
            style={{
              padding: '1.2rem',
              background: isPlaying ? 'rgba(255,255,255,0.05)' : 'var(--accent-main)',
              color: isPlaying ? '#fff' : '#000',
              border: isPlaying ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderRadius: '20px',
              fontWeight: '900',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              transition: 'all 0.3s'
            }}
          >
            {status === 'loading' ? (
              <RefreshCw className="spin" size={24} />
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
            <span>{status === 'loading' ? 'CARGANDO...' : isPlaying ? 'ACTIVADA' : 'INICIAR PAZ'}</span>
          </button>

          <p style={{ fontSize: '0.6rem', color: '#64748b', marginTop: '1.2rem' }}>
            * Usando archivo local 'atmosfera.mp3'
          </p>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1.5s linear infinite; }
        .audio-panel { backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
};

export default AudioLayer;

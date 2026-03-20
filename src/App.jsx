import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Quote, MessageSquare, Target, Sparkles, AlertTriangle, PenLine, X, Heart, Sword, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getRandomContent, getPanicContent } from './utils/contentFetcher';
import AudioLayer from './components/AudioLayer';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({
    type: 'FRASE',
    text: 'En la quietud de Su presencia encontrarás las respuestas que buscas. Empieza hoy.'
  });
  const [notifyTrigger, setNotifyTrigger] = useState(0);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isWarfareMode, setIsWarfareMode] = useState(false);
  
  const [petitions, setPetitions] = useState(() => {
    const saved = localStorage.getItem('orar_mas_petitions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showPetitionsEditor, setShowPetitionsEditor] = useState(false);
  const [inputText, setInputText] = useState(petitions.join(', '));

  const TOTAL_GOAL = 3600;
  const INTERACTION_INTERVAL = 120;

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (seconds > 0 && seconds % INTERACTION_INTERVAL === 0) {
      const newContent = getRandomContent(petitions, isWarfareMode);
      setCurrentMessage(newContent);
      setNotifyTrigger(prev => prev + 1);
      setIsPanicMode(false);
      
      if (seconds % 600 === 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: isWarfareMode ? ['#ff0000', '#000000', '#ffd700'] : ['#a879af', '#ff4b2b', '#ffffff']
        });
      }
    }
    
    if (seconds >= TOTAL_GOAL) {
      setIsActive(false);
      setCurrentMessage({
        type: 'CELEBRACIÓN',
        text: '¡Felicidades! Has completado una hora de victoria espiritual.'
      });
      confetti({ particleCount: 500, spread: 180, origin: { y: 0.5 } });
    }
  }, [seconds]);

  const savePetitions = () => {
    const list = inputText.split(',').map(p => p.trim()).filter(p => p.length > 0);
    setPetitions(list);
    localStorage.setItem('orar_mas_petitions', JSON.stringify(list));
    setShowPetitionsEditor(false);
  };

  const handlePanic = () => {
    setCurrentMessage(getPanicContent());
    setIsPanicMode(true);
    setNotifyTrigger(prev => prev + 1);
  };

  const toggleWarfare = () => {
    const newMode = !isWarfareMode;
    setIsWarfareMode(newMode);
    if (newMode) {
      setCurrentMessage({
        type: 'GUERRA ESPIRITUAL',
        text: 'MODO GUERRA ACTIVADO: Toma tu espada, es hora de retomar territorio.'
      });
    } else {
      setCurrentMessage({
        type: 'FRASE',
        text: 'Regresando a Su paz. Quédate en Su presencia.'
      });
    }
    setNotifyTrigger(prev => prev + 1);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hours > 0 ? hours + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / TOTAL_GOAL);

  const getIcon = (type) => {
    switch (type) {
      case 'PREGUNTA': return <MessageSquare size={28} style={{ color: '#cd7f32' }} />;
      case 'ORACIÓN': return <Target size={28} style={{ color: '#cd7f32' }} />;
      case 'CELEBRACIÓN': return <Sparkles size={28} style={{ color: '#00ff88' }} />;
      case 'S.O.S ESPIRITUAL': return <AlertTriangle size={28} style={{ color: '#ff4b2b' }} />;
      case 'PETICIÓN PERSONAL': return <Heart size={28} style={{ color: '#ff4b2b' }} />;
      case 'GUERRA ESPIRITUAL': return <Sword size={28} style={{ color: '#ff0000' }} />;
      default: return <Quote size={28} style={{ color: '#cd7f32' }} />;
    }
  };

  return (
    <div className={`app-container ${isWarfareMode ? 'warfare-active' : ''}`}>
      <div className={`nebula-bg ${isWarfareMode ? 'warfare-bg' : ''}`} />
      
      <header className="header">
        <h1 className="logo" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()}>OrarMas+</h1>
        <p className="subtitle">{isWarfareMode ? 'BAJO LA ARMADURA DEL REY' : 'PERSISTE EN SU PRESENCIA'}</p>
      </header>

      <main className="content" style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div className="timer-section">
          <div className="timer-ring-container">
            <svg width="320" height="320" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <motion.circle
                cx="50" cy="50" r="48" fill="none" stroke="url(#gradient)" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ 
                  rotate: "-90deg", transformOrigin: "50% 50%", 
                  filter: isWarfareMode ? "drop-shadow(0 0 15px rgba(255, 0, 0, 0.8))" : (isPanicMode ? "drop-shadow(0 0 15px rgba(255, 75, 43, 0.8))" : "drop-shadow(0 0 8px rgba(205, 127, 50, 0.4))")
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isWarfareMode ? "#ff0000" : (isPanicMode ? "#ff4b2b" : "#cd7f32")} />
                  <stop offset="100%" stopColor={isWarfareMode ? "#000" : "#ff4b2b"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="timer-display">
              <span className="time">{formatTime(seconds)}</span>
              <span className="time-label">{isWarfareMode ? 'EN COMBATE' : (isPanicMode ? 'RESISTE' : 'HIERBA SANTA')}</span>
            </div>
          </div>

          <div className="controls">
            <button className={`btn-primary ${isActive ? 'active' : ''} ${isWarfareMode ? 'warfare-btn' : ''}`} onClick={() => setIsActive(!isActive)}>
              {isActive ? <Pause size={24} /> : (isWarfareMode ? <Sword size={24} /> : <Play size={24} />)}
              <span>{isActive ? 'PAUSAR' : (isWarfareMode ? 'GUERRA ESPIRITUAL' : 'EMPEZAR ORACIÓN')}</span>
            </button>
            <button className="btn-secondary" onClick={() => { setSeconds(0); setIsActive(false); setIsPanicMode(false); }}>
              <RotateCcw size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className={`sos-btn ${isPanicMode ? 'panic-glow' : ''}`} onClick={handlePanic} title="Pánico Espiritual">
              <AlertTriangle size={18} />
            </button>
            <button className={`warfare-toggle-btn ${isWarfareMode ? 'active' : ''}`} onClick={toggleWarfare} title="Modo Guerra">
              <Sword size={18} />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{isWarfareMode ? 'GUERRA ON' : 'GUERRA'}</span>
            </button>
            <button className="petitions-btn glass" onClick={() => setShowPetitionsEditor(true)}>
              <PenLine size={18} />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>CARGAS ({petitions.length})</span>
            </button>
          </div>
        </div>

        <div className="message-section">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className={`message-card glass ${isWarfareMode ? 'card-warfare' : ''} ${isPanicMode ? 'panic-active' : ''}`}
            >
              <div className="card-header">
                {getIcon(currentMessage.type)}
                <span className="msg-type" style={{ color: isWarfareMode ? '#ff0000' : '' }}>{currentMessage.type}</span>
              </div>
              <p className="msg-text">{currentMessage.text}</p>
              <div className="progress-mini">
                <div className="progress-inner" style={{ 
                  width: `${(seconds % INTERACTION_INTERVAL / INTERACTION_INTERVAL) * 100}%`,
                  background: isWarfareMode ? '#ff0000' : '' 
                }}></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AudioLayer onNotifyTriggered={notifyTrigger} />
      </main>

      {/* EDITOR DE PETICIONES */}
      <AnimatePresence>
        {showPetitionsEditor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="editor-overlay">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="glass editor-modal">
              <button onClick={() => setShowPetitionsEditor(false)} className="close-btn"><X size={24} /></button>
              <h2>LISTA DE PETICIONES</h2>
              <p>Escribe tus temas de oración HOY (separados por comas).</p>
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Salud, familia, finanzas..." />
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={savePetitions}>GUARDAR</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <p>{isWarfareMode ? 'JEHOVÁ DE LOS EJÉRCITOS • VICTORIA' : 'PERSISTENCIA • FE • ESPERANZA'}</p>
      </footer>

      <style jsx>{`
        .app-container { transition: all 1s ease; }
        .warfare-bg { background: radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.15), transparent 70%), #050000 !important; }
        .warfare-btn { background: #ff0000 !important; color: #fff !important; box-shadow: 0 0 30px rgba(255, 0, 0, 0.4) !important; }
        .warfare-active .logo { background: linear-gradient(to right, #ff0000, #ffd700) !important; -webkit-background-clip: text !important; }
        .card-warfare { border: 1px solid rgba(255, 0, 0, 0.3) !important; box-shadow: 0 0 30px rgba(255, 0, 0, 0.1) !important; }
        
        .warfare-toggle-btn {
          border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
          padding: 0.8rem 1.4rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;
          background: rgba(255,255,255,0.03); color: #fff; transition: all 0.3s;
        }
        .warfare-toggle-btn.active { background: #ff0000; border-color: #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.3); }
        
        .sos-btn, .petitions-btn {
          border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
          padding: 0.8rem 1.4rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem;
          background: rgba(255,255,255,0.03); color: #fff; transition: all 0.3s;
        }
        
        .editor-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .editor-modal { width: 100%; maxWidth: 500px; padding: 2rem; position: relative; }
        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #64748b; cursor: pointer; }
        textarea { width: 100%; height: 150px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 1.2rem; color: #fff; font-size: 1rem; outline: none; font-family: inherit; resize: none; }
        
        @keyframes pulse-red { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .warfare-active .timer-ring-container { animation: pulse-red 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;

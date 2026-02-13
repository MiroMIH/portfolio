import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRIGGER_WORD = 'java';

const EasterEgg = () => {
  const [typed, setTyped] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showNPE, setShowNPE] = useState(false);
  const [npePos, setNpePos] = useState({ x: 0, y: 0 });

  // Listen for "java" typed anywhere on the page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      setTyped((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-TRIGGER_WORD.length);
        if (next === TRIGGER_WORD) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 7000);
          return '';
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // NullPointerException on double-click empty space
  useEffect(() => {
    const handleDblClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (['a', 'button', 'input', 'textarea', 'svg', 'path', 'img'].includes(tag)) return;
      if (e.target.closest('a, button, input, textarea, form')) return;

      setNpePos({ x: e.clientX, y: e.clientY });
      setShowNPE(true);
      setTimeout(() => setShowNPE(false), 3500);
    };

    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, []);

  return (
    <>
      {/* System.out.println toast + stack trace */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="ee-toast"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">java.exe — output</span>
            </div>
            <div className="ee-toast-body">
              {/* SOP line */}
              <div className="ee-sop-line">
                <span className="ee-kw">System</span>
                <span className="ee-dot">.</span>
                <span className="ee-prop">out</span>
                <span className="ee-dot">.</span>
                <span className="ee-method">println</span>
                <span className="ee-paren">(</span>
                <span className="ee-string">"Hello World!"</span>
                <span className="ee-paren">)</span>
                <span className="ee-semi">;</span>
              </div>

              {/* Output */}
              <div className="ee-output">
                <span className="ee-output-prompt">&gt;</span> Hello World!
              </div>

              <div className="ee-divider" />

              {/* Stack trace */}
              <div className="ee-stack">
                <div className="ee-stack-header">
                  <span>Easter egg found!</span>
                </div>
                <div className="ee-stack-trace">
                  <span>at com.amir.Portfolio.main(Portfolio.java:1)</span>
                  <span>at com.amir.skills.JavaMaster.flex(JavaMaster.java:42)</span>
                  <span>at com.amir.easter.SecretHandler.reveal(SecretHandler.java:7)</span>
                  <span>at java.base/java.lang.Thread.run(Thread.java:833)</span>
                </div>
              </div>

              <div className="ee-hint">
                You typed "java" — a developer of culture, I see.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NullPointerException popup */}
      <AnimatePresence>
        {showNPE && (
          <motion.div
            className="ee-npe"
            style={{ left: npePos.x, top: npePos.y }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="ee-npe-exception">java.lang.NullPointerException</span>
            <span className="ee-npe-trace">at com.amir.Portfolio.findElement(Portfolio.java:404)</span>
            <span className="ee-npe-trace">at com.amir.ui.ClickHandler.resolve(ClickHandler.java:12)</span>
            <span className="ee-npe-hint">{'// nothing here — try the actual content ;)'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Konami code sequence
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Multilingual greetings
const GREETINGS = {
  hello: { lang: 'English', response: 'Hello World!' },
  bonjour: { lang: 'French', response: 'Bonjour le Monde!' },
  hola: { lang: 'Spanish', response: 'Hola Mundo!' },
  hallo: { lang: 'German', response: 'Hallo Welt!' },
  ciao: { lang: 'Italian', response: 'Ciao Mondo!' },
  salam: { lang: 'Arabic', response: 'سلام دنیا!' },
  namaste: { lang: 'Hindi', response: 'नमस्ते दुनिया!' },
  konnichiwa: { lang: 'Japanese', response: 'こんにちは世界！' },
};

const ALL_TRIGGER_WORDS = ['java', 'sudo', 'gitblame', 'rm-rf', '404', ...Object.keys(GREETINGS)];
const MAX_BUFFER = Math.max(...ALL_TRIGGER_WORDS.map(w => w.length));

// Matrix rain characters
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]();:=><';

const EasterEgg = () => {
  // Existing
  const [showToast, setShowToast] = useState(false);
  const [showNPE, setShowNPE] = useState(false);
  const [npePos, setNpePos] = useState({ x: 0, y: 0 });

  // Batch 1 easter eggs
  const [showKonami, setShowKonami] = useState(false);
  const [showSudo, setShowSudo] = useState(false);
  const [showGitBlame, setShowGitBlame] = useState(false);
  const [showStackOverflow, setShowStackOverflow] = useState(false);
  const [showIdle, setShowIdle] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [showInstanceOf, setShowInstanceOf] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [showApi, setShowApi] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingData, setGreetingData] = useState({ lang: '', response: '' });
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementText, setAchievementText] = useState('');

  // Batch 2 easter eggs
  const [show404, setShow404] = useState(false);
  const [showEscape, setShowEscape] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [selectionText, setSelectionText] = useState('');
  const [showResize, setShowResize] = useState(false);
  const [resizeDims, setResizeDims] = useState({ w: 0, h: 0 });
  const [showGC, setShowGC] = useState(false);
  const [showRmRf, setShowRmRf] = useState(false);
  const [showEOF, setShowEOF] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  // Refs
  const typedRef = useRef('');
  const konamiRef = useRef([]);
  const clickCountRef = useRef(0);
  const idleTimerRef = useRef(null);
  const escCountRef = useRef(0);
  const escTimerRef = useRef(null);
  const resizeTimerRef = useRef(null);
  const pageTimeRef = useRef(Date.now());
  const gcShownRef = useRef(false);
  const eofShownRef = useRef(false);
  const avatarClickRef = useRef(0);
  const avatarTimerRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const matrixAnimRef = useRef(null);

  // Utility: dismiss after delay
  const autoDismiss = useCallback((setter, ms) => {
    setTimeout(() => setter(false), ms);
  }, []);

  // ─── Keyboard listener (java, sudo, git blame, konami, greetings, 404, rm -rf) ───
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Konami code tracking
      const expected = KONAMI[konamiRef.current.length];
      if (e.key === expected) {
        konamiRef.current.push(e.key);
        if (konamiRef.current.length === KONAMI.length) {
          konamiRef.current = [];
          setShowKonami(true);
          autoDismiss(setShowKonami, 8000);
        }
      } else {
        konamiRef.current = e.key === KONAMI[0] ? [e.key] : [];
      }

      // Escape triple-press
      if (e.key === 'Escape') {
        escCountRef.current++;
        clearTimeout(escTimerRef.current);
        escTimerRef.current = setTimeout(() => { escCountRef.current = 0; }, 800);
        if (escCountRef.current >= 3) {
          escCountRef.current = 0;
          setShowEscape(true);
          autoDismiss(setShowEscape, 4000);
        }
        return;
      }

      // Word-based triggers
      const key = e.key.length === 1 ? e.key.toLowerCase() : '';
      if (!key) return;

      typedRef.current = (typedRef.current + key).slice(-MAX_BUFFER);
      const buf = typedRef.current;

      // "java"
      if (buf.endsWith('java')) {
        typedRef.current = '';
        setShowToast(true);
        autoDismiss(setShowToast, 7000);
        return;
      }

      // "sudo"
      if (buf.endsWith('sudo')) {
        typedRef.current = '';
        setShowSudo(true);
        autoDismiss(setShowSudo, 8000);
        return;
      }

      // "gitblame" (user types "git blame" but we strip spaces)
      if (buf.replace(/\s/g, '').endsWith('gitblame')) {
        typedRef.current = '';
        setShowGitBlame(true);
        autoDismiss(setShowGitBlame, 8000);
        return;
      }

      // "404"
      if (buf.endsWith('404')) {
        typedRef.current = '';
        setShow404(true);
        autoDismiss(setShow404, 5000);
        return;
      }

      // "rm-rf" or "rmrf"
      if (buf.replace(/[\s-]/g, '').endsWith('rmrf')) {
        typedRef.current = '';
        setShowRmRf(true);
        setTimeout(() => setShowRmRf(false), 3000);
        return;
      }

      // Greetings
      for (const [word, data] of Object.entries(GREETINGS)) {
        if (buf.endsWith(word)) {
          typedRef.current = '';
          setGreetingData(data);
          setShowGreeting(true);
          autoDismiss(setShowGreeting, 6000);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoDismiss]);

  // ─── Double-click: NullPointerException ───
  useEffect(() => {
    const handleDblClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (['a', 'button', 'input', 'textarea', 'svg', 'path', 'img'].includes(tag)) return;
      if (e.target.closest('a, button, input, textarea, form')) return;

      setNpePos({ x: e.clientX, y: e.clientY });
      setShowNPE(true);
      autoDismiss(setShowNPE, 3500);
    };

    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, [autoDismiss]);

  // ─── Idle timer: Thread.sleep() ───
  useEffect(() => {
    const resetIdle = () => {
      if (showIdle) {
        setShowIdle(false);
      }
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setShowIdle(true);
      }, 60000);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(ev => window.addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetIdle));
      clearTimeout(idleTimerRef.current);
    };
  }, [showIdle]);

  // ─── Right-click: Custom context menu ───
  useEffect(() => {
    const handleContext = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      setContextPos({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    };

    const handleClickAway = () => {
      if (showContextMenu) setShowContextMenu(false);
    };

    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('click', handleClickAway);
    return () => {
      window.removeEventListener('contextmenu', handleContext);
      window.removeEventListener('click', handleClickAway);
    };
  }, [showContextMenu]);

  // ─── Triple-click on hero name: instanceof ───
  useEffect(() => {
    let clickCount = 0;
    let clickTimer = null;

    const handleClick = (e) => {
      const heroName = e.target.closest('.hero-name-new');
      if (!heroName) return;

      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 500);

      if (clickCount === 3) {
        clickCount = 0;
        setShowInstanceOf(true);
        autoDismiss(setShowInstanceOf, 5000);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [autoDismiss]);

  // ─── Device shake: ConcurrentModificationException (mobile) ───
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;
    let lastShakeTime = 0;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      if ((deltaX > 15 || deltaY > 15 || deltaZ > 15)) {
        const now = Date.now();
        if (now - lastShakeTime > 200) {
          shakeCount++;
          lastShakeTime = now;
        }
        if (shakeCount > 3) {
          shakeCount = 0;
          setShowShake(true);
          autoDismiss(setShowShake, 4000);
        }
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [autoDismiss]);

  // ─── Secret #/api hash route ───
  useEffect(() => {
    const checkHash = () => {
      setShowApi(window.location.hash === '#/api');
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // ─── Global click counter: achievement milestones ───
  useEffect(() => {
    const handleClick = () => {
      clickCountRef.current++;
      const count = clickCountRef.current;

      if (count === 10) {
        setAchievementText('ClickEvent \u00d7 10 \u2014 Curious Clicker');
        setShowAchievement(true);
        autoDismiss(setShowAchievement, 5000);
      } else if (count === 50) {
        setAchievementText('ClickEvent \u00d7 50 \u2014 Dedicated Explorer');
        setShowAchievement(true);
        autoDismiss(setShowAchievement, 5000);
      } else if (count === 100) {
        setAchievementText('ClickEvent \u00d7 100 \u2014 Click Overflow Master');
        setShowAchievement(true);
        autoDismiss(setShowAchievement, 5000);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [autoDismiss]);

  // ─── Text selection: String.substring() tooltip ───
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : '';
      if (text.length > 2 && text.length < 100) {
        setSelectionText(text.length > 30 ? text.slice(0, 30) + '...' : text);
        setShowSelection(true);
        autoDismiss(setShowSelection, 3000);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [autoDismiss]);

  // ─── Window resize: Dimension display ───
  useEffect(() => {
    const handleResize = () => {
      setResizeDims({ w: window.innerWidth, h: window.innerHeight });
      setShowResize(true);
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => setShowResize(false), 2000);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimerRef.current);
    };
  }, []);

  // ─── 5 min on page: GarbageCollector ───
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gcShownRef.current) {
        gcShownRef.current = true;
        setShowGC(true);
        autoDismiss(setShowGC, 5000);
      }
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, [autoDismiss]);

  // ─── Scroll to bottom: EOF ───
  useEffect(() => {
    const handleScroll = () => {
      if (eofShownRef.current) return;
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 10) {
        eofShownRef.current = true;
        setShowEOF(true);
        autoDismiss(setShowEOF, 5000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoDismiss]);

  // ─── Avatar/logo 5-click: Matrix rain ───
  useEffect(() => {
    const handleClick = (e) => {
      const avatar = e.target.closest('.hero-avatar-wrapper, .hero-logo');
      if (!avatar) return;

      avatarClickRef.current++;
      clearTimeout(avatarTimerRef.current);
      avatarTimerRef.current = setTimeout(() => { avatarClickRef.current = 0; }, 1000);

      if (avatarClickRef.current >= 5) {
        avatarClickRef.current = 0;
        setShowMatrix(true);
        setTimeout(() => setShowMatrix(false), 3000);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // ─── Matrix canvas animation ───
  useEffect(() => {
    if (!showMatrix || !matrixCanvasRef.current) return;

    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#6366f1';
      ctx.font = fontSize + 'px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillStyle = Math.random() > 0.9 ? '#a855f7' : '#6366f1';
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      matrixAnimRef.current = requestAnimationFrame(draw);
    };

    matrixAnimRef.current = requestAnimationFrame(draw);
    return () => {
      if (matrixAnimRef.current) cancelAnimationFrame(matrixAnimRef.current);
    };
  }, [showMatrix]);

  // ─── Context menu actions ───
  const handleContextAction = (action) => {
    setShowContextMenu(false);
    switch (action) {
      case 'inspect':
        setShowToast(true);
        autoDismiss(setShowToast, 7000);
        break;
      case 'compile':
        setShowSudo(true);
        autoDismiss(setShowSudo, 8000);
        break;
      case 'gc':
        setShowStackOverflow(true);
        autoDismiss(setShowStackOverflow, 4000);
        break;
      default:
        break;
    }
  };

  // ─── Spring transition presets ───
  const springPop = { type: 'spring', stiffness: 200, damping: 20 };
  const springSnap = { type: 'spring', stiffness: 300, damping: 20 };

  return (
    <>
      {/* ─── 1. System.out.println toast (existing "java" trigger) ─── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="ee-toast"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={springPop}
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
              <div className="ee-output">
                <span className="ee-output-prompt">&gt;</span> Hello World!
              </div>
              <div className="ee-divider" />
              <div className="ee-stack">
                <div className="ee-stack-header"><span>Easter egg found!</span></div>
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

      {/* ─── 2. NullPointerException popup (existing dbl-click) ─── */}
      <AnimatePresence>
        {showNPE && (
          <motion.div
            className="ee-npe"
            style={{ left: npePos.x, top: npePos.y }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={springSnap}
          >
            <span className="ee-npe-exception">java.lang.NullPointerException</span>
            <span className="ee-npe-trace">at com.amir.Portfolio.findElement(Portfolio.java:404)</span>
            <span className="ee-npe-trace">at com.amir.ui.ClickHandler.resolve(ClickHandler.java:12)</span>
            <span className="ee-npe-hint">{'// nothing here — try the actual content ;)'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 3. Konami Code → ClassNotFoundException + CV download ─── */}
      <AnimatePresence>
        {showKonami && (
          <motion.div
            className="ee-toast ee-konami"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">konami.exe — cheat activated</span>
            </div>
            <div className="ee-toast-body">
              <div className="ee-exception-line">
                <span className="ee-exception-name">java.lang.ClassNotFoundException</span>
              </div>
              <div className="ee-exception-detail">
                CheatCode.class not found in com.amir.portfolio
              </div>
              <div className="ee-divider" />
              <div className="ee-konami-msg">
                <span className="ee-kw">try</span> {'{'} <span className="ee-method">downloadCV</span>(); {'}'} <span className="ee-kw">catch</span> (Exception e) {'{'} {'}'}<br />
                <span className="ee-comment">{'// Just kidding, here it is →'}</span>
              </div>
              <div className="ee-konami-action">
                <span className="ee-konami-icon">📄</span>
                <span>CV download initiated...</span>
              </div>
              <div className="ee-hint">↑↑↓↓←→←→BA — you know the classics.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 4. Sudo → God mode with @Classified facts ─── */}
      <AnimatePresence>
        {showSudo && (
          <motion.div
            className="ee-toast ee-sudo"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">sudo — root access granted</span>
            </div>
            <div className="ee-toast-body">
              <div className="ee-sudo-header">
                <span className="ee-annotation">@Classified</span>
                <span className="ee-sudo-title">GOD MODE ACTIVATED</span>
              </div>
              <div className="ee-divider" />
              <div className="ee-sudo-facts">
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">caffeine.level</span>
                  <span className="ee-sudo-val">= DANGEROUS</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">bugs.squashed</span>
                  <span className="ee-sudo-val">= Integer.MAX_VALUE</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">sleep.schedule</span>
                  <span className="ee-sudo-val">= new CronJob("rarely")</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">superpower</span>
                  <span className="ee-sudo-val">= "Debugging at 3 AM"</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">tabs.vs.spaces</span>
                  <span className="ee-sudo-val">= "Yes."</span>
                </div>
              </div>
              <div className="ee-hint">You typed "sudo" — but with great power...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 5. StackOverflowError (triggered from context menu) ─── */}
      <AnimatePresence>
        {showStackOverflow && (
          <motion.div
            className="ee-stackoverflow"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={springSnap}
          >
            <span className="ee-exception-name">java.lang.StackOverflowError</span>
            <span className="ee-npe-trace">at com.amir.ui.ScrollHandler.onScroll(ScrollHandler.java:∞)</span>
            <span className="ee-npe-trace">at com.amir.ui.ScrollHandler.onScroll(ScrollHandler.java:∞)</span>
            <span className="ee-npe-trace">at com.amir.ui.ScrollHandler.onScroll(ScrollHandler.java:∞)</span>
            <span className="ee-npe-hint">{'// Slow down! The stack can only take so much.'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 6. Idle → Thread.sleep() overlay ─── */}
      <AnimatePresence>
        {showIdle && (
          <motion.div
            className="ee-idle-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="ee-idle-content">
              <div className="ee-idle-code">
                <span className="ee-kw">Thread</span>
                <span className="ee-dot">.</span>
                <span className="ee-method">sleep</span>
                <span className="ee-paren">(</span>
                <span className="ee-number">Long.MAX_VALUE</span>
                <span className="ee-paren">)</span>
                <span className="ee-semi">;</span>
              </div>
              <div className="ee-idle-zzz">
                <span>z</span><span>Z</span><span>Z</span>
              </div>
              <div className="ee-idle-hint">Move your mouse to wake up the thread...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 7. Right-click → Custom Java context menu ─── */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            className="ee-context-menu"
            style={{ left: contextPos.x, top: contextPos.y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="ee-ctx-header">
              <span className="ee-annotation">@ContextMenu</span>
            </div>
            <button className="ee-ctx-item" onClick={() => handleContextAction('inspect')}>
              <span className="ee-ctx-icon">🔍</span>
              <span>inspectElement()</span>
            </button>
            <button className="ee-ctx-item" onClick={() => handleContextAction('compile')}>
              <span className="ee-ctx-icon">⚡</span>
              <span>compile("portfolio")</span>
            </button>
            <button className="ee-ctx-item" onClick={() => handleContextAction('gc')}>
              <span className="ee-ctx-icon">🗑️</span>
              <span>System.gc()</span>
            </button>
            <div className="ee-ctx-divider" />
            <button className="ee-ctx-item ee-ctx-disabled" disabled>
              <span className="ee-ctx-icon">🔒</span>
              <span>viewSource() <span className="ee-ctx-lock">{'// private'}</span></span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 8. Git blame → Humorous output ─── */}
      <AnimatePresence>
        {showGitBlame && (
          <motion.div
            className="ee-toast ee-gitblame"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">git blame — Portfolio.java</span>
            </div>
            <div className="ee-toast-body ee-blame-body">
              <div className="ee-blame-line">
                <span className="ee-blame-hash">a1b2c3d</span>
                <span className="ee-blame-author">Amir</span>
                <span className="ee-blame-date">2024-01-15</span>
                <span className="ee-blame-code">{'// TODO: sleep more'}</span>
              </div>
              <div className="ee-blame-line">
                <span className="ee-blame-hash">e4f5g6h</span>
                <span className="ee-blame-author">Amir</span>
                <span className="ee-blame-date">2024-02-20</span>
                <span className="ee-blame-code">{'// Fixed bug introduced at 3AM'}</span>
              </div>
              <div className="ee-blame-line">
                <span className="ee-blame-hash">i7j8k9l</span>
                <span className="ee-blame-author">Amir</span>
                <span className="ee-blame-date">2024-03-10</span>
                <span className="ee-blame-code">{"// It works. Don't touch it."}</span>
              </div>
              <div className="ee-blame-line">
                <span className="ee-blame-hash">m0n1o2p</span>
                <span className="ee-blame-author">Amir</span>
                <span className="ee-blame-date">2024-04-01</span>
                <span className="ee-blame-code">{'// This was definitely not a hack'}</span>
              </div>
              <div className="ee-hint">{"You typed \"git blame\" — everyone's favorite detective tool."}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 9. Triple-click hero name → instanceof checks ─── */}
      <AnimatePresence>
        {showInstanceOf && (
          <motion.div
            className="ee-toast ee-instanceof"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">instanceof — type check</span>
            </div>
            <div className="ee-toast-body">
              <div className="ee-instanceof-checks">
                <div className="ee-instanceof-line">
                  <span className="ee-kw">amir</span> <span className="ee-kw">instanceof</span> <span className="ee-prop">Developer</span> <span className="ee-check-result ee-true">✓ true</span>
                </div>
                <div className="ee-instanceof-line">
                  <span className="ee-kw">amir</span> <span className="ee-kw">instanceof</span> <span className="ee-prop">CoffeeAddict</span> <span className="ee-check-result ee-true">✓ true</span>
                </div>
                <div className="ee-instanceof-line">
                  <span className="ee-kw">amir</span> <span className="ee-kw">instanceof</span> <span className="ee-prop">BugFactory</span> <span className="ee-check-result ee-false">✗ false</span>
                </div>
                <div className="ee-instanceof-line">
                  <span className="ee-kw">amir</span> <span className="ee-kw">instanceof</span> <span className="ee-prop">Hireable</span> <span className="ee-check-result ee-true">✓ true</span>
                </div>
              </div>
              <div className="ee-hint">Triple-clicked the name — running type checks...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 10. Device shake → ConcurrentModificationException ─── */}
      <AnimatePresence>
        {showShake && (
          <motion.div
            className="ee-stackoverflow ee-shake"
            initial={{ opacity: 0, rotate: -3 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 3 }}
            transition={springSnap}
          >
            <span className="ee-exception-name">java.util.ConcurrentModificationException</span>
            <span className="ee-npe-trace">at com.amir.ui.PhoneHandler.onShake(PhoneHandler.java:42)</span>
            <span className="ee-npe-trace">at java.util.ArrayList$Itr.next(ArrayList.java:1042)</span>
            <span className="ee-npe-hint">{'// Stop shaking! The iterator is confused.'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 11. Secret #/api route → Fake Swagger ─── */}
      <AnimatePresence>
        {showApi && (
          <motion.div
            className="ee-api-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ee-api-container">
              <div className="ee-toast-bar">
                <div className="terminal-dots">
                  <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                  <span className="terminal-dot" style={{ background: '#febc2e' }} />
                  <span className="terminal-dot" style={{ background: '#28c840' }} />
                </div>
                <span className="ee-toast-title">Amir Portfolio API v1.0 — Swagger UI</span>
              </div>
              <div className="ee-api-body">
                <div className="ee-api-header">
                  <span className="ee-api-title">Portfolio REST API</span>
                  <span className="ee-api-version">v1.0.0 | OpenAPI 3.0</span>
                </div>
                <div className="ee-api-endpoints">
                  <div className="ee-api-endpoint ee-api-get">
                    <span className="ee-api-method">GET</span>
                    <span className="ee-api-path">/api/skills</span>
                    <span className="ee-api-desc">Returns all developer skills</span>
                  </div>
                  <div className="ee-api-endpoint ee-api-get">
                    <span className="ee-api-method">GET</span>
                    <span className="ee-api-path">/api/projects</span>
                    <span className="ee-api-desc">List all portfolio projects</span>
                  </div>
                  <div className="ee-api-endpoint ee-api-post">
                    <span className="ee-api-method ee-method-post">POST</span>
                    <span className="ee-api-path">/api/hire</span>
                    <span className="ee-api-desc">Submit a hire request</span>
                  </div>
                  <div className="ee-api-endpoint ee-api-get">
                    <span className="ee-api-method">GET</span>
                    <span className="ee-api-path">/api/coffee/count</span>
                    <span className="ee-api-desc">Returns cups consumed today</span>
                  </div>
                  <div className="ee-api-endpoint ee-api-delete">
                    <span className="ee-api-method ee-method-delete">DELETE</span>
                    <span className="ee-api-path">/api/bugs</span>
                    <span className="ee-api-desc">403 Forbidden — bugs are features</span>
                  </div>
                </div>
                <div className="ee-api-footer">
                  <span>Navigate away from #/api to return to the portfolio.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 12. Multilingual greetings → System.out.println ─── */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            className="ee-toast ee-greeting"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">java.exe — {greetingData.lang} output</span>
            </div>
            <div className="ee-toast-body">
              <div className="ee-sop-line">
                <span className="ee-kw">System</span>
                <span className="ee-dot">.</span>
                <span className="ee-prop">out</span>
                <span className="ee-dot">.</span>
                <span className="ee-method">println</span>
                <span className="ee-paren">(</span>
                <span className="ee-string">"{greetingData.response}"</span>
                <span className="ee-paren">)</span>
                <span className="ee-semi">;</span>
              </div>
              <div className="ee-output">
                <span className="ee-output-prompt">&gt;</span> {greetingData.response}
              </div>
              <div className="ee-hint">
                Locale detected: {greetingData.lang} — I speak code in all languages.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 13. Click milestones → Achievement toast ─── */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="ee-achievement"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-achievement-icon">🏆</div>
            <div className="ee-achievement-content">
              <span className="ee-achievement-label">Achievement Unlocked!</span>
              <span className="ee-achievement-text">{achievementText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 14. Type "404" → FileNotFoundException ─── */}
      <AnimatePresence>
        {show404 && (
          <motion.div
            className="ee-stackoverflow ee-404"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={springSnap}
          >
            <span className="ee-exception-name">java.io.FileNotFoundException</span>
            <span className="ee-npe-trace">at com.amir.Portfolio.findPage(Portfolio.java:404)</span>
            <span className="ee-npe-trace">at com.amir.router.Navigator.resolve(Navigator.java:27)</span>
            <span className="ee-npe-hint">{'// The page compiled successfully but ran away.'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 15. Escape ×3 → SecurityException ─── */}
      <AnimatePresence>
        {showEscape && (
          <motion.div
            className="ee-stackoverflow ee-escape"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springSnap}
          >
            <span className="ee-exception-name">java.lang.SecurityException</span>
            <span className="ee-npe-trace">at com.amir.jvm.ThreadManager.escape(ThreadManager.java:1)</span>
            <span className="ee-npe-trace">at java.base/java.lang.Runtime.exit(Runtime.java:114)</span>
            <span className="ee-npe-hint">{'// Thread tried to escape the JVM. Permission denied.'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 16. Text selection → String.substring() tooltip ─── */}
      <AnimatePresence>
        {showSelection && (
          <motion.div
            className="ee-selection-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="ee-kw">String</span>
            <span className="ee-dot">.</span>
            <span className="ee-method">substring</span>
            <span className="ee-paren">(</span>
            <span className="ee-string">"{selectionText}"</span>
            <span className="ee-paren">)</span>
            <span className="ee-semi"> — nice selection</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 17. Window resize → Dimension display ─── */}
      <AnimatePresence>
        {showResize && (
          <motion.div
            className="ee-resize-toast"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <span className="ee-kw">new</span>{' '}
            <span className="ee-prop">Dimension</span>
            <span className="ee-paren">(</span>
            <span className="ee-number">{resizeDims.w}</span>
            <span className="ee-dot">, </span>
            <span className="ee-number">{resizeDims.h}</span>
            <span className="ee-paren">)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 18. 5 minutes on page → GarbageCollector ─── */}
      <AnimatePresence>
        {showGC && (
          <motion.div
            className="ee-toast ee-gc"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={springPop}
          >
            <div className="ee-toast-bar">
              <div className="terminal-dots">
                <span className="terminal-dot" style={{ background: '#ff5f57' }} />
                <span className="terminal-dot" style={{ background: '#febc2e' }} />
                <span className="terminal-dot" style={{ background: '#28c840' }} />
              </div>
              <span className="ee-toast-title">jvm — garbage collector</span>
            </div>
            <div className="ee-toast-body">
              <div className="ee-gc-header">
                <span className="ee-annotation">@GarbageCollector</span>
                <span className="ee-gc-status">RUNNING</span>
              </div>
              <div className="ee-divider" />
              <div className="ee-gc-stats">
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">heap.used</span>
                  <span className="ee-sudo-val">= 847MB / 1024MB</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">objects.freed</span>
                  <span className="ee-sudo-val">= 42,069</span>
                </div>
                <div className="ee-sudo-fact">
                  <span className="ee-sudo-key">time.on.page</span>
                  <span className="ee-sudo-val">= "5min (impressive)"</span>
                </div>
              </div>
              <div className="ee-hint">{"You've been here 5 minutes. The JVM is cleaning up. Hire this dev."}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 19. Type "rm -rf" → Fake screen wipe ─── */}
      <AnimatePresence>
        {showRmRf && (
          <motion.div
            className="ee-rmrf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="ee-rmrf-content"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 0.95, 0] }}
              transition={{ duration: 2.5, times: [0, 0.1, 0.3, 1] }}
            >
              <div className="ee-rmrf-cmd">
                <span className="ee-rmrf-prompt">$ </span>
                <span className="ee-rmrf-text">rm -rf /portfolio/*</span>
              </div>
              <div className="ee-rmrf-progress">
                <span>Deleting files...</span>
                <motion.div
                  className="ee-rmrf-bar"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              </div>
              <div className="ee-rmrf-jk">
                <span className="ee-comment">{'// Just kidding. IOException: Permission denied ;)'}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 20. Scroll to bottom → EOF ─── */}
      <AnimatePresence>
        {showEOF && (
          <motion.div
            className="ee-eof-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={springPop}
          >
            <div className="ee-eof-content">
              <span className="ee-exception-name" style={{ color: '#28c840' }}>EOF reached — java.io.EOFException</span>
              <span className="ee-npe-trace">at com.amir.Portfolio.readAll(Portfolio.java:∞)</span>
              <span className="ee-eof-msg">{"You've read the entire codebase. Hire this dev."}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 21. Avatar 5-click → Matrix rain ─── */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            className="ee-matrix-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <canvas ref={matrixCanvasRef} className="ee-matrix-canvas" />
            <div className="ee-matrix-text">
              <span className="ee-kw">Matrix</span>
              <span className="ee-dot">.</span>
              <span className="ee-method">enter</span>
              <span className="ee-paren">()</span>
              <span className="ee-semi">;</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hero } from '../../data/hero';
import { projects } from '../../data/projects';
import { socialLinks } from '../../data/contact';

// --- Easter Egg: Cowsay ---
const cowsay = (text) => {
  const bubble = [
    `  ${'-'.repeat(text.length + 2)}`,
    `< ${text} >`,
    `  ${'-'.repeat(text.length + 2)}`,
  ];
  const cow = [
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ];
  return <pre className="text-sm leading-tight">{[...bubble, ...cow].join('\n')}</pre>;
};

// --- Easter Egg: Matrix Effect ---
const MatrixEffect = ({ onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    const rainDrops = Array.from({ length: columns }).map(() => 1);

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    const timer = setTimeout(onComplete, 5000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-50" />;
};


const Terminal = ({ isVisible, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'info', text: 'Terminal loaded. Type "help" for a list of commands.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setMatrixActive] = useState(false);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleCommand = (command) => {
    const newHistory = [...history, { type: 'command', text: `> ${command}` }];
    let output = { type: 'error', text: `command not found: ${command}` };

    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        output = {
          type: 'info',
          text: (
            <span>
              Available commands:
              <br />- <strong>whoami</strong>: Displays a short bio.
              <br />- <strong>socials</strong>: Lists social media links.
              <br />- <strong>projects</strong>: Shows available projects.
              <br />- <strong>cowsay [message]</strong>: An ASCII cow says something.
              <br />- <strong>matrix</strong>: Enter the matrix.
              <br />- <strong>clear</strong>: Clears the terminal history.
              <br />- <strong>exit</strong>: Closes the terminal.
            </span>
          ),
        };
        break;

      case 'whoami':
        output = { type: 'info', text: hero.bio };
        break;

      case 'socials':
        output = {
          type: 'info',
          text: (
            <span>
              {socialLinks.map((social, index) => (
                <div key={index}>
                  - <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{social.label}</a>
                </div>
              ))}
            </span>
          ),
        };
        break;

      case 'projects':
        output = {
          type: 'info',
          text: (
            <span>
              Available projects:
              <br />
              {projects.map((p, i) => (
                <div key={i}>- {p.title.toLowerCase().replace(/ /g, '_')}</div>
              ))}
            </span>
          ),
        };
        break;
      
      case 'cowsay':
        const message = args.slice(1).join(' ') || '...moo';
        output = { type: 'info', text: cowsay(message) };
        break;

      case 'matrix':
        setMatrixActive(true);
        setHistory([]);
        return;

      case 'sudo':
        output = { type: 'error', text: 'User is not in the sudoers file. This incident will be reported.' };
        break;

      case 'clear':
        setHistory([]);
        return; 

      case 'exit':
        onClose();
        return;

      default:
        break;
    }
    
    setHistory([...newHistory, output]);
    if (command) {
      setCommandHistory([command, ...commandHistory]);
    }
    setHistoryIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  if (isMatrixActive) {
    return <MatrixEffect onComplete={() => setMatrixActive(false)} />;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="terminal-window bg-[#1a1b26] text-[#c0caf5] font-mono rounded-lg shadow-2xl w-[700px] h-[500px] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="terminal-bar bg-[#292a3e] p-2 flex items-center rounded-t-lg" onMouseDown={(e) => {/* Add drag logic here if desired */}}>
              <div className="flex space-x-2">
                <button className="terminal-dot bg-[#ff5f57]" onClick={onClose} />
                <span className="terminal-dot bg-[#febc2e]" />
                <span className="terminal-dot bg-[#28c840]" />
              </div>
              <span className="ml-4 text-xs">/bin/bash -- ⚡️ contact-me</span>
            </div>

            <div ref={bodyRef} className="terminal-body p-4 overflow-y-auto flex-grow" onClick={() => inputRef.current?.focus()}>
              {history.map((line, index) => (
                <div key={index} className={`mb-1 ${line.type === 'error' ? 'text-red-400' : ''}`}>
                  {line.text}
                </div>
              ))}
              <form onSubmit={handleSubmit} className="flex">
                <label htmlFor="terminal-input" className="text-[#a9b1d6]">
                  &gt;
                </label>
                <input
                  ref={inputRef}
                  id="terminal-input"
                  type="text"
                  className="bg-transparent border-none text-[#c0caf5] focus:ring-0 outline-none w-full ml-2"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;

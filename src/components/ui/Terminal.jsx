import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hero } from '../../data/hero';
import { projects } from '../../data/projects';
import { socialLinks } from '../../data/contact';

const Terminal = ({ isVisible, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'info', text: 'Terminal loaded. Type "help" for a list of commands.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleCommand = (command) => {
    const newHistory = [...history, { type: 'command', text: `> ${command}` }];
    let output = { type: 'error', text: `command not found: ${command}` };

    const args = command.toLowerCase().split(' ');
    const cmd = args[0];

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

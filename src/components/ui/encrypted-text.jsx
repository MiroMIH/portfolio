import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>[]{}";

export const EncryptedText = ({
  text,
  revealDelayMs,
  flipDelayMs = 40,
  charset = DEFAULT_CHARSET,
  style,
  encryptedStyle,
  revealedStyle,
  maxDuration = 1500,
  animateOn = "view",
  as: Tag = "span",
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [revealedCount, setRevealedCount] = useState(0);
  const [displayChars, setDisplayChars] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-calculate reveal speed so animation finishes in maxDuration
  const computedRevealDelay = revealDelayMs || Math.max(15, Math.min(60, maxDuration / text.length));

  // Trigger start
  useEffect(() => {
    if (animateOn === "mount") {
      setHasStarted(true);
    } else if (isInView) {
      setHasStarted(true);
    }
  }, [isInView, animateOn]);

  // Initialize display with gibberish
  useEffect(() => {
    setDisplayChars(
      text.split("").map((char) =>
        char === " " ? " " : charset[Math.floor(Math.random() * charset.length)]
      )
    );
  }, [text, charset]);

  // Flip unrevealed characters (scramble effect)
  useEffect(() => {
    if (!hasStarted) return;
    if (revealedCount >= text.length) return;

    const interval = setInterval(() => {
      setDisplayChars((prev) =>
        prev.map((char, i) => {
          if (i < revealedCount) return text[i];
          if (text[i] === " ") return " ";
          return charset[Math.floor(Math.random() * charset.length)];
        })
      );
    }, flipDelayMs);

    return () => clearInterval(interval);
  }, [hasStarted, revealedCount, text, flipDelayMs, charset]);

  // Gradually reveal real characters
  useEffect(() => {
    if (!hasStarted) return;
    if (revealedCount >= text.length) {
      // Final state: show real text
      setDisplayChars(text.split(""));
      return;
    }

    const timeout = setTimeout(() => {
      setRevealedCount((prev) => prev + 1);
    }, computedRevealDelay);

    return () => clearTimeout(timeout);
  }, [hasStarted, revealedCount, text, computedRevealDelay]);

  const defaultEncryptedStyle = {
    color: "#6366f1",
    opacity: 0.6,
  };

  const defaultRevealedStyle = {
    color: "inherit",
    opacity: 1,
  };

  return (
    <Tag ref={ref} style={style} className={className}>
      {displayChars.map((char, i) => (
        <span
          key={i}
          style={{
            transition: "color 0.2s ease, opacity 0.2s ease",
            ...(i < revealedCount
              ? { ...defaultRevealedStyle, ...revealedStyle }
              : hasStarted
                ? { ...defaultEncryptedStyle, ...encryptedStyle }
                : { ...defaultRevealedStyle, ...revealedStyle, opacity: 0 }),
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
};

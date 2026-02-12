import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useVelocity,
  useSpring,
} from "framer-motion";
import { cn } from "../../lib/utils";

export const TracingBeam = ({ children, className }) => {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scrollYProgressVelocity = useVelocity(scrollYProgress);
  // eslint-disable-next-line no-unused-vars
  const [velo, setVelocity] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgressVelocity.on("change", (latest) => {
      setVelocity(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgressVelocity]);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  );

  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    }
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
    >
      {/* Beam container - fixed to the left side of viewport */}
      <div
        style={{
          position: 'absolute',
          left: '30px',
          top: '0',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        {/* Dot at the top */}
        {/* <motion.div
          style={{
            marginLeft: '27px',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            backgroundColor: 'rgba(99, 102, 241, 0.3)',
            borderColor: 'rgba(99, 102, 241, 0.6)',
          }}
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: '#6366f1',
              borderColor: '#6366f1',
            }}
            style={{
              height: '8px',
              width: '8px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'white',
            }}
          />
        </motion.div> */}

        {/* SVG beam line */}
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          style={{ marginLeft: '16px', display: 'block' }}
          aria-hidden="true"
        >
          {/* Background path (faint line) */}
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.25"
          />
          {/* Animated gradient path */}
          <path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#tracing-beam-gradient)"
            strokeWidth="1.25"
          />
          <defs>
            <motion.linearGradient
              id="tracing-beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#18CCFC" />
              <stop offset="0.325" stopColor="#6344F5" />
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};

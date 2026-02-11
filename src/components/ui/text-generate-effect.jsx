import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";

export const TextGenerateEffect = ({ words, style, filter = true, duration = 0.5 }) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(0.08),
        }
      );
    }
  }, [isInView, animate, filter, duration]);

  return (
    <div style={style}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            style={{
              color: '#8a8a9e',
              opacity: 0,
              display: 'inline-block',
              marginRight: '0.4em',
              filter: filter ? 'blur(10px)' : 'none',
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

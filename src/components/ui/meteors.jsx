import React, { useMemo } from "react";

export const Meteors = ({ number = 15 }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: number }, (_, i) => ({
      id: i,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
      height: `${Math.random() * 20 + 10}px`,
    }));
  }, [number]);

  return (
    <>
      {meteors.map((m) => (
        <span
          key={m.id}
          style={{
            position: 'absolute',
            top: '-5%',
            left: m.left,
            width: '2px',
            height: m.height,
            borderRadius: '9999px',
            background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.8), transparent)',
            boxShadow: '0 0 4px rgba(99, 102, 241, 0.4)',
            transform: 'rotate(215deg)',
            animation: `meteorFall ${m.duration} linear ${m.delay} infinite`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '1px',
              background: 'linear-gradient(to right, rgba(99, 102, 241, 0.4), transparent)',
            }}
          />
        </span>
      ))}
    </>
  );
};

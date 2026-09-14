"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement | null>(
    null
  );

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.15,
        }
      );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, visible] as const;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, visible] =
    useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,

        transform: visible
          ? "translateY(0)"
          : "translateY(22px)",

        transition: `
          opacity 0.7s
          cubic-bezier(0.16,1,0.3,1)
          ${delay}ms,

          transform 0.7s
          cubic-bezier(0.16,1,0.3,1)
          ${delay}ms
        `,
      }}
    >
      {children}
    </div>
  );
}
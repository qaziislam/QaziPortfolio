"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  delay?: number;
  y?: number;
  className?: string;
}>;

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.62, ease: [0.2, 0.9, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

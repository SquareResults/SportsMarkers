"use client";

import { motion } from "framer-motion";
import React from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}

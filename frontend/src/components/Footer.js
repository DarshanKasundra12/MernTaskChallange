import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="container footer"
    >
      <p>
        Built as a learning-first task challenge website for becoming a job-ready MERN developer.
      </p>
    </motion.footer>
  );
}

export default Footer;

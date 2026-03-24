import React from 'react';
import { motion } from 'framer-motion';

const weekData = [
  {
    id: 'week-1',
    label: 'Week 1',
    title: 'Core & CRUD',
    text: 'Backend foundation, Express setup, MongoDB models, and CRUD API flow.',
  },
  {
    id: 'week-2',
    label: 'Week 2',
    title: 'Authentication & Security',
    text: 'JWT auth, bcrypt hashing, middleware protection, and role-based control.',
  },
  {
    id: 'week-3',
    label: 'Week 3',
    title: 'Advanced Features',
    text: 'Pagination, filtering, upload workflow, logs, and env management.',
  },
  {
    id: 'week-4',
    label: 'Week 4',
    title: 'Deployment & Optimization',
    text: 'Caching, API docs, DB optimization, production deploy, and final polish.',
  },
];

const stats = [
  { label: 'Total Days', value: '20' },
  { label: 'Weeks', value: '4' },
  { label: 'Primary Focus', value: 'Backend + API' },
  { label: 'Target', value: 'Job Ready' },
];

function Dashboard() {
  return (
    <main className="container dashboard">
      <motion.section
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="hero"
      >
        <motion.div
          className="hero__orb hero__orb--top"
          animate={{ rotate: 360 }}
          transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="hero__orb hero__orb--bottom"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <div className="hero__content">
          <div>
            <span className="hero__badge">Task Challenge Website</span>
            <h1>MERN Progress Tracker</h1>
            <p>
              A structured roadmap to master MongoDB, Express, React, and Node by building a
              production-ready full-stack application with consistent day-by-day execution.
            </p>
            <div className="hero__actions">
              <motion.a
                href="#week-1"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn--light"
              >
                Start Week 1
              </motion.a>
              <motion.a
                href="#rules"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn--dark"
              >
                Rules
              </motion.a>
            </div>
          </div>

          <div className="stats">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.08, duration: 0.45 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="stat"
                data-clickable="true"
              >
                <div className="stat__label">{item.label}</div>
                <div className="stat__value">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid-2">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -7, scale: 1.01 }}
          className="card card--light"
          data-clickable="true"
        >
          <p className="card__eyebrow">Overview</p>
          <h2>Learning-First Architecture</h2>
          <p>
            This project follows a strict 20-day plan to build backend depth, full-stack
            confidence, and production-ready development habits.
          </p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          whileHover={{ y: -7, scale: 1.01 }}
          className="card card--dark"
          data-clickable="true"
        >
          <p className="card__eyebrow">Core Pillars</p>
          <h2>What This Builds</h2>
          <div className="pillars">
            <div className="pillars__item">Day-wise roadmap with strict progression</div>
            <div className="pillars__item">Real backend architecture and API design</div>
            <div className="pillars__item">Security-focused implementation mindset</div>
            <div className="pillars__item">Production deployment workflow</div>
          </div>
        </motion.article>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="section"
      >
        <div className="section__head">
          <h2>4-Week Learning Plan</h2>
          <span className="section__tag">20 Days</span>
        </div>
        <div className="weeks">
          {weekData.map((week, index) => (
            <motion.article
              key={week.id}
              id={week.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.07, duration: 0.46 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="week-card"
              data-clickable="true"
            >
              <p className="week-card__label">{week.label}</p>
              <h3 className="week-card__title">{week.title}</h3>
              <p className="week-card__desc">{week.text}</p>
              <div className="line" />
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="rules"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="section"
      >
        <div className="section__head">
          <h2>Rules & Approach</h2>
          <span className="section__tag">Consistency</span>
        </div>
        <div className="rules">
          {[
            'Follow tasks day-by-day without skipping.',
            'Write code manually and focus on understanding.',
            'Debug independently before asking for help.',
            'Use AI for analysis and hints, not direct copy-paste coding.',
          ].map((rule, index) => (
            <motion.div
              key={rule}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ x: 5 }}
              className="rule"
              data-clickable="true"
            >
              {rule}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}

export default Dashboard;

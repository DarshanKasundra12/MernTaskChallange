import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BASE_URL from '../api';

const crudOps = [
  { name: 'Create', api: '/tasks POST', note: 'Add new task' },
  { name: 'Read', api: '/tasks GET', note: 'Fetch all tasks' },
  { name: 'Update', api: '/tasks/:id PATCH', note: 'Edit existing task' },
  { name: 'Delete', api: '/tasks/:id DELETE', note: 'Remove task' },
];

const dayPlan = [
  {
    day: 'Day 1',
    title: 'Foundation Setup',
    tasks: [
      {
        name: 'Setup Express Server',
        op: 'SETUP',
        api: 'N/A',
        navigation: 'Init',
        requirement: 'npm init, install express, create server.js, app.listen',
      },
      {
        name: 'MongoDB Connection',
        op: 'SETUP',
        api: 'N/A',
        navigation: 'Backend Init',
        requirement: 'Install mongoose, connect using URI in .env',
      },
      {
        name: 'React Setup',
        op: 'SETUP',
        api: 'N/A',
        navigation: 'Frontend Init',
        requirement: 'Create React app using Vite, basic folder structure',
      },
    ],
  },
  {
    day: 'Day 2',
    title: 'Model + Create/Read APIs',
    tasks: [
      {
        name: 'Task Schema',
        op: 'MODEL',
        api: 'N/A',
        navigation: 'Models',
        requirement: 'Create schema with title, status, timestamps',
      },
      {
        name: 'POST Task',
        op: 'CREATE',
        api: '/tasks POST',
        navigation: 'Add Task Page',
        requirement: 'req.body validation, save document',
      },
      {
        name: 'GET Tasks',
        op: 'READ',
        api: '/tasks GET',
        navigation: 'Home -> Task List',
        requirement: 'Find all tasks and return JSON',
      },
    ],
  },
  {
    day: 'Day 3',
    title: 'Validation + Frontend Read',
    tasks: [
      {
        name: 'Schema Validation',
        op: 'VALIDATE',
        api: 'Model',
        navigation: 'Internal',
        requirement: 'Required fields, enum for status',
      },
      {
        name: 'Frontend Fetch',
        op: 'READ',
        api: '/tasks GET',
        navigation: 'Home',
        requirement: 'useEffect fetch and render list',
      },
    ],
  },
  {
    day: 'Day 4',
    title: 'Architecture + Components',
    tasks: [
      {
        name: 'MVC Setup',
        op: 'ARCH',
        api: 'N/A',
        navigation: 'Structure',
        requirement: 'Separate routes, controllers, models',
      },
      {
        name: 'Component Design',
        op: 'UI',
        api: 'N/A',
        navigation: 'Frontend',
        requirement: 'Split UI into reusable components',
      },
    ],
  },
  {
    day: 'Day 5',
    title: 'Error Handling Layer',
    tasks: [
      {
        name: 'Error Middleware',
        op: 'BACKEND',
        api: 'Global',
        navigation: 'All',
        requirement: 'Create error handler (err, req, res, next)',
      },
      {
        name: 'Frontend Error UI',
        op: 'FRONTEND',
        api: 'N/A',
        navigation: 'UI',
        requirement: 'Display error messages from API',
      },
    ],
  },
];

const initialForm = {
  day: 1,
  week: '1',
  title: '',
  description: '',
  proof: '',
  proofImage: '',
  difficulty: 'Easy',
  status: 'Created',
};

function normalizeTask(task) {
  return {
    ...task,
    description: task.description || '',
    proof: task.proof || '',
    proofImage: task.proofImage || '',
  };
}

function getBackendRoot() {
  return BASE_URL.replace(/\/api\/?$/, '');
}

function resolveProofImageUrl(value) {
  if (!value) return '';
  if (/^(https?:\/\/|data:image\/)/i.test(value)) return value;
  return `${getBackendRoot()}${value.startsWith('/') ? value : `/${value}`}`;
}

function Week1Page() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [createdTasks, setCreatedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [proofImageData, setProofImageData] = useState('');
  const [proofPreview, setProofPreview] = useState('');

  function resetForm() {
    setForm(initialForm);
    setEditingTaskId(null);
    setProofImageData('');
    setProofPreview('');
  }

  async function loadTasks() {
    setLoadingTasks(true);
    try {
      const res = await fetch(`${BASE_URL}/task/gettask`);
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load tasks');
      }

      const tasks = Array.isArray(data.data) ? data.data.map(normalizeTask) : [];
      const filtered = tasks.filter(
        (task) => Number(task.day) >= 1 && Number(task.day) <= 5 && String(task.week) === '1'
      );
      setCreatedTasks(filtered.reverse().slice(0, 8));
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'day' ? Number(value) : value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setProofImageData('');
      setProofPreview(form.proofImage ? resolveProofImageUrl(form.proofImage) : '');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setProofImageData(result);
      setProofPreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        proof: form.proof.trim(),
        proofImageData,
      };

      const endpoint = editingTaskId
        ? `${BASE_URL}/task/updatetask/${editingTaskId}`
        : `${BASE_URL}/task/addtask`;
      const method = editingTaskId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to save task');
      }

      const savedTask = normalizeTask(data.data);
      setMessage(editingTaskId ? 'Task updated successfully.' : 'Task created and stored in database.');
      if (selectedTask && selectedTask._id === savedTask._id) {
        setSelectedTask(savedTask);
      }

      resetForm();
      await loadTasks();

      const section = document.getElementById('week1-created');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(task) {
    setForm({
      day: Number(task.day) || 1,
      week: String(task.week || '1'),
      title: task.title || '',
      description: task.description || '',
      proof: task.proof || '',
      proofImage: task.proofImage || '',
      difficulty: task.difficulty || 'Easy',
      status: task.status || 'Created',
    });
    setEditingTaskId(task._id);
    setProofImageData('');
    setProofPreview(task.proofImage ? resolveProofImageUrl(task.proofImage) : '');
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(taskId) {
    const confirmed = window.confirm('Delete this task permanently?');
    if (!confirmed) return;

    setMessage('');
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/task/deletetask/${taskId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete task');
      }

      setCreatedTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (editingTaskId === taskId) resetForm();
      if (selectedTask && selectedTask._id === taskId) setSelectedTask(null);
      setMessage('Task deleted successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete task');
    }
  }

  async function handleOpenDetails(taskId) {
    setDetailLoading(true);
    setDetailError('');
    try {
      const res = await fetch(`${BASE_URL}/task/gettask/${taskId}`);
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load task detail');
      }

      setSelectedTask(normalizeTask(data.data));
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Failed to load task detail');
      setSelectedTask(null);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <main className="container week1">
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="week1__hero"
      >
        <p className="week1__eyebrow">Week 1: Core & CRUD</p>
        <h1>Day-by-Day Task Execution</h1>
        <p className="week1__subtitle">
          Your backend already supports CRUD, so this page tracks each day and provides a real form
          that stores task data directly in MongoDB.
        </p>
      </motion.section>

      <section className="week1__crud-grid">
        {crudOps.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ delay: index * 0.06, duration: 0.38 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="crud-op-card"
            data-clickable="true"
          >
            <p className="crud-op-card__name">{item.name}</p>
            <p className="crud-op-card__api">{item.api}</p>
            <p className="crud-op-card__note">{item.note}</p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="week1__form-wrap"
      >
        <div className="section__head">
          <h2>{editingTaskId ? 'Edit Task' : 'Create Task (Store In Database)'}</h2>
          <span className="section__tag">
            {editingTaskId ? 'PATCH /api/task/updatetask/:id' : 'POST /api/task/addtask'}
          </span>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
            />
          </label>

          <label>
            Proof Note
            <textarea
              name="proof"
              value={form.proof}
              onChange={handleChange}
              placeholder="Add completion note"
              rows={3}
            />
          </label>

          <label>
            Upload Proof Screenshot
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {proofPreview ? (
            <div className="task-form__preview">
              <img src={proofPreview} alt="Proof preview" className="task-form__preview-image" />
            </div>
          ) : null}

          <div className="task-form__row">
            <label>
              Day (1-5)
              <input
                type="number"
                min={1}
                max={5}
                name="day"
                value={form.day}
                onChange={handleChange}
              />
            </label>

            <label>
              Week
              <input
                name="week"
                value={form.week}
                onChange={handleChange}
                placeholder="1"
              />
            </label>
          </div>

          <div className="task-form__row">
            <label>
              Difficulty
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Created">Created</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="task-form__actions">
            <button type="submit" className="task-form__submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
            </button>
            {editingTaskId ? (
              <button
                type="button"
                className="task-form__secondary"
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>

          {message ? <p className="task-form__success">{message}</p> : null}
          {error ? <p className="task-form__error">{error}</p> : null}
        </form>
      </motion.section>

      <motion.section
        id="week1-created"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className="week1__form-wrap"
      >
        <div className="section__head">
          <h2>Created Tasks (Read From DB)</h2>
          <span className="section__tag">Full CRUD Actions</span>
        </div>

        {loadingTasks ? (
          <p className="week1__loading">Loading tasks...</p>
        ) : createdTasks.length === 0 ? (
          <p className="week1__loading">No tasks yet. Create one from the form above.</p>
        ) : (
          <div className="task-list">
            {createdTasks.map((task) => (
              <div key={task._id} className="task-item task-item--created">
                <div className="task-item__top">
                  <h3>{task.title}</h3>
                  <span>{task.status}</span>
                </div>
                <div className="task-item__meta">
                  <p><strong>Day:</strong> {task.day}</p>
                  <p><strong>Week:</strong> {task.week}</p>
                  <p><strong>Difficulty:</strong> {task.difficulty}</p>
                </div>
                <p><strong>Description:</strong> {task.description || 'No description'}</p>
                <p><strong>Proof Note:</strong> {task.proof || 'No proof note added yet'}</p>
                <p><strong>Screenshot:</strong> {task.proofImage ? 'Uploaded' : 'No screenshot'}</p>

                <div className="task-item__actions">
                  <button
                    type="button"
                    className="task-action task-action--light"
                    onClick={() => handleOpenDetails(task._id)}
                  >
                    More Detail
                  </button>
                  <button
                    type="button"
                    className="task-action"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="task-action task-action--danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {detailLoading ? (
        <section className="week1__detail-state">
          <p className="week1__loading">Loading task detail...</p>
        </section>
      ) : null}

      {detailError ? (
        <section className="week1__detail-state">
          <p className="task-form__error">{detailError}</p>
        </section>
      ) : null}

      <section className="week1__days">
        {dayPlan.map((day, index) => (
          <motion.article
            key={day.day}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.42, delay: index * 0.05 }}
            whileHover={{ y: -7, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="day-card"
            data-clickable="true"
          >
            <div className="day-card__head">
              <span>{day.day}</span>
              <h2>{day.title}</h2>
            </div>

            <div className="task-list">
              {day.tasks.map((task) => (
                <div key={task.name} className="task-item">
                  <div className="task-item__top">
                    <h3>{task.name}</h3>
                    <span>{task.op}</span>
                  </div>
                  <p><strong>API:</strong> {task.api}</p>
                  <p><strong>Navigation:</strong> {task.navigation}</p>
                  <p><strong>Requirement:</strong> {task.requirement}</p>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </section>

      <AnimatePresence>
        {selectedTask ? (
          <motion.div
            className="week1-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close details"
              className="week1-modal__backdrop"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              className="week1-modal__card"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.96 }}
              transition={{ duration: 0.24 }}
            >
              <div className="week1-modal__head">
                <div>
                  <p className="week1-modal__eyebrow">Task Detail</p>
                  <h3>{selectedTask.title}</h3>
                </div>
                <button
                  type="button"
                  className="week1-modal__close"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </button>
              </div>

              <div className="week1-modal__meta">
                <p><strong>Task ID:</strong> {selectedTask._id}</p>
                <p><strong>Day:</strong> {selectedTask.day}</p>
                <p><strong>Week:</strong> {selectedTask.week}</p>
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Difficulty:</strong> {selectedTask.difficulty}</p>
              </div>

              <div className="week1-modal__block">
                <h4>Description</h4>
                <p>{selectedTask.description || 'No description added.'}</p>
              </div>

              <div className="week1-modal__block">
                <h4>Proof Note</h4>
                <p>{selectedTask.proof || 'No proof note added yet.'}</p>
              </div>

              <div className="week1-modal__block">
                <h4>Proof Screenshot</h4>
                {selectedTask.proofImage ? (
                  <div className="week1-modal__proof">
                    <img
                      src={resolveProofImageUrl(selectedTask.proofImage)}
                      alt={`${selectedTask.title} proof`}
                      className="week1-modal__proof-image"
                    />
                    <p className="week1-modal__proof-url">{resolveProofImageUrl(selectedTask.proofImage)}</p>
                  </div>
                ) : (
                  <p>No screenshot uploaded yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

export default Week1Page;

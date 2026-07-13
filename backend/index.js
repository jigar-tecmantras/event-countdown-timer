import express from 'express';
import cors from 'cors';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');
const API_PREFIX = '/api';

const ensureDataFile = async () => {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(DATA_FILE, '[]', 'utf-8');
    } else {
      throw error;
    }
  }
};

const readEvents = async () => {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Corrupted events store, resetting to empty array', error);
    await writeFile(DATA_FILE, '[]', 'utf-8');
    return [];
  }
};

const writeEvents = async (events) => {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
};

const validateEventPayload = (payload, { requireFuture = true } = {}) => {
  const errors = [];
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  if (!title) {
    errors.push({ field: 'title', message: 'Give the event a title.' });
  }

  const targetValue = payload.target ? String(payload.target).trim() : '';
  let normalizedTarget = '';
  if (!targetValue) {
    errors.push({ field: 'target', message: 'Provide a target date and time.' });
  } else {
    const parsed = new Date(targetValue);
    const timestamp = parsed.getTime();
    if (Number.isNaN(timestamp)) {
      errors.push({ field: 'target', message: 'Target date is invalid.' });
    } else if (requireFuture && timestamp <= Date.now()) {
      errors.push({ field: 'target', message: 'Target must sit in the future.' });
    } else {
      normalizedTarget = parsed.toISOString();
    }
  }

  return { errors, title, normalizedTarget };
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Event Countdown Timer API is running.');
});

app.get(`${API_PREFIX}/events`, async (req, res) => {
  try {
    const events = await readEvents();
    res.json({ events });
  } catch (error) {
    console.error('Failed to read events', error);
    res.status(500).json({ message: 'Unable to load events right now.' });
  }
});

app.post(`${API_PREFIX}/events`, async (req, res) => {
  const { errors, title, normalizedTarget } = validateEventPayload(
    { title: req.body.title, target: req.body.target },
    { requireFuture: true }
  );

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const events = await readEvents();
    const timestamp = new Date().toISOString();
    const newEvent = {
      id: crypto.randomUUID(),
      title,
      target: normalizedTarget,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    events.push(newEvent);
    await writeEvents(events);
    res.status(201).json({ event: newEvent });
  } catch (error) {
    console.error('Failed to store event', error);
    res.status(500).json({ message: 'Unable to save event right now.' });
  }
});

app.put(`${API_PREFIX}/events/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const events = await readEvents();
    const index = events.findIndex((event) => event.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const existing = events[index];
    const payloadTitle = typeof req.body.title === 'string' ? req.body.title : existing.title;
    const payloadTarget = typeof req.body.target === 'string' ? req.body.target : existing.target;

    const { errors, title, normalizedTarget } = validateEventPayload(
      { title: payloadTitle, target: payloadTarget },
      { requireFuture: typeof req.body.target === 'string' }
    );

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const updatedEvent = {
      ...existing,
      title,
      target: normalizedTarget,
      updatedAt: new Date().toISOString(),
    };
    events[index] = updatedEvent;
    await writeEvents(events);
    res.json({ event: updatedEvent });
  } catch (error) {
    console.error('Failed to update event', error);
    res.status(500).json({ message: 'Unable to update the event.' });
  }
});

app.delete(`${API_PREFIX}/events/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const events = await readEvents();
    const updated = events.filter((event) => event.id !== id);
    if (updated.length === events.length) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    await writeEvents(updated);
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete event', error);
    res.status(500).json({ message: 'Unable to delete the event.' });
  }
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
});

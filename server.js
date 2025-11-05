import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const COMMENTS_PATH = path.join(process.cwd(), 'src', 'assets', 'json-files', 'comments.json');

async function ensureCommentsFile() {
  try {
    await fs.writeFile(COMMENTS_PATH, '[]', { encoding: 'utf8' });
    console.log('comments.json cleared at startup');
  } catch (err) {
    console.error('Failed to initialize comments.json:', err);
  }
}

// init (clear file on server start)
await ensureCommentsFile();

app.get('/comments', async (req, res) => {
  try {
    const raw = await fs.readFile(COMMENTS_PATH, 'utf8');
    const data = JSON.parse(raw || '[]');
    res.json({ ok: true, comments: data });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post('/comments', async (req, res) => {
  try {
    const entry = req.body.entry;
    if (!entry) return res.status(400).json({ ok: false, error: 'Missing entry' });

    const raw = await fs.readFile(COMMENTS_PATH, 'utf8');
    const data = JSON.parse(raw || '[]');
    data.push(entry);
    await fs.writeFile(COMMENTS_PATH, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true, comments: data });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const PORT = process.env.COMMENTS_PORT || 3001;
app.listen(PORT, () => console.log(`Comments server listening on http://localhost:${PORT}`));

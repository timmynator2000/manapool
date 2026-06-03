const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Required for Railway / cloud hosting
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    anthropic_key_set: !!ANTHROPIC_KEY,
    anthropic_key_prefix: ANTHROPIC_KEY ? ANTHROPIC_KEY.slice(0, 16) + '...' : 'NOT SET'
  });
});

// Proxy: Claude API
app.post('/api/claude', async (req, res) => {
  if (!ANTHROPIC_KEY) {
    console.error('[Claude] ERROR: ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
  }
  console.log('[Claude] Sending request to Anthropic...');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('[Claude] API error:', response.status, JSON.stringify(data));
    } else {
      console.log('[Claude] Success');
    }
    res.status(response.status).json(data);
  } catch (e) {
    console.error('[Claude] Fetch error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Proxy: Scryfall GET
app.get('/api/scryfall/*', async (req, res) => {
  const scryfallPath = req.params[0];
  const query = req.url.split('?')[1] || '';
  const url = `https://api.scryfall.com/${scryfallPath}${query ? '?' + query : ''}`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Manapool/1.0' } });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    console.error('[Scryfall GET] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Proxy: Scryfall POST
app.post('/api/scryfall/*', async (req, res) => {
  const scryfallPath = req.params[0];
  const url = `https://api.scryfall.com/${scryfallPath}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Manapool/1.0' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    console.error('[Scryfall POST] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Explicit bind to 0.0.0.0 for cloud hosting
app.listen(PORT, HOST, () => {
  console.log(`\n  🌊 Manapool is running!`);
  console.log(`  Listening on: ${HOST}:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
  console.log(`  Anthropic key: ${ANTHROPIC_KEY ? '✓ Set (' + ANTHROPIC_KEY.slice(0,16) + '...)' : '✗ NOT SET'}\n`);
});

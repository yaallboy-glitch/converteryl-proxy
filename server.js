const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true, methods: ['POST','OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.options('*', (req, res) => res.sendStatus(204));
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 }, storage: multer.memoryStorage() });
app.post('/', upload.single('file'), async (req, res) => {
  try {
    const fd = new FormData();
    fd.append('request', req.body.request);
    fd.append('file', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
    const r = await fetch('https://apis.roblox.com/assets/v1/assets', { method: 'POST', headers: { 'x-api-key': req.body.api_key }, body: fd });
    const b = await r.text();
    res.status(r.status).set('Content-Type', 'application/json').send(b);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.listen(3000, () => console.log('Ready'));

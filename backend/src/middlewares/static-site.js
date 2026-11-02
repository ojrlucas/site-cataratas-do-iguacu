import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

const NON_API_PATH = /^\/(?!api\/).*/;

export function mountStaticSite(app, staticDir) {
  if (!staticDir || !fs.existsSync(staticDir)) return;
  app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
  app.get(NON_API_PATH, (_req, res) => res.sendFile(path.resolve(staticDir, 'index.html')));
}

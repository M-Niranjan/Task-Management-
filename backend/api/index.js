const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const info = {};

  try {
    // Check where we are
    info.cwd = process.cwd();
    info.dirname = __dirname;

    // Check if dist folder exists
    const distPath = path.join(__dirname, '..', 'dist');
    info.dist_path = distPath;
    info.dist_exists = fs.existsSync(distPath);

    if (info.dist_exists) {
      info.dist_files = fs.readdirSync(distPath);
    }

    // Check if node_modules exists
    const nmPath = path.join(__dirname, '..', 'node_modules');
    info.node_modules_exists = fs.existsSync(nmPath);

    // Try to load reflect-metadata
    try {
      require('reflect-metadata');
      info.reflect_metadata = 'OK';
    } catch (e) {
      info.reflect_metadata = e.message;
    }

    // Try to load @nestjs/core
    try {
      const nest = require('@nestjs/core');
      info.nestjs_core = 'OK - ' + Object.keys(nest).slice(0, 5).join(', ');
    } catch (e) {
      info.nestjs_core = e.message;
    }

    // Try to load AppModule from dist
    try {
      const appMod = require('../dist/app.module');
      info.app_module = 'OK - exports: ' + Object.keys(appMod).join(', ');
    } catch (e) {
      info.app_module = e.message;
    }

    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack, info });
  }
};

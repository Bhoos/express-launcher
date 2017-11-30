#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const loadSite = require('./loadSite');
const { startServer, registerSite } = require('./server');

const cwd = process.cwd();

async function main() {
  // TODO: Load sites from sites.json file
  if (fs.existsSync(path.resolve(cwd, 'sites.json'))) {
    const sites = JSON.parse(fs.readFileSync(path.resolve(cwd, 'sites.json')));
    Object.keys(sites).forEach(async (name) => {
      const url = sites[name];
      const site = await loadSite(url);
      const p = `/${name}`;
      console.log(`Mounted site ${site.name} at ${p}`);
      registerSite(p, site.name);
    });

    return startServer();
  }

  // Load a site from package.json
  if (fs.existsSync(path.resolve(cwd, 'package.json'))) {
    // const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
    const site = await loadSite(cwd);
    const p = '/';
    console.log(`Mounted site ${site.name} at ${p}`);
    registerSite(p, site.configureRouter);
    return startServer();
  }

  return null;
}

main();

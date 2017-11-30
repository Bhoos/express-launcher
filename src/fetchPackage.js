/* eslint-disable global-require, import/no-dynamic-require */
const { exec } = require('child_process');

module.exports = function fetchPackage(pkgUrl, cwd) {
  const url = pkgUrl;

  return new Promise((resolve, reject) => {
    exec(`npm install --no-save ${url}`, { cwd }, (err, stdout) => {
      if (err) {
        return reject(err);
      }

      const op = (/\+\s([^@]*)/.exec(stdout));
      if (op.length < 2) {
        return reject(new Error('Could not find package name in npm output'));
      }

      const pkgName = op[1];

      try {
        // Dynamically require the package
        const pkg = require(`${pkgName}/package.json`);
        const site = require(pkgName);

        // See if we have a configure router
        const configureRouter = site.configureRouter || site.default || site;
        if (typeof configureRouter !== 'function') {
          throw new Error(`Site router configuration method not found in ${pkgName}`);
        }

        // Return the package information
        return resolve({
          name: pkgName,
          version: pkg.version,
          configureRouter,
        });
      } catch (e) {
        return reject(e);
      }
    });
  });
};


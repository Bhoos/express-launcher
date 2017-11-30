# express-launcher
An express server launcher with multiple app and websocket support

# Usage
## Via command line
### Installation
> `$ npm install -g @bhoos/express-launcher`

After installation `express-launcher` is available to run
> `$ express-launcher`

### How to make it work
* `express-launcher` first searchs for `sites.json` in the working
directory, failing which it looks for `package.json` to launch a site.

* `sites.json` could be used to mount multiple sites at once. The json
should provide a key value pair where the key is used as the mounting 
point for the server and the value could be any valid npm package url -
(package name, git url, local file path, etc).
```json
{
  "site1": "demo1",
  "site2": "../../demo2",
}
```

* The `express-launcher` could directly launch `package.json` mouting 
the site at root.

* The package must provide either `configureRouter` function as a named
export or default export which should configure express router passed as
a parameter.

* The launcher uses npm to download the package to the launchers `node_modules` folder.

* The launcher run the web server at port 3000. The port could be changed
with `PORT` environment variable.  
`$ PORT=4000 express-launcher`

## Using as a library
The `express launcher` provides 3 methods `fetchPackage`, `registerSite`
and `startServer`. Use `fetchPackage` to load node modules. Mount each
individual package (configureRoute) using registerSite. And finally use
`startServer` to run the http server.

### Example
```javascript
import { 
  fetchPackage, registerSite, startServer
} from '@bhoos/express-launcher';


async function mountSites() {
  // Load packages via fetchPackage if required. Make sure the packages
  // provide configure router method
  const nodeModulesDir = path.resolve(__dirname, '../');
  const site = await fetchPackage('package-name or url', nodeModulesDir);

  // An optional options that can be passed to configureRouter
  const options = {}; 

  // registerSite just needs a configureRouter
  registerSite('/s1', site.configureRouter, options);

  // mount a site directly
  registerSite('/i', (router) => {
    router.get('/help', (req, res) => {
      res.send('Help');
    });
  });
}

// Start the server after all the sites have been mounted
mountSites.then(() => startServer());
```

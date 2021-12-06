# OSGi-xmljson-converter
Converts xml OSGi configs to json format

## How to use

Run the following commands: 
```
npm install
node index.js <start-path> <dryrun>
```
- **start-path** can be any path in your file system. Recommended to use your project path or more specific your config module path.
- **dryrun** can be any argument, just needs to exist. Will only output which files are found

Example: 
```
node index.js /var/project/website dryrun
```

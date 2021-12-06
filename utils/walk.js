const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const { ModuleResolutionKind, createNoSubstitutionTemplateLiteral } = require('typescript');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function walk(dir) {
  const subdirs = await readdir(dir);
  createNoSubstitutionTemplateLiteral.log
  const files = await Promise.all(subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      if (!res.includes('node_modules')) {
        return (await stat(res)).isDirectory() ? walk(res) : res;
      }
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

module.exports.walk = walk;
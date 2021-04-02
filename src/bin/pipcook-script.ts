#!/usr/bin/env node

import * as program from 'commander';
import { join, basename, resolve } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
// no types from `download-git-repo`
const execAsync = promisify(exec);

interface CMDOptions {
  type: string
}

function copy(src: string, dest: string): void {
  var stats = fs.statSync(src);
  var isDirectory = stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName: string) {
      copy(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

async function createScript(scriptType: string, scriptName: string, opts: CMDOptions): Promise<void> {
  try {
    const projectName = basename(scriptName);
    const destDir = resolve(scriptName);
    const pkgFile = join(destDir, 'package.json');
    if (fs.existsSync(destDir)) {
      throw new TypeError(`The directory ${scriptName} already exists`);
    }

    const templateType = basename(opts.type);
    const templateSrc = resolve(__dirname, '../../template', scriptType, templateType);
    if (fs.existsSync(templateSrc)) {
      copy(templateSrc, destDir);
      if (fs.existsSync(pkgFile)) {
        const pkg = JSON.parse(fs.readFileSync(pkgFile).toString());
        pkg.name = projectName;
        fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
        console.log('initializing project');
        await execAsync('npm i', { cwd: destDir });
      }
    } else {
      throw new TypeError(`no template '${opts.type}' found.`);
    }
    console.log('initialize script project successfully');
  } catch (err) {
    console.error(`create from template failed: ${err.message}`);
    process.exit(1);
  }
};
    
(async function(): Promise<void> {
  for (const scriptType of ['datasource', 'dataflow', 'model']) {
    program
      .command(`${scriptType} <scriptName>`)
      .option('-t --type <templeteType>', 'template type, \'js\' and \'ts\' are supported, \'ts\' for default.', 'ts')
      .description(`create pipcook ${scriptType} script from template.`)
      .action((scriptName: string, opts: CMDOptions) => createScript(scriptType, scriptName, opts));
  }
  program.parse(process.argv);
})();

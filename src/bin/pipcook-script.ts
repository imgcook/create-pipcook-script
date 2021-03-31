#!/usr/bin/env node

import * as program from 'commander';
import { join, basename, resolve } from 'path';
import { readJson, writeJson, pathExists } from 'fs-extra';
import { promisify } from 'util';
import { exec } from 'child_process';
// no types from `download-git-repo`
const download = promisify(require('download-git-repo'));
const execAsync = promisify(exec);

interface CMDOptions {
  type: string
}

const templateMap: Record<string, { projectName: string, defaultBranch: string, url: string }> = {
  datasource: {
    projectName: 'imgcook/pipcook-datasource-template',
    defaultBranch: 'main',
    url: 'https://github.com/imgcook/pipcook-datasource-template'
  },
  dataflow: {
    projectName: 'imgcook/pipcook-dataflow-template',
    defaultBranch: 'main',
    url: 'https://github.com/imgcook/pipcook-dataflow-template'
  },
  model: {
    projectName: 'imgcook/pipcook-model-template',
    defaultBranch: 'main',
    url: 'https://github.com/imgcook/pipcook-model-template'
  }
};

async function createScript(scriptType: string, scriptName: string, opts: CMDOptions): Promise<void> {
  try {
    const projectName = basename(scriptName);
    const destDir = resolve(scriptName);
    const pkgFile = join(destDir, 'package.json');
    if (await pathExists(destDir)) {
      throw new TypeError(`The directory ${scriptName} already exists`);
    }
    const branch = opts.type ? opts.type : templateMap[scriptType].defaultBranch;
    const template = `${templateMap[scriptType].projectName}#${branch}`;
    await download(template, destDir, { clone: true });
    if (await pathExists(pkgFile)) {
      const pkg = await readJson(pkgFile);
      pkg.name = projectName;
      await writeJson(pkgFile, pkg, { spaces: 2 });
      console.log('initializing project');
      await execAsync('npm i', { cwd: destDir });
    }
    console.info('initialize script project successfully');
  } catch (err) {
    console.error(`create from template failed: ${err.message}`);
    process.exit(1);
  }
};
    
(async function(): Promise<void> {
  for (const key in templateMap) {
    program
      .command(`${key} <scriptName>`)
      .option('-t --type <templeteType>')
      .description(`create pipcook ${key} script from template. Find templetes here: ${templateMap[key].url}`)
      .action((scriptName: string, opts: CMDOptions) => createScript(key, scriptName, opts));
  }
  program.parse(process.argv);
})();

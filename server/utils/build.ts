import shell from 'shelljs'
import path from 'path'
import fs from 'fs-extra'
import { parse } from 'es-module-lexer/js';

export const PACKAGES_PATH = path.join(process.cwd(), "packages")

const getPackage = (config: any) => {
  return {
    name: config.name,
    version: config.version,
    description: config.description,
    type: "module",
    scripts: {
      build: "vite build"
    },
    publishConfig: {
      "access": "public"
    },
    files: [
      "dist",
      "README.md",
      "package.json"
    ]
  }
}
const getViteConfig = (config: any) => {
  return `import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: '${config.name}',
      fileName: '${config.fileName}',
      formats: ["iife"],
    },
  },
})`
}

const parseDependencies = (content: string) => {
  const [imports] = parse(content, 'optional-sourcename');
  let items = []
  for (let i = 0; i < imports.length; i++) {
    items.push(imports[i].n)
  }
  return items;
}

export const build = async (config: any, content: string) => {
  const pkgPath = path.join(PACKAGES_PATH, config.name)
  let results: any = [];
  results.push(shell.echo("Starting to build..."));
  const exec = (command: string) => {
    return new Promise((resolve) => {
      shell.exec(command, { cwd: pkgPath }, (code, stdout, stderr) => {
        if (stdout != null) {
          results.push(stdout)
        }
        if (stderr != null) {
          results.push(stderr)
        }
        resolve(code);
      });
    });
  }
  fs.ensureDirSync(path.join(pkgPath, "src"))
  fs.writeFileSync(path.join(pkgPath, "src", "main.js"), content)
  let pkg = getPackage(config)
  fs.writeJSONSync(path.join(pkgPath, "package.json"), pkg, { spaces: 2 })
  fs.writeFileSync(path.join(pkgPath, "vite.config.js"), getViteConfig(config))
  if (await exec("bun install")) {
    return results;
  }
  let dependencies = parseDependencies(content)
  for (let i = 0; i < dependencies.length; i++) {
    if (await exec(`bun install --save-dev ${dependencies[i]}`)) {
      return results;
    }
  }
  fs.copyFileSync(path.join(pkgPath, "node_modules", config.name, 'README.md'), path.join(pkgPath, 'README.md'))
  if (await exec("bun run build")) {
    return results;
  }
  if (config.pack) {
    if (await exec("bun pm pack")) {
      return results;
    }
  }
  if (config.publish) {
    if (await exec("bun publish")) {
      return results;
    }
  }
  return results;
}
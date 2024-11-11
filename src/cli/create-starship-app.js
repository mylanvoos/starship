#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prompts from 'prompts'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function copyDir(src, destination) {
  fs.mkdirSync(destination, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destinationPath = path.join(destination, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destinationPath)
    } else {
      fs.copyFileSync(srcPath, destinationPath)
    }
  }
}

async function main() {
  try {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'starship-app',
      validate: value => (value ? true : 'Project name cannot be empty.'),
    });

    const projectName = response.projectName.trim()
    if (!projectName) {
      console.error('Project name is required.')
      process.exit(1)
    }

    const projectPath = path.join(process.cwd(), projectName)

    if (fs.existsSync(projectPath)) {
      console.error(
        `Directory "${projectName}" already exists. Please choose a different project name.`
      );
      process.exit(1)
    }

    fs.mkdirSync(projectPath, { recursive: true })

    const templateDir = path.join(__dirname, '../../templates');

    if (!fs.existsSync(templateDir)) {
      console.error('Templates directory not found. Ensure that "templates" is included in the package.');
      process.exit(1)
    }

    copyDir(templateDir, projectPath)

    const packageJson = {
      name: projectName,
      version: '0.1.0',
      type: 'module',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        'starship-jsx': '^0.1.0',
      },
      devDependencies: {
        vite: '^5.0.0',
        '@types/node': '^20.0.0',
        typescript: '^5.0.0',
      },
    }

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )

    console.log('Installing dependencies...')

    execSync('npm install', { cwd: projectPath, stdio: 'inherit' })

    console.log(`
🎉 Project "${projectName}" created successfully!

🚀 To get started:
  cd ${projectName}
  npm run dev
    `)
  } catch (error) {
    console.error('An error occurred while creating the project:', error)
    process.exit(1)
  }
}

main()

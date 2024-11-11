const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const { execSync } = require('child_process')

async function main() {
    const response = await prompts({
        type: 'text',
        name: 'projectName',
        message: 'What is your project name?',
        initial: 'starship-app'
    })

    const projectName = response.projectName
    const projectPath = path.join(process.cwd(), projectName)

    fs.mkdirSync(projectPath, { recursive: true })

    const templateDir = path.join(__dirname, '../templates')
    copyDir(templateDir, projectPath)

    const packageJson = {
        name: projectName,
        version: '0.1.0',
        private: true,
        scripts: {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        dependencies: {
          "starship-jsx": "^1.1.1"
        },
        devDependencies: {
          "vite": "^5.0.0",
          "@types/node": "^20.0.0",
          "typescript": "^5.0.0"
        }
    }
    
    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    )

    console.log('Installing dependencies...')
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' })

    console.log(`
    Project ${projectName} created successfully!

    To get started:
        cd ${projectName}
        npm run dev
    `)

    function copyDir(src, destination) {
        fs.mkdirSync(destination, { recursive: true })
        const entries = fs.readdirSync(src, { withFileTypes: true })

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name)
            const destinationPath = path.join(destination, entry.name)

            if (entry.isDirectory()) {
                copyDir(srcPath, destinationPath)
            } else {
                fs.copyFileSync(srcPath, destinationPath)
            }
        }
    }

    main().catch(console.error)
}
#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, colors.bright + colors.cyan);
    console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
    log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
    log(`⚠️  ${message}`, colors.yellow);
}

function logError(message) {
    log(`❌ ${message}`, colors.red);
}

function runCommand(command, description, options = {}) {
    try {
        log(`Running: ${description}...`);
        execSync(command, {
            stdio: 'inherit',
            shell: true,
            ...options
        });
        logSuccess(`${description} completed`);
        return true;
    } catch (error) {
        logError(`${description} failed`);
        if (options.critical !== false) {
            throw error;
        }
        return false;
    }
}

function checkCommand(command, name) {
    try {
        execSync(command, { stdio: 'ignore' });
        logSuccess(`${name} is installed`);
        return true;
    } catch (error) {
        logError(`${name} is not installed or not in PATH`);
        return false;
    }
}

async function main() {
    const platform = os.platform();
    const isWindows = platform === 'win32';
    const pythonCmd = isWindows ? 'python' : 'python3';
    const pipCmd = isWindows ? 'pip' : 'pip3';

    logSection('D&D Adventure Generator - Multi-Platform Setup');
    log(`Platform: ${platform}`);
    log(`Architecture: ${os.arch()}`);
    log(`Node.js: ${process.version}`);

    // Step 1: Check prerequisites
    logSection('Step 1: Checking Prerequisites');

    const nodeOk = checkCommand('node --version', 'Node.js');
    const pythonOk = checkCommand(`${pythonCmd} --version`, 'Python');
    const npmOk = checkCommand('npm --version', 'npm');

    if (!nodeOk || !pythonOk || !npmOk) {
        logError('\nMissing required dependencies. Please install:');
        if (!nodeOk) log('  - Node.js (v18+): https://nodejs.org/');
        if (!pythonOk) log('  - Python (v3.11+): https://www.python.org/');
        if (!npmOk) log('  - npm (comes with Node.js)');
        process.exit(1);
    }

    // Verify Python version
    try {
        const pythonVersion = execSync(`${pythonCmd} --version`, { encoding: 'utf8' });
        const versionMatch = pythonVersion.match(/Python (\d+)\.(\d+)/);
        if (versionMatch) {
            const major = parseInt(versionMatch[1]);
            const minor = parseInt(versionMatch[2]);
            if (major < 3 || (major === 3 && minor < 11)) {
                logError(`Python 3.11+ is required. Found: ${pythonVersion.trim()}`);
                process.exit(1);
            }
            logSuccess(`Python version: ${pythonVersion.trim()}`);
        }
    } catch (error) {
        logWarning('Could not verify Python version');
    }

    // Step 2: Install frontend dependencies
    logSection('Step 2: Installing Frontend Dependencies');
    runCommand('npm install', 'npm install');

    // Step 3: Setup Python backend
    logSection('Step 3: Setting Up Python Backend');

    const backendPath = path.join(process.cwd(), 'python-backend');
    const venvPath = path.join(backendPath, 'venv');

    if (!fs.existsSync(backendPath)) {
        logError('python-backend directory not found!');
        process.exit(1);
    }

    // Create virtual environment
    if (!fs.existsSync(venvPath)) {
        runCommand(
            `${pythonCmd} -m venv "${venvPath}"`,
            'Creating Python virtual environment'
        );
    } else {
        logSuccess('Virtual environment already exists');
    }

    // Install Python dependencies
    const activateCmd = isWindows
        ? `"${path.join(venvPath, 'Scripts', 'activate.bat')}"`
        : `. "${path.join(venvPath, 'bin', 'activate')}"`;

    const pipInstallCmd = isWindows
        ? `cd python-backend && ${path.join('venv', 'Scripts', 'python.exe')} -m pip install -r requirements.txt`
        : `cd python-backend && ${path.join('venv', 'bin', 'python')} -m pip install -r requirements.txt`;

    runCommand(
        pipInstallCmd,
        'Installing Python dependencies'
    );

    // Step 4: Verify installation
    logSection('Step 4: Verifying Installation');

    const frontendOk = fs.existsSync('node_modules');
    const backendOk = fs.existsSync(venvPath);

    if (frontendOk) logSuccess('Frontend dependencies installed');
    if (backendOk) logSuccess('Python backend configured');

    // Final instructions
    logSection('🎉 Setup Complete!');
    log('To start development:');
    log('  1. Start the frontend: npm run dev', colors.cyan);
    log('  2. Start the backend:  npm run backend', colors.cyan);
    log('');
    log('To build for production:');
    log('  - Build frontend: npm run build', colors.cyan);
    log('  - Build backend:  npm run build:backend', colors.cyan);
    log('');
    log('To launch the setup dashboard:');
    log('  - npm run setup:dashboard', colors.cyan);
    log('');
    logSuccess('Happy adventuring! 🎲');
}

// Run the setup
main().catch(error => {
    logError('\nSetup failed with error:');
    console.error(error);
    process.exit(1);
});

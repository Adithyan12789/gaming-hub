# OneDrive Development Fix

## Issue
OneDrive sync conflicts with Next.js development files in the `.next` directory, causing EPERM errors.

## Solutions

### Option 1: Use the batch file (Recommended)
Double-click `dev.bat` to start the development server. This script:
- Cleans any locked `.next` directories
- Starts the development server with proper file handling

### Option 2: Move project outside OneDrive
Move the entire project folder to a location outside OneDrive, such as:
- `C:\Projects\gaming-hub`
- `C:\dev\gaming-hub`

### Option 3: Exclude from OneDrive sync
1. Right-click the project folder in File Explorer
2. Select "Always keep on this device" or "Free up space"
3. This prevents OneDrive from syncing build files

### Option 4: Use Windows Terminal/Command Prompt
Instead of PowerShell, use Command Prompt or Windows Terminal:
```cmd
cd C:\Users\adith\OneDrive\Desktop\Projects\gaming-hub
node_modules\.bin\next.cmd dev
```

## Current Configuration
The project is configured to:
- Use `../.next-dev` as the build directory in development
- Exclude build directories from git tracking
- Provide a batch file for easy startup

## If problems persist
1. Close all terminals and VS Code
2. Delete the `.next` directory manually
3. Use the `dev.bat` file to restart
# Location Guessing Game

## Overview
This project is a Geography Guessing Game built with React and Vite. Players take turns guessing a target location on a map. The game is designed to be interactive and visually appealing with Tailwind CSS for styling.

## Project Structure
Your project should have the following structure:
```
location-guessing-game/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── components/
│       └── LocationGame.jsx
```

## Setup Instructions

### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org). Make sure to include npm in the installation.

### 2. Clone the Repository
- Open your terminal or command prompt and run the following command:
```bash
git clone https://github.com/mschnati/LocationGuessingGame.git
cd location-guessing-game
```

### 3. Install Dependencies
- Run the following command to install the required packages:
```bash
npm install
```

### 4. Start the Development Server
- Start the server with:
```bash
npm run dev
```
- Open your browser and navigate to:
```
http://localhost:5173
```

## Accessing from Different Devices
To access the game from other devices on the same network:
1. Find your local IP address using the command:
   ```bash
   ipconfig  # for Windows
   ifconfig  # for Linux
   ```
2. Look for the IPv4 address of your active network connection (e.g., `192.168.10.204`).
3. On your tablet or other devices, open a web browser and enter:
   ```
   http://<your-local-ip>:5173
   ```

## Installing npm on Windows and Linux
- **Windows**:
  1. Download and run the Node.js installer from [nodejs.org](https://nodejs.org).
  2. Follow the installation instructions. npm will be installed along with Node.js.

- **Linux**:
  1. Open your terminal.
  2. Update your package index:
     ```bash
     sudo apt update
     ```
  3. Install Node.js and npm:
     ```bash
     sudo apt install nodejs npm
     ```

## Common Issues & Solutions
1. If you encounter module not found errors, run:
   ```bash
   npm install
   ```
2. If the development server doesn't start, check if another process is using port 5173. You may need to kill that process.
3. If Tailwind styles aren't applied, ensure `index.css` is imported in `main.jsx` and that all configuration files are in the root directory.

## Development
- Modify the game logic and design in `src/components/LocationGame.jsx`.
- The development server will automatically reload when you save changes.
- Use `npm run build` when you're ready to deploy.

## Version Control
Make sure to include the following files in your Git repository:
- All source files in the `src` directory
- `package.json`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`

You may choose to include the `package-lock.json` file, which helps to lock the versions of your dependencies, ensuring that everyone working on the project uses the same package versions.

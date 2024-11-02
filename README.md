# Location Guessing Game

## Overview
Small game i put together for a friend to use on a quiz night to have players guess a location on an image based on a question that was asked.

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
   - [Installing npm](#installing-npm)
3. [Usage](#usage)
4. [Accessing the Game from Other Devices](#accessing-the-game-from-other-devices)
5. [Game Rules](#game-rules)

## Features
- Add multiple players with unique colors.
- Upload an image to use as the game board.
- Players take turns guessing the target location.
- Visual feedback on guesses, including distance from the target.

## Getting Started

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your computer. This will also install npm (Node Package Manager) automatically.

### Installing npm
#### On Windows:
1. Download the Node.js installer from the [official website](https://nodejs.org/en/download/).
2. Run the installer and follow the setup steps.
3. Verify the installation by opening Command Prompt and running:
   ```bash
   node -v
   npm -v
   ```

#### On Linux:
1. Open a terminal and run:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```
2. Verify the installation by running:
   ```bash
   node -v
   npm -v
   ```

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd location-guessing-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to `http://localhost:5173` to access the game.

## Usage

### Setting Up the Game
1. **Add Players:**
   - Enter a player's name in the input field and click "Add Player."
   - Repeat this step for each player you want to add (up to a maximum of 10 players).

2. **Upload an Image:**
   - Click on the file input to upload an image that will serve as the game map.

3. **Set the Target Location:**
   - Once the image is uploaded, click on the image to set the target location.

4. **Start the Game:**
   - Click the "Start Game" button when at least two players have been added and the target location has been set.

### Playing the Game
- Players will take turns clicking on the image to make their guesses.
- After all players have guessed, click the "Reveal Results" button to see the distances from the target location.
- The game shows the top three closest guesses and their respective distances.

## Accessing the Game from Other Devices
To allow other devices on your local network to access the game:

1. **Find Your Local IP Address:**
   - Open Command Prompt and run:
     ```bash
     ipconfig # for Windows
     ifconfig # for Linux
     ```
   - Look for the "IPv4 Address" under the appropriate network adapter (e.g., Ethernet or Wi-Fi).

2. **Access the Game:**
   - From another device on the same network, open a web browser and enter:
     ```
     http://<Your-IP-Address>:5173
     ```
   - Replace `<Your-IP-Address>` with the actual IPv4 address you found in the previous step.

   - If you are not able to connect you might have to open the port 5172 on your host machines firewall

## Game Rules
1. Players can only make one guess per round.
2. The game continues until all players have made their guesses.
3. After revealing the results, players can start a new game by clicking the "New Game" button.
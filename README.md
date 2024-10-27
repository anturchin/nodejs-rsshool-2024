# ws-battleship

A WebSocket-based Battleship game that allows players to connect, create or join rooms, place ships, and play against each other in real-time.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Scripts](#scripts)
- [Usage](#usage)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 22 or higher recommended)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Project Structure

The project consists of two main components:

- **server/**: Handles the game server logic, player registration, game rooms, and game state.
- **client/**: Provides the frontend client that connects to the WebSocket server for gameplay.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ws-battleship
   ```

2. **Install dependencies:** In the root project folder, install the required dependencies by running:
   ```bash
   npm install
   ```
This will install concurrently, which is used to run both the server and client applications simultaneously.

3. **Install dependencies for server and client:** Go into each folder to install the required packages for each component:
   ```bash
    cd server
    npm install
   ```
   ```bash
    cd ../client
    npm install
   ```

## Scripts
The project includes the following script in the main `package.json` file:

- `npm run dev:` Runs the server and client applications concurrently in development mode. This is the main command to start the app.

## Usage

1. **Start the Application:** In the project root directory, run:
   ```bash
   npm run dev
   ```
- This will start both the WebSocket server (running on port specified in server/index.js or the code) and the client.
- The client should be accessible at http://localhost:8181

2. **Connecting to the Game:** Open the client in a web browser to connect to the game server. Players can then register, create or join rooms, place ships, and start playing.

3. **Stopping the Application:** To stop the application, press Ctrl + C in the terminal.

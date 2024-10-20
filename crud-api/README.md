# CRUD API

A simple CRUD API built with Node.js and TypeScript.

## Features

- CRUD operations for managing resources.
- Clustering support for handling multiple processes.
- Environment-based configurations using `dotenv`.
- TypeScript support with proper type-checking.
- Testing with Jest.
- Code formatting with Prettier.
- Linting with ESLint.

## Requirements

- Node.js (v22 or newer)
- npm (v10 or newer)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crud-api.git

2. Navigate to the project directory:
    ```bash
    cd crud-api

3. Install the dependencies::
    ```bash
    npm install
   
## Environment Variables

- Before running the application, create a .env file in the root of the project and specify the following environment variables:
   ```bash
    PORT=3000
- You can adjust the PORT variable according to your requirements.

## Running the Application

The application can be run in different modes depending on your environment.

**Development Mode**
- To run the application in development mode with automatic restarts on file changes, use nodemon:
    ```bash
    npm run start:dev

**Production Mode**
- To build the TypeScript code and run the application in production:
    ```bash
    npm run start:prod

**Multi-Process Mode (Clustering)**
- To run the application in multi-process mode using Node.js cluster for better performance:
    ```bash
    npm run start:multi

**Running Tests**
- The application uses jest for unit testing. To run all tests:
    ```bash
    npm run test

**Linting and Formatting**
- To check the code for linting errors and automatically fix them:
    ```bash
    npm run lint
- To format the code according to Prettier's rules:
    ```bash
    npm run format

**Type-Checking**
- To perform type-checking without emitting any output:
    ```bash
    npm run type-check
  
**Folder Structure**
- The project follows a simple folder structure:
    ```bash
    src/
    ├── common/           # Common utilities (logger, constants, heplpers.)
    ├── controllers/      # Controllers for handling requests
    ├── db/               # In memory database
    ├── models/           # Models representing data entities
    ├── routes/           # Route definitions
    ├── services/         # Business logic services
    └── main.ts           # Application entry point

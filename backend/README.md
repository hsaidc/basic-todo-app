# ToDo App Backend

## Overview

This repository contains the backend code for a ToDo application. It is designed to manage tasks, allowing users to create, read, update, and delete (CRUD) their to-dos.

## Features

- **User Authentication**: Secure login, registration, and password reset functionalities.
- **Task Management**: Users can add, view, edit, and delete tasks.
- **Search**: Users can search for tasks by keywords.
- **Sort**: Tasks can be sorted by their creation date.

## Technologies Used

- **Node.js**: For the server-side logic.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing task data.
- **JWT**: For secure user authentication.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hsaidc/basic-todo-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd basic-todo-app/backend
   ```

3. Install required packages

   ```bash
   npm install
   ```

4. Create a copy of `.env.example` file and update required information.

   ```bash
   cp .env.example .env
   # Fill in the required variables in .env file
   vim .env
   ```

5. Run server

   ```bash
   npm run start
   ```

6. Test your server
   ```bash
   source .env
   curl $BASE_URL
   # You should see:
       # {"status":"true","msg":"Server is UP!"}
   # if your environment variables set correctly.
   ```

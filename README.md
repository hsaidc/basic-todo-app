# ToDo App Backend

## Overview

This repository contains the frontend and backend code for a basic ToDo application. It is designed to manage tasks, allowing users to create, read, update, and delete (CRUD) their to-dos. You can test this app by simply executing `docker compose up -d` if docker is installed on your machine. If you want to install docker, please visit [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/) and follow the instructions.

You can test this app at: [https://todo.hsaidcankurtaran.com.tr](https://todo.hsaidcankurtaran.com.tr).

## Features

- **User Authentication**: Secure login, registration, and password reset functionalities.
- **Task Management**: Users can add, view, edit, and delete tasks.
- **Search**: Users can search for tasks by keywords.
- **Sort**: Tasks can be sorted by their creation date.

## Technologies Used

- **Frontend**:
  - **React.js**: For building the user interface.
- **Backend**:
  - **Node.js**: For the server-side logic.
  - **Express.js**: Web application framework for Node.js.
  - **MongoDB**: NoSQL database for storing task data.
  - **JWT**: For secure user authentication.

## Getting Started

### Prerequisites

- Docker

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hsaidc/basic-todo-app.git
   ```

1. Navigate to the cloned repository

   ```bash
   cd basic-todo-app
   ```

1. Make sure ports `3000`, `3001` and `27017` are not in use. If they are, update ports specified in `Dockerfile` and `docker-compose.yml` files accordingly.
1. Execute (This may take a while as it will download the MongoDB image, and create backend and frontend images.)

   ```bash
   docker compose up -d
   ```

1. Once the containers are up and running, visit the app at: [http://localhost:3000](http://localhost:3000)

## Directory Structure

- `/frontend`: Contains all the source code for the frontend part of the application.
- `/backend`: Contains all the source code for the backend part of the application.
- `docker-compose.yml`: Defines the services, networks, and volumes for a Docker application.
- `Dockerfile`: Used to build Docker images for the frontend and backend services.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This software is licensed under the MIT License.

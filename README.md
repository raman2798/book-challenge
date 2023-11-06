# Book Challenge Service

This is the repository for the Book Challenge Service.

## Getting Started

### Installation intructions:

1. Clone the repo:

```bash
git clone https://github.com/raman2798/book-challenge.git

cd book-challenge
```

2. Install node and npm

3. run

```
npm install
```

4. Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Start server on localhost

```bash
npm run start
```

## Project Structure

```
postmanExportFile\  # Postman Export Files (collections and environment)
src\
 |--config\             # Environment variables and configuration related things
 |--controllers\        # Route controllers (controller layer)
 |--middlewares\        # Middlewares (middlewares layer)
 |--models\             # Models (database layer)
 |--routes\             # Routes
 |--services\           # all types of services
 |--utils\              # all types of utils
 |--validations\        # all types of validations
 |--index.js            # App entry point
```

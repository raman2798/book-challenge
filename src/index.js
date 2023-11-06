const cors = require('cors');
const express = require('express');
const { NOT_FOUND } = require('http-status');
const mongoose = require('mongoose');
const {
  appConfiguration: { port, mongoDB },
  loggerConfiguration,
} = require('./config');
const { globalErrorHandlerMiddleware } = require('./middlewares');
const routes = require('./routes');

const startServer = async () => {
  try {
    // Create the Express application
    const app = express();

    // Add middleware to parse json request body
    app.use(express.json());

    // Add middleware to parse urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // Add middleware to enable cors
    app.use(cors());

    // Enable CORS preflight for all routes
    app.options('*', cors());

    // Add API routes
    app.use('/v1', routes);

    // Send back a 404 error for any unknown API request
    app.use((req, res, next) => {
      next({ statusCode: NOT_FOUND, message: 'Not found' });
    });

    // Define global error handler
    app.use(globalErrorHandlerMiddleware);

    // Connect to MongoDB
    await mongoose.connect(mongoDB.url, mongoDB.options);

    loggerConfiguration.info('Connected to MongoDB');

    // Start the server
    const server = app.listen(port, () => {
      loggerConfiguration.info(`Listening on port ${port}...`);
    });

    // Handle server shutdown gracefully
    const exitHandler = () => {
      server.close(() => {
        loggerConfiguration.info('Server closed');

        process.exit(0);
      });
    };

    // Handle uncaught exceptions and unhandled rejections
    const unexpectedErrorHandler = (error) => {
      loggerConfiguration.error('Error:', error);

      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);

    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    loggerConfiguration.error('Failed to start server:', error);

    process.exit(1);
  }
};

// Start the server
startServer();

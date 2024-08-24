const setupDatabase = require('./db'); // Adjust the path as needed
const logger = require('./logger');
const transporter = require('./mailer');

let db; // Define a variable to hold the database connection

// Initialize the database connection
(async () => {
  try {
    db = await setupDatabase();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
})();

// Export the initialized modules
module.exports = {
  db,
  logger,
  transporter,
};

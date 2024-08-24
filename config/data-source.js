const { Sequelize } = require('sequelize');
const AWS = require('aws-sdk');

// Initialize the Secrets Manager client
const secretsManager = new AWS.SecretsManager({
  region: 'ap-south-1', // Replace with your region
});

// Function to get the secret
async function getSecret() {
  try {
    const secretName = 'myRdsSecrets'; // Replace with your secret name
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      let buff = new Buffer.from(data.SecretBinary, 'base64');
      return JSON.parse(buff.toString('ascii'));
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    throw err;
  }
}

// Create a Sequelize instance
async function createSequelizeInstance() {
  try {
    const secret = await getSecret();
    
    const sequelize = new Sequelize(
      secret.dbname || 'bgv',
      secret.username,
      secret.password,
      {
        host: secret.host,
        port: secret.port || 3306, // Default to 3306 if not set
        dialect: 'mysql',
        dialectModule: require('mysql2'), // Explicitly use mysql2 for Sequelize
      }
    );

    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    return sequelize;
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
}

module.exports = createSequelizeInstance();

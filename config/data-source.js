const { Sequelize } = require('sequelize');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName) => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        if (data.SecretString) {
            return JSON.parse(data.SecretString);
        }
        throw new Error('SecretString is empty');
    } catch (err) {
        console.error('Error retrieving secret:', err);
        throw err;
    }
};

const setupDatabase = async () => {
    const secretName = 'myRdsSecrets'; // Replace with your actual secret name
    const secrets = await getSecret(secretName);

    const sequelize = new Sequelize(secrets.dbname, secrets.username, secrets.password, {
        host: secrets.host,
        dialect: 'mysql',
        port: secrets.port,
        logging: false, // Disable SQL query logging
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

module.exports = setupDatabase;

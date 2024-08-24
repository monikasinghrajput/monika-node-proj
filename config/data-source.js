const { Sequelize } = require('sequelize');
const AWS = require('aws-sdk');

const SecretsManager = new AWS.SecretsManager();

async function getRDSSecrets() {
  const secretName = 'rds-db-credentials/awseb-e-i6edbiy8te-stack-awsebrdsdatabase-viwwidl6767v/admin/1724434328596';
  try {
    const data = await SecretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    throw err;
  }
}

(async () => {
  const secrets = await getRDSSecrets();
  const sequelize = new Sequelize(
    process.env.RDS_DB_NAME,
    secrets.username,
    secrets.password,
    {
      host: process.env.RDS_HOSTNAME,
      port: process.env.RDS_PORT || 3306,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
    }
  );

  // Test the connection
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }

  module.exports = sequelize;
})();

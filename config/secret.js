const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "ap-south-1" // Update this to your AWS region
});

async function getSecretValue(secretName) {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    if ("SecretString" in response) {
      return JSON.parse(response.SecretString);
    } else {
      // Handle binary secrets if needed
      throw new Error('Secrets Manager returned binary secrets, which is not supported.');
    }
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}

const SECRET_NAME = 'myRdsSecrets'; // Update this with your secret name

async function loadSecrets() {
  const secrets = await getSecretValue(SECRET_NAME);
  return {
    username: secrets.username,
    password: secrets.password,
    host: secrets.host,
    port: secrets.port,
    dbname: secrets.dbname
  };
}

module.exports = loadSecrets;

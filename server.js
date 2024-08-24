const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const Sequelize = require('sequelize');
const path = require('path');

// Initialize AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({ region: 'ap-south-1' });

// Function to get the secret from AWS Secrets Manager
async function getSecretValue(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      let buff = Buffer.from(data.SecretBinary, 'base64');
      return JSON.parse(buff.toString('ascii'));
    }
  } catch (err) {
    console.error(`Error retrieving secret: ${err}`);
    throw err;
  }
}

// Create Express app
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define your routes
app.use('/_alive', (req, res) => {
  res.status(200).send('Welcome to vitsinco.com');
});

// Define all your routers here
const userRouter = require('./api/user/user-route');
const candidateRouter = require('./api/candidate/candidate-route');
const candidateAddressRouter = require('./api/candidate-address/candidate-address-route');
const candidateCibilRouter = require('./api/candidate-cibil/candidate-cibil-route');
const candidateDocsRouter = require('./api/candidate-docs/candidate-docs-route');
const candidateEductionRouter = require('./api/candidate-eduction/candidate-eduction-route');
const candidateReferenceRouter = require('./api/candidate-reference/candidate-reference-route');
const candidateVerificationRouter = require('./api/candidate-verification/candidate-verification-route');
const clientRouter = require('./api/client/client-route');
const featureRouter = require('./api/feature/feature-route');
const internalTeamRouter = require('./api/internal-team/internal_team-route');
const locationRouter = require('./api/locationCSC/locationRoutes');
const workingRouter = require('./api/WorkingExperiance/work-experience-routes');
const fatherRouter = require('./api/fatherdoc/fathers-documents-routes');
const teamRegRouter = require('./api/TeamRegistration/teamRoutes');

app.use('/users', userRouter);
app.use('/candidate', candidateRouter);
app.use('/candidate-address', candidateAddressRouter);
app.use('/candidate-cibil', candidateCibilRouter);
app.use('/candidate-docs', candidateDocsRouter);
app.use('/candidate-education', candidateEductionRouter);
app.use('/candidate-reference', candidateReferenceRouter);
app.use('/candidate-verification', candidateVerificationRouter);
app.use('/client', clientRouter);
app.use('/feature', featureRouter);
app.use('/internal-team', internalTeamRouter);
app.use('/location', locationRouter);
app.use('/workingExp', workingRouter);
app.use('/fathers-document', fatherRouter);
app.use('/team-registration', teamRegRouter);

// Initialize Sequelize
let sequelize;

app.use(async (req, res, next) => {
  try {
    const secretName = 'myRdsSecrets'; // Replace with your secret name
    const secret = await getSecretValue(secretName);

    sequelize = new Sequelize(
      secret.dbname || 'bgv',
      secret.username,
      secret.password,
      {
        host: secret.host,
        port: secret.port || 3306,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
      }
    );

    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    next();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).send('Error connecting to the database');
  }
});

// Start the server locally for testing (this part will not be used in Lambda)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

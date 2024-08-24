const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const sequelize = require('./config/data-source'); // Make sure this file is updated to use environment variables
const passport = require('./config/auth');
const path = require('path');

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
const WorkingRouter = require('./api/WorkingExperiance/work-experience-routes');
const FatherRouter = require('./api/fatherdoc/fathers-documents-routes');
const TeamregRouter = require('./api/TeamRegistration/teamRoutes');

// Initialize AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({ region: 'ap-south-1' });

async function getSecretValue(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      let buff = new Buffer.from(data.SecretBinary, 'base64');
      return JSON.parse(buff.toString('ascii'));
    }
  } catch (err) {
    console.error(`Error retrieving secret: ${err}`);
    throw err;
  }
}

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(awsServerlessExpressMiddleware.eventContext());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/_alive', async (req, res) => {
  res.status(200).send('Welcome to vitsinco.com');
});

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
app.use('/workingExp', WorkingRouter);
app.use('/fathers-document', FatherRouter);
app.use('/internal-team', TeamregRouter);

// Sync database
app.use(async (req, res, next) => {
  try {
    const secretName = 'rds-db-credentials/awseb-e-i6edbiy8te-stack-awsebrdsdatabase-viwwidl6767v/admin/1724434328596';
    const secret = await getSecretValue(secretName);

    // Update sequelize configuration with secret values
    sequelize.config.host = 'lambda-rds-db.cduywgy8wxd9.ap-south-1.rds.amazonaws.com';
    sequelize.config.user = secret.username;
    sequelize.config.password = secret.password;
    sequelize.config.database = 'bgverification';
    sequelize.config.port = 3306;

    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    next();
  } catch (err) {
    console.error('Error syncing database:', err);
    res.status(500).send('Error syncing database');
  }
});

// Start the server locally for testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'lambda-rds-db.cduywgy8wxd9.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: 'your_password',
  database: 'your_database'
});

exports.handler = (event, context, callback) => {
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      callback(null, {
        statusCode: 500,
        body: 'Error syncing database'
      });
      return;
    }
    console.log('Connected to the database');
    // Perform database operations here

    // End the connection
    connection.end(err => {
      if (err) {
        console.error('Error ending the connection:', err);
        callback(null, {
          statusCode: 500,
          body: 'Error syncing database'
        });
        return;
      }
      callback(null, {
        statusCode: 200,
        body: 'Database operation successful'
      });
    });
  });
};

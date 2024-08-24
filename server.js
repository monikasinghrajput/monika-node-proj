<<<<<<< HEAD

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/data-source");
const cors = require("cors");
const passport = require("./config/auth");
const unless = require("express-unless");
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const app = express();

const userRouter = require("./api/user/user-route");
const candidateRouter = require("./api/candidate/candidate-route");
const candidateAddressRouter = require("./api/candidate-address/candidate-address-route");
const candidateCibilRouter = require("./api/candidate-cibil/candidate-cibil-route");
const candidateDocsRouter = require("./api/candidate-docs/candidate-docs-route");
const candidateEductionRouter = require("./api/candidate-eduction/candidate-eduction-route");
const candidateReferenceRouter = require("./api/candidate-reference/candidate-reference-route");
const candidateVerificationRouter = require("./api/candidate-verification/candidate-verification-route");
const clientRouter = require("./api/client/client-route");
const featureRouter = require("./api/feature/feature-route");
const internalTeamRouter = require("./api/internal-team/internal_team-route");
const locationRouter = require("./api/locationCSC/locationRoutes");
=======
const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { Sequelize } = require('sequelize');
const path = require('path');

const userRouter = require('./api/user/user-route');
const candidateRouter = require('./api/candidate/candidate-route');
const candidateAddressRouter = require('./api/candidate-address/candidate-address-route');
const candidateCibilRouter = require('./api/candidate-cibil/candidate-cibil-route');
const candidateDocsRouter = require('./api/candidate-docs/candidate-docs-route');
const candidateEducationRouter = require('./api/candidate-eduction/candidate-eduction-route');
const candidateReferenceRouter = require('./api/candidate-reference/candidate-reference-route');
const candidateVerificationRouter = require('./api/candidate-verification/candidate-verification-route');
const clientRouter = require('./api/client/client-route');
const featureRouter = require('./api/feature/feature-route');
const internalTeamRouter = require('./api/internal-team/internal_team-route');
const locationRouter = require('./api/locationCSC/locationRoutes');
const WorkingRouter = require('./api/WorkingExperiance/work-experience-routes');
const FatherRouter = require('./api/fatherdoc/fathers-documents-routes');
const TeamregRouter = require('./api/TeamRegistration/teamRoutes');
>>>>>>> a8bc10ddeaa47f83d4916433757d03826c915c9f

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

const path = require('path');
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());
<<<<<<< HEAD
app.use(awsServerlessExpressMiddleware.eventContext());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
=======

// API Routes
app.use('/_alive', async (req, res) => {
  res.status(200).send('Welcome to vitsinco.com');
});
app.use('/users', userRouter);
app.use('/candidate', candidateRouter);
app.use('/candidate-address', candidateAddressRouter);
app.use('/candidate-cibil', candidateCibilRouter);
app.use('/candidate-docs', candidateDocsRouter);
app.use('/candidate-education', candidateEducationRouter);
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

    const sequelize = new Sequelize(
      secret.dbname,
      secret.username,
      secret.password,
      {
        host: secret.host,
        port: secret.port || 3306,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
      }
    );

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
>>>>>>> a8bc10ddeaa47f83d4916433757d03826c915c9f
  });
}

<<<<<<< HEAD
app.use("/_alive", async (req, res) => {
  res.status(200).send("Welcome to vitsinco.com");
});

app.use("/users", userRouter);
app.use("/candidate", candidateRouter);
app.use("/candidate-address", candidateAddressRouter);
app.use("/candidate-cibil", candidateCibilRouter);
app.use("/candidate-docs", candidateDocsRouter);
app.use("/candidate-education", candidateEductionRouter);
app.use("/candidate-reference", candidateReferenceRouter);
app.use("/candidate-verification", candidateVerificationRouter);
app.use("/client", clientRouter);
app.use("/feature", featureRouter);
app.use("/internal-tea", internalTeamRouter);
app.use("/location", locationRouter);
app.use("/workingExp", WorkingRouter);
app.use("/fathers-document", FatherRouter);
app.use("/internal-team", TeamregRouter);

// Start the server locally for testing
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

=======
>>>>>>> a8bc10ddeaa47f83d4916433757d03826c915c9f
// Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

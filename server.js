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

const WorkingRouter = require("./api/WorkingExperiance/work-experience-routes");
const FatherRouter = require("./api/fatherdoc/fathers-documents-routes");
const TeamregRouter = require("./api/TeamRegistration/teamRoutes");

const path = require('path');
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

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
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
<<<<<<< HEAD
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
=======
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
>>>>>>> 888c744949f72ddc7c44902067f316554942fb95

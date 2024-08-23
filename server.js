const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const cors = require("cors");
const passport = require("./config/auth");
const awsServerlessExpress = require('aws-serverless-express');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const path = require('path');

const app = express();

// Initialize Secrets Manager client
const secretsManager = new SecretsManagerClient({ region: "ap-south-1" });

// Retrieve secret from Secrets Manager
const getSecret = async (secretName) => {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const response = await secretsManager.send(command);
        if ('SecretString' in response) {
            return JSON.parse(response.SecretString);
        }
        return null;
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        throw error;
    }
};

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(awsServerlessExpressMiddleware.eventContext());

// Static files setup
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes
app.use("/_alive", (req, res) => {
    res.status(200).send("Welcome to vitsinco.com");
});
app.use("/users", require("./api/user/user-route"));
app.use("/candidate", require("./api/candidate/candidate-route"));
app.use("/candidate-address", require("./api/candidate-address/candidate-address-route"));
app.use("/candidate-cibil", require("./api/candidate-cibil/candidate-cibil-route"));
app.use("/candidate-docs", require("./api/candidate-docs/candidate-docs-route"));
app.use("/candidate-education", require("./api/candidate-eduction/candidate-eduction-route"));
app.use("/candidate-reference", require("./api/candidate-reference/candidate-reference-route"));
app.use("/candidate-verification", require("./api/candidate-verification/candidate-verification-route"));
app.use("/client", require("./api/client/client-route"));
app.use("/feature", require("./api/feature/feature-route"));
app.use("/internal-tea", require("./api/internal-team/internal_team-route")); // Make sure this is the correct route
app.use("/location", require("./api/locationCSC/locationRoutes"));
app.use("/workingExp", require("./api/WorkingExperiance/work-experience-routes"));
app.use("/fathers-document", require("./api/fatherdoc/fathers-documents-routes"));
app.use("/internal-team", require("./api/TeamRegistration/teamRoutes")); // Ensure consistency with route paths

// Initialize Sequelize with RDS credentials
const initializeDatabase = async () => {
    const secretName = "myRdsSecret"; // Replace with your actual secret name
    const secret = await getSecret(secretName);

    if (!secret) {
        throw new Error("No secret found");
    }

    const { RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD, RDS_HOSTNAME, RDS_PORT } = secret;

    const sequelize = new Sequelize(RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD, {
        host: RDS_HOSTNAME,
        port: RDS_PORT || 3306,
        dialect: 'mysql', // or 'postgres', etc.
    });

    // Test database connection
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
        await sequelize.sync({ alter: true });
        console.log("Database synced successfully.");
    } catch (err) {
        console.error("Error syncing database:", err);
        throw err;
    }
};

// Start the server locally (for testing purposes)
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Export the handler for AWS Lambda
const server = awsServerlessExpress.createServer(app);
exports.handler = async (event, context) => {
    await initializeDatabase();
    return awsServerlessExpress.proxy(server, event, context);
};

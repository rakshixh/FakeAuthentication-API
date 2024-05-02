const express = require("express");
const router = express.Router();
const userRoutes = require("../Controller/UserController");
const superAdminRoutes = require("../Controller/SuperAdminController");
const SAUsersDataRoutes = require("../Controller/SAUserDataController");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Define base URLs for both localhost and hosted server
const localhostURL = "http://localhost:3000";
const hostedURL = "https://fakeauthentication-api.vercel.app/";

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Authentication API",
      description: "APIs for user authentication",
      version: "1.0.0",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            username: { type: "string" },
            password: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            name: { type: "string" },
            address: {
              type: "object",
              properties: {
                street: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                zipcode: { type: "string" },
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: localhostURL,
        description: "Localhost",
      },
      {
        url: hostedURL,
        description: "Hosted Server",
      },
    ],
    security: [],
  },
  apis: ["./Controller/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI route
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocs));

router.use("/staticUsers", userRoutes);
router.use("/dynamicUsers", superAdminRoutes, SAUsersDataRoutes);
module.exports = router;

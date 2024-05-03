const express = require("express");
const router = express.Router();
const userRoutes = require("../Controller/UserController");
const superAdminRoutes = require("../Controller/SuperAdminController");
const SAUsersDataRoutes = require("../Controller/SAUserDataController");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Define base URLs for both localhost and hosted server
const PORT = process.env.PORT || 3000;
const localhostURL = `http://localhost:${PORT}`;
const hostedURL = "https://fakeauthentication-api.vercel.app/";
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// Swagger definition for OAS 3
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fake Authentication API",
      description: "APIs for user authentication",
      version: "1.0.0",
    },
    servers: [
      {
        url: localhostURL,
        description: "Local Server",
      },
      {
        url: hostedURL,
        description: "Hosted Server",
      },
    ],
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
    security: [],
  },
  apis: ["./Controller/*.js"],
};

// const swaggerDocs = swaggerJsdoc(swaggerOptions);

const options = {
  customCss: ".swagger-ui .topbar { display: none }",
};

// Swagger UI route
// router.use("/api-docs", swaggerUi.serve);
// router.get("/api-docs", swaggerUi.setup(swaggerDocs));

// router.use(
//   "/api-docs",
//   swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
// );

router.use("/staticUsers", userRoutes);
router.use("/dynamicUsers", superAdminRoutes, SAUsersDataRoutes);
module.exports = router;

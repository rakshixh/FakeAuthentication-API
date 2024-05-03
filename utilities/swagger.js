const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Define base URLs for both localhost and hosted server
const PORT = process.env.PORT || 3000;
const localhostURL = `http://localhost:${PORT}`;
const hostedURL = "https://fakeauthentication-api.vercel.app/";

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const options = {
  customCss: ".swagger-ui .topbar { display: none }",
};

module.exports = swaggerUi.setup(swaggerDocs, options);
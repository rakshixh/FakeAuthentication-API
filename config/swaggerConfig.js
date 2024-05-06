const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Define base URLs for both localhost and hosted server
const PORT = process.env.PORT || 5000;
const localhostURL = `http://localhost:${PORT}`;
const hostedURL = "https://fakeauthentication-api.onrender.com/";

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
        url: hostedURL,
        description: "Hosted Server",
      },
      {
        url: localhostURL,
        description: "Local Server",
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
        SuperAdmin: {
          type: "object",
          properties: {
            SuperAdminUserName: {
              type: "string",
              required: true,
              unique: true,
              lowercase: true,
              pattern: "^[a-z0-9_\\.]+$",
            },
            SuperAdminName: { type: "string", required: true },
            lastAccessed: {
              type: "string",
              default: "getCurrentDateTimeIndia()",
            },
          },
        },
        DynamicUsersData: {
          type: "object",
          properties: {
            username: {
              type: "string",
              required: true,
              unique: true,
              lowercase: true,
              pattern: "^[a-z0-9_\\.]+$",
            },
            password: { type: "string", required: true },
            email: { type: "string", required: true, unique: true },
            role: { type: "string", required: true },
            name: { type: "string", required: true },
            address: {
              type: "object",
              properties: {
                street: { type: "string", required: true },
                city: { type: "string", required: true },
                state: { type: "string", required: true },
                zipcode: { type: "string", required: true },
              },
            },
            SuperAdminUserName: { type: "string", required: true },
          },
        },
      },
    },
  },
  apis: ["./Controller/*.js"],
};

// Swagger serve and setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerDocs);

module.exports = {
  swaggerServe,
  swaggerSetup,
};

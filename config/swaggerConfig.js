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
      description:
        "Developing front-end applications without key features like login and signup isn't ideal. Nowadays, every web app needs these basics. But for beginners, making them work can be tough. Creating backend APIs for just the front end is not easy, and it takes a lot of time. So, I created this Fake Authentication API. These APIs will help beginners and those who want to test front-end apps. It makes implementing login and signup functionalities easier without dealing with complex backend stuff. With this, anyone can get started quickly and save time, making web development smoother for everyone, regardless of their experience level.",
      version: "1.0.0",
      contact: {
        name: "Rakshith Acharya",
        url: "https://github.com/rakshixh",
        email: "rakshixh.socials@gmail.com",
      },
      license: {
        name: "MIT",
        url: "https://github.com/rakshixh/FakeAuthentication-API/blob/main/LICENSE",
      },
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
    tags: [
      {
        name: "Static Users",
        description:
          "These APIs are for fast access to static data with GET and POST requests!",
      },
      {
        name: "Dynamic Users - Super Admins",
        description: "APIs related to Dynamic Users",
      },
      {
        name: "Dynamic Users - Super Admin's Users",
        description: "APIs related to Dynamic Users",
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

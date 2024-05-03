const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// Define the full path to the api.yaml file
const apiSpecPath = path.resolve(__dirname, "../api.yaml");

// Load the YAML file
const swaggerJSDocs = YAML.load(apiSpecPath);

const options = {
  customCss: ` img {content:url(\'../logo.svg\'); height:auto;} `,
  customfavIcon: "../favicon.ico",
  customSiteTitle: "custom api",
};

module.exports = {
  swaggerServe: swaggerUI.serve,
  swaggerSetup: swaggerUI.setup(swaggerJSDocs),
};

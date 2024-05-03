const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cron = require("node-cron");
const { connectDB, disconnectDB } = require("./config/db");

const { swaggerServe, swaggerSetup } = require("./config/swaggerConfig");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Define base URLs for both localhost and hosted server
const PORT = process.env.PORT || 5000;
const localhostURL = `http://localhost:${PORT}`;
const hostedURL = "https://fakeauthentication-api.vercel.app/";

// const variable for CSS URL
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// create our express app
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Serve favicon
app.use(favicon(path.join(__dirname, "favicon.ico")));

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
  },
  apis: ["./Controller/*.js"],
};

// Function to make a connection to database and disconnect
const OpenAndCloseConnection = async () => {
  try {
    await connectDB();
    console.log("--------------------------------------------");
    console.log("28 DAYS OVER!");
    console.log(
      "Making connection to the database to keep the cluster running!"
    );
    console.log("-------------------------------------------- \n \n");
    setTimeout(async () => {
      await disconnectDB();
      console.log("--------------------------------------------");
      console.log("20 Seconds Over!");
      console.log("Disconnecting the connection from the database!");
      console.log("-------------------------------------------- \n \n");
    }, 20000); // Disconnect after 20 seconds
  } catch (error) {
    console.error("Error:", error);
  }
};

// Schedule the function to run every 28 days
cron.schedule(
  "0 0 1 * *",
  async () => {
    // Runs at midnight on the 1st of every month
    await OpenAndCloseConnection();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

// route
app.get("/", (req, res) => {
  res.send("Welcome to the Fake Authentication API!");
});

const routes = require("./Routes/Routes");
app.use("/api", routes);

//Swagger serve route
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use(
//   "/api/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL })
// );

app.use("/api/api-docs", swaggerServe, swaggerSetup);

// start the server
app.listen(PORT, () => {
  console.log(`Fake Authentication API server is running on port: ${PORT}`);
});

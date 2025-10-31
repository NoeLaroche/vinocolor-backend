const dotenv = require("dotenv");
const { resolve } = require("path");

// Chargement du fichier .env en fonction du NODE_ENV
let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

dotenv.config({ path: resolve(process.cwd(), ENV_FILE_NAME) });

// CORS
const ADMIN_CORS = process.env.ADMIN_CORS || "https://api.vinocolor.fr";
const STORE_CORS = process.env.STORE_CORS || "https://order.vinocolor.fr";

// Base de données et Redis
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Plugins
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: "medusa-payment-stripe",
    options: {
      api_key: process.env.STRIPE_SECRET_KEY,
    },
  },
  {
    resolve: `@rsc-labs/medusa-documents`,
    options: {
      enableUI: true,
    },
  },
];

// Modules Medusa
const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: { redisUrl: REDIS_URL },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: { redisUrl: REDIS_URL },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: process.env.JWT_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  workerMode: process.env.MEDUSA_WORKER_MODE || "server",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  redis_url: REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  plugins,
  modules,
};

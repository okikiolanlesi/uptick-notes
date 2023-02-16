import dotenv from "dotenv";

dotenv.config();

interface Config {
  mongoUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  env: string;
  port: number;
  cookieExpiresIn: number;
  test: { database: string };
}

const config: Config = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017//notes",
  jwt: {
    secret: process.env.JWT_SECRET || "somesupersecretsecret",
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  },
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3333,
  cookieExpiresIn: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 1,
  test: {
    database:
      process.env.TEST_DATABASE || "mongodb://127.0.0.1:27017//notes-test",
  },
};

export default config;

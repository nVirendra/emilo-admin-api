import http from "http";
import app from "./app.js";
import connectDB from "./config/database.js";
import { ENV } from "./config/env.js";
// import "./cronJobs.js";

const PORT = ENV.PORT;
const server = http.createServer(app);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

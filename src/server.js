import express from "express";
// import { authorsRouter } from "./api/authors/index.js";
import cors from "cors";
import { join } from "path";
import authorsRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogPostsRouter from "./api/blogPosts/index.js";
import filesRouter from "./api/files/index.js";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");
console.log("Public folder path in server-----------", publicFolderPath);

server.use(express.static(publicFolderPath));
server.use(express.json());
server.use(cors());

//****************ENDPOINTS**********************/

server.use("/authors", authorsRouter);
server.use("/blogs", blogPostsRouter);
server.use("/blogs", filesRouter);

// ****************** ERROR HANDLERS ****************//

server.use(badRequestHandler);
server.use(genericErrorHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("this is the port", port);
});

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/authors");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const blogPostsJSONPath = join(dataFolderPath, "blogposts.json");
console.log("blogPostsJSONPath", blogPostsJSONPath);
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (blogPostsList) =>
  writeJSON(blogPostsJSONPath, blogPostsList);
// export const getBooks = () => readJSON(booksJSONPath);
// export const writeBooks = (booksArray) => writeJSON(booksJSONPath, booksArray);

export const saveAuthorsAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

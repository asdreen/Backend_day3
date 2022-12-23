import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

console.log("CURRENT FILE URL:", import.meta.url);
console.log("CURRENT FILE PATH:", fileURLToPath(import.meta.url));
// getting the parent folder
console.log("PARENT FOLDER PATH:", dirname(fileURLToPath(import.meta.url)));
//concatenating parent folder path with "authors.json"
console.log(
  "TARGET:",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
);

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

// GET /authors => returns the list of authors: http://localhost:3001/authors
// GET /authors/123 => returns a single author: http://localhost:3001/authors/:authorId
// POST /authors => create a new author: http://localhost:3001/authors/ (+body)
// PUT /authors/123 => edit the author with the given id: http://localhost:3001/authors/:authorId (+body)
// DELETE /authors/123 => delete the author with the given id: http://localhost:3001/authors/:authorId

// 1. POST http://localhost:3001/users/ (+body)
authorsRouter.post("/", (req, res) => {
  //   console.log(req.body);
  //   const newAuthor = {
  //     ...req.body,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     id: uniqid(),
  //     avatar: `url("https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}")`,
  //   };
  //   const authorsList = JSON.parse(fs.readFileSync(authorsJSONPath));
  //   authorsList.push(newAuthor);
  //   fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsList));
  //   res.status(201).send({ id: newAuthor.id });
  // });

  const authorsList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const email = req.body.email;

  const authorWithSameEmail = authorsList.find(
    (author) => author.email === email
  );
  if (authorWithSameEmail === undefined) {
    const newAuthor = {
      ...req.body,
      createdAt: new Date(),
      id: uniqid(),
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    };

    authorsList.push(newAuthor);

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsList));
    res.status(201).send({ id: newAuthor.id, message: "email is unique" });
  } else {
    res.status(400).send(email + " already exists.");
  }
});

// 2. GET http://localhost:3001/users/
authorsRouter.get("/", (req, res) => {
  const authorsList = fs.readFileSync(authorsJSONPath);
  console.log("authorlist:", authorsList);
  const authors = JSON.parse(authorsList);
  res.send(authors);
});

// 3. GET http://localhost:3001/users/:userId
authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorlist = JSON.parse(fs.readFileSync(authorsJSONPath));
  const foundAuthor = authorlist.find((author) => author.id === authorId);
  res.send(foundAuthor);
});

// 4. PUT http://localhost:3001/users/:userId
authorsRouter.put("/:authorId", (req, res) => {
  console.log(req.body);
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorList.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthorData = authorList[index];
  const updatedAuthor = {
    ...oldAuthorData,
    ...req.body,
    updatedAt: new Date(),
  };
  authorList[index] = updatedAuthor;
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorList));
  res.send(updatedAuthor);
});

// 5. DELETE http://localhost:3001/users/:userId
authorsRouter.delete("/:authorId", (req, res) => {
  const authorList = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainAuthors = authorList.filter(
    (author) => author.id !== req.params.authorId
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainAuthors));
  res.status(204).send();
});
export default authorsRouter;

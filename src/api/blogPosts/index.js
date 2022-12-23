import express from "express";
import uniqid from "uniqid";
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js";
import httpErrors from "http-errors";
import { checksBlogPostsSchema, triggerBadRequest } from "./validator.js";

const { NotFound, Unauthorised, BadRequest } = httpErrors;

const blogPostsRouter = express.Router();
// const blogPostsJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "blogPosts.json"
// );

// const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
// const writeBlogPosts = (blogPostsList) =>
//   fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsList));

// 1. POST

blogPostsRouter.post(
  "/",
  checksBlogPostsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const newBlogPost = {
        ...req.body,
        createdAt: new Date(),
        _id: uniqid(),
      };
      const blogPostsList = await getBlogPosts();
      blogPostsList.push(newBlogPost);
      writeBlogPosts(blogPostsList);
      res.status(201).send({ _id: newBlogPost._id });
    } catch (error) {
      next(error);
    }
  }
);

// 2. GET
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPostsList = await getBlogPosts();
    res.send(blogPostsList);
  } catch (error) {
    next(error);
  }
});

// 3. GET WITH ID
blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsList = await getBlogPosts();
    const foundBlogPost = blogPostsList.find(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
      next(NotFound(`Blog Post id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT
blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    console.log(req.body);
    const blogPostsList = await getBlogPosts();
    const index = blogPostsList.findIndex(
      (blogPost) => blogPost._id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldBlogPost = blogPostsList[index];

      const editedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };
      blogPostsList[index] = editedBlogPost;
      await writeBlogPosts(blogPostsList);
      res.send(editedBlogPost);
    } else {
      next(NotFound(`Blog Post with id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostList = await getBlogPosts();
    const remainingBlogPost = blogPostList.filter(
      (blogPost) => blogPost._id !== req.params.blogPostId
    );
    if (blogPostList.length !== remainingBlogPost.length) {
      await writeBlogPosts(remainingBlogPost);
      res.status(204).send();
    } else {
      next(
        NotFound(`The Blog Post with id ${req.params.blogPostId} not found :(`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default blogPostsRouter;

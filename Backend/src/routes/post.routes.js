import { Router } from "express";
import { verifyJWT }  from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { createPost ,getAllPosts ,likePost,dislikePost} from "../controllers/post.controllers.js";

const router = Router();

router.post(
    "/create",
    verifyJWT,
    upload.array("media", 10),
    createPost
);

router.route("/")
.get(getAllPosts)
.post(verifyJWT, upload.array("media",5), createPost);

router.route("/:postId/like").patch(verifyJWT, likePost);


router.route("/:postId/dislike").patch(verifyJWT, dislikePost);

export default router;
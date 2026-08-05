import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import {uploadPyq, getAllPyqs, deletePyq} from "../controllers/Pyq.controllers.js";

const router = Router();

router
    .route("/")
    .post(
        verifyJWT,
        upload.single("pdf"),
        uploadPyq
    )
    .get(getAllPyqs);

router
    .route("/:id")
    .delete(
        verifyJWT,
        deletePyq
    );

export default router;
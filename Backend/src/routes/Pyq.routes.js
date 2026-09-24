import { Router } from "express";
import { verifyJWT, verifyCreator } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import {uploadPyq, getAllPyqs, deletePyq} from "../controllers/Pyq.controllers.js";

const router = Router();

router
    .route("/")
    .post(
        verifyJWT,
        verifyCreator,
        upload.single("pdf"),
        uploadPyq
    )
    .get(getAllPyqs);

router
    .route("/:id")
    .delete(
        verifyJWT,
        verifyCreator,
        deletePyq
    );

export default router;
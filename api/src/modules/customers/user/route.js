import { Router } from "express";
import UserController from "./UserConteroller";

const router = Router({ mergeParams: true });


router.get("/email-verify/:email", UserController.verifyEmail);


export default router;

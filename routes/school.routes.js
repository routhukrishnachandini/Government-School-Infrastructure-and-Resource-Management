import { Router } from 'express';
import {
    addSchool
} from "../controllers/school.controller.js"


const router = Router();

router.route("/school").post(addSchool);
router.get("/school", (req, res) => {
    res.render("school"); 
});
router.get("/school_telugu", (req, res) => {
    res.render("school_telugu"); 
});
export default router
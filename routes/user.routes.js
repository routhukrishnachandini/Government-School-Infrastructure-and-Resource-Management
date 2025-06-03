import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middelware.js';
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerAdmin 
} from '../controllers/user.controller.js';
import { 
    publishAFeedback,
    getAllFeedbacks
} from '../controllers/feedback.controller.js';
const router = Router();
import {Feedback} from "../models/feedback.model.js"


router.get("/login", (req, res) => {
    res.render("login"); 
});
router.route("/login").post(loginUser);  
router.get("/login_telugu", (req, res) => {
    res.render("login_telugu"); 
}); 
router.get("/register", (req, res) => {
    res.render("register"); 
}); 
router.get("/register_telugu", (req, res) => {
    res.render("register_telugu"); 
});  
router.route("/register").post(registerUser);

router.route("/feedback").post(publishAFeedback)
router.get("/feedback", (req, res) => {
    res.render("feedback"); 
});
router.get("/feedback_telugu", (req, res) => {
    res.render("feedback_telugu"); 
});  
router.get('/allFeedbacks', async (req, res) => {
    try {
        // Fetch all complaints from the database
        const feedbacks = await Feedback.find(); // Adjust query as needed

        // Render the EJS template with complaints data
        res.render('admin_feedback', { feedbacks });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/admin", (req, res) => {
    res.render("admin"); 
});
router.route("/register/admin").post(registerAdmin)
//secured route

// router.route("/logout").post(verifyJWT,logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/change-password").post(verifyJWT,changeCurrentUserPassword);
// router.route("/").get(verifyJWT,getUser);
// router.route("/").delete(verifyJWT,deleteUser);
// router.route("/updateAccountDetails").patch(verifyJWT,updateUserAccountDetails);
// router.route("/updateAvatar").patch(upload.single("avatar"),verifyJWT,updateUserAvatar);
// router.route("/updateCoverImage").patch(upload.single("coverImage"),verifyJWT,updateUserCoverImage);
// router.route("/channel/:username").get(verifyJWT,getUserChannelProfile);
// router.route("/history").get(verifyJWT,getUserWatchHistory);

export default router;
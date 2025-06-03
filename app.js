import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url"; // Import this to work with `import.meta.url`

// Workaround to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(cors({ // Used to connect frontend and backend
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(bodyParser.json({
    limit: "16kb" // To get data from form or body
}));

app.use(bodyParser.urlencoded({ extended: true, limit: "16kb" })); // Get data from URL by decoding it 
app.use(cookieParser());

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views')); // Ensure this path is correct



// Import routes
import userRouter from "./routes/user.routes.js";
import complaintRouter from "./routes/complaint.routes.js";
import schoolRouter from "./routes/school.routes.js";
// import subscriptionRouter from "./routes/subscription.routes.js"
// import commentRouter from "./routes/feedback.routes.js";
// import likeRouter from "./routes/school.routes.js"

// Route declarations 
app.use("/api/v1/users", userRouter);
app.use("/api/v1/complaint", complaintRouter);
// app.use("/api/v1/playlists", playlistRouter);
// app.use("/api/v1/subscriptions", subscriptionRouter);
// app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/school", schoolRouter);
// app.use("/api/v1/dashboard", dashboardRouter);

app.get('/', (req, res) => {
    res.render('home')
});


export { app };

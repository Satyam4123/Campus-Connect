require("dotenv").config();
require("../config/db");

const path = require("path");
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const cors = require("cors");

const { socketConfig } = require("../config/socket");
const passport = require("../config/passport");
const authRouter = require("../routes/authRoute");
const profileRoute = require("../routes/profileRoute");
const announcements = require("../routes/announcementsRoute");
const searchRoute = require("../routes/searchRoute");
const eventRoute = require("../routes/eventRoute");
const resourcesRoutes = require("../routes/resourcesRoutes");
const departmentDiscussionRoutes = require("../routes/departmentDiscussionRoutes");

const port = process.env.PORT || 3000;
const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.DEV_CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);
app.use("/profile", profileRoute);
app.use("/announcements", announcements);
app.use("/search", searchRoute);
app.use("/events", eventRoute);
app.use("/resources", resourcesRoutes);
app.use("/department-discussion", departmentDiscussionRoutes);

const server = http.createServer(app);
const io = socketConfig(server);

server.listen(port, () => {
  console.log(`Your app is listening at port ${port}`);
});

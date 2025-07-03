require("dotenv").config();
require("../config/db");

const path = require("path");
const express = require("express");
const http = require("http");
const socketConfig = require("../config/socket");
const passport = require("../config/passport");

const session = require("express-session");
const cors = require("cors");

const authRouter = require("../routes/authRoute");
const profileRoute = require("../routes/profileRoute");
const announcements = require("../routes/announcementsRoute");
const searchRoute = require("../routes/searchRoute");
const eventRoute = require("../routes/eventRoute");
const resourcesRoutes = require("../routes/resourcesRoutes");
const voiceInteraction = require("../routes/voiceInteraction");
const chatRoutes = require("../routes/chatRoutes");

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
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
app.use("/voice", voiceInteraction);
app.use("/message", chatRoutes);

const server = http.createServer(app);
socketConfig(server);

server.listen(port, () => {
  console.log(`Your app is listening at port ${port}`);
});

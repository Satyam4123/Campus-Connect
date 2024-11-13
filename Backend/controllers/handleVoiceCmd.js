const dialogflow = require("dialogflow");
const path = require("path");
const axios = require("axios");
const projectId = "campus-connect-ncqr";
const router = require("express").Router();
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(
    __dirname,
    "../config/campus-connect-ncqr-9404e5726d5c.json"
  ),
});

const handleVoicCmd = async (req, res) => {
  const { cmd } = req.body;

  if (!cmd) {
    return res.status(400).json({ message: "Can't hear that... try again!" });
  }

  const sessionPath = sessionClient.sessionPath(projectId, "unique-session-id"); // Ensure unique session ID

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: cmd,
        languageCode: "en-US",
      },
    },
  };

  try {
    // Send the command to Dialogflow and get the response
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log(result.intent.displayName);

    if (result.intent.displayName === "Get profile") {
      const { id } = req.body;
      if (!id) {
        return res.status(401).json({ message: "Provide the id also!" });
      }
      router.get(`http://localhost:3000/profile/${id}`);
    }
    if (result.intent.displayName === "Edit profile") {
      router.put("http://localhost:3000/profile/edit");
    }
    if (result.intent.displayName === "Delete profile") {
      router.delete("http://localhost:3000/profile/delete");
    }
    if (result.intent.displayName === "View announcements") {
      return res.redirect("http://localhost:3000/announcements");
    }
    if (result.intent.displayName === "Add announcement") {
      router.post("http://localhost:3000/announcements/add");
    }
    if (result.intent.displayName === "Search") {
      router.post("http://localhost:3000/search");
    }
    if (result.intent.displayName === "View events") {
      return res.redirect("http://localhost:3000/events");
    }
    if (result.intent.displayName === "Event Creation") {
      router.post("http://localhost:3000/events/new");
    }
    if (result.intent.displayName === "Get Resources") {
      return res.redirect("http://localhost:3000/resources");
    }
    if (result.intent.displayName === "View Resource") {
      return res.redirect("http://localhost:3000/resources/:id");
    }
    if (result.intent.displayName === "Upload Resource") {
      router.post("http://localhost:3000/resources/upload");
    }
    if (result.intent.displayName === "Download resource") {
      const { uploader, filename } = req.body;
      if (!uploader || !filename) {
        return res.status(401).json({ message: "Provide the uploader and filename also!" });
      }
      return res.redirect(`http://localhost:3000/download/${uploader}/${filename}`);
    }
    return res.json({ message: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow request failed:", error);
    return res.status(500).json({ message: "Error processing the command" });
  }
};

module.exports = { handleVoicCmd, router };

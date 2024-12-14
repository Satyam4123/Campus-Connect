// ResourceSharing.jsx

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, Typography, TextField } from '@mui/material';
import axios from 'axios';

// Get All Resources
function ResourceSharing() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:3000/resources", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setResources(response.data);
      } catch (err) {
        setError("Failed to load resources");
      }
    };

    fetchResources();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Available Resources</h2>
      {resources.length > 0 ? (
        resources.map((resource) => (
          <Card key={resource._id} className="resource-card">
            <CardHeader title={resource.title} />
            <CardContent>
              <Typography variant="body1">{resource.description}</Typography>
              <Button onClick={() => handleDownload(resource._id)}>Download</Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No resources available</p>
      )}
    </div>
  );
}

// Download Resource
const handleDownload = async (resourceId) => {
  try {
    const response = await axios.get(`http://localhost:3000/resources/${resourceId}/download`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      responseType: "blob", // to handle file download
    });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(response.data);
    link.download = `resource_${resourceId}.pdf`; // Set file name dynamically
    link.click();
  } catch (err) {
    alert("Failed to download resource");
  }
};

// Upload Resource
function ResourceUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:3000/resources/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Resource uploaded successfully");
    } catch (err) {
      alert("Failed to upload resource");
    }
  };

  return (
    <div>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export { ResourceSharing, ResourceUpload };

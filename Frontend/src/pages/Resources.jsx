import { useEffect, useState } from "react";
import axios from "axios";
import ResourceCard from "../components/ResourceCard";
import { X, Plus } from "lucide-react";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resource, setResource] = useState(null)

  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources", err);
      }
    };
    fetchResources();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.title.trim() || !uploadData.file) {
      alert("Title and file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("file", uploadData.file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/resources/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResources((prev) => [res.data.newResource, ...prev]);
      setShowUploadModal(false);
      setUploadData({ title: "", description: "", file: null });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleView = async (e) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/resources/${selectedResource._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setResource(res)
      alert("recieving the resource soon you'll be able to view it")
    } catch (err) {
      console.error("Failed to view resource:", err);
      alert("Viewing resource failed");
    }
  }
  const handleDownload = async (e) => {
    try {
      const token = localStorage.getItem("token");
      console.log(selectedResource)
      const res = await axios.get(`http://localhost:3000/resources/download/${selectedResource.uploader}/${selectedResource.filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      return res;
  
    } catch (err) {
      console.error("Failed to download resource:", err);
      alert("Downloading resource failed");
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Resources</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={18} /> Upload Resource
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((res) => (
          <ResourceCard
            key={res._id}
            resource={res}
            onClick={() => setSelectedResource(res)}
          />
        ))}
      </div>

      {/* Resource Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-2">{selectedResource.title}</h2>
            {selectedResource.description && (
              <p className="text-gray-700 mb-4">{selectedResource.description}</p>
            )}
            <p className="text-sm text-gray-500 mb-2">Uploaded by: {selectedResource.uploader}</p>
            <div className="flex gap-8 items-center">
              <button onClick={handleView}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View
              </button>
              
              <button onClick={handleDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-blue-600 mb-4">Upload Resource</h2>
            <form onSubmit={handleUploadSubmit}>
              <input
                type="text"
                placeholder="Title"
                required
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData({ ...uploadData, title: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Description (optional)"
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({ ...uploadData, description: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="file"
                required
                onChange={(e) =>
                  setUploadData({ ...uploadData, file: e.target.files[0] })
                }
                className="w-full mb-4"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

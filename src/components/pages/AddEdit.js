import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/AddEdit.css";

const AddEdit = () => {
  const initialState = {
    titre: "",
    description: "",
    service: "",
    filePath: "", // Add filePath to initial state
  };

  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { titre, description, service, filePath } = state;
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { guide } = location.state || {};

  useEffect(() => {
    if (guide) {
      setState(guide);
      if (guide.filePath) {
        setPreviewUrl(`http://localhost:4000/uploads/${guide.filePath}`);
      }
    }
  }, [guide]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleRemoveFile = async () => {
    if (!id) {
      // If creating a new guide, just remove the file locally
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // If editing an existing guide, update the backend
    try {
      const response = await fetch(`http://localhost:4000/services/${id}/remove-file`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState((prev) => ({ ...prev, filePath: "" })); // Clear the filePath in the state
      setFile(null);
      setPreviewUrl(null);
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error(`Error removing file: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre.trim() || !description.trim() || !service.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("titre", titre.trim());
      formData.append("description", description.trim());
      formData.append("service", service.trim());
      if (file) {
        formData.append("file", file);
      } else if (filePath) {
        formData.append("filePath", filePath); // Preserve existing file if no new file is uploaded
      }

      const response = await fetch(
        `http://localhost:4000/services/${id || ''}`,
        {
          method: id ? "PUT" : "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      toast.success(`Guide ${id ? "updated" : "added"} successfully!`);
      navigate("/Guildlist", { replace: true });
    } catch (error) {
      toast.error(`Error ${id ? "updating" : "adding"} guide: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isImage = previewUrl && /\.(jpeg|jpg|png|gif)$/i.test(previewUrl);

  return (
    <div style={{ marginTop: "100px" }}>
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="titre">Titre</label>
        <input
          type="text"
          id="titre"
          name="titre"
          placeholder="Your Titre ..."
          value={titre}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Your description ..."
          value={description}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          rows={4}
        />

        <label htmlFor="service">Service</label>
        <input
          type="text"
          id="service"
          name="service"
          placeholder="Your service ..."
          value={service}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />

        <label htmlFor="file">Upload File</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          accept=".pdf, image/*"
        />
        <br />

        {previewUrl && (
          <div className="preview-container">
            {isImage ? (
              <img src={previewUrl} alt="Preview" className="image-preview" />
            ) : (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="btn-rmv">
                View File
              </a>
            )}
            <br />
            <button onClick={handleRemoveFile} style={{ marginTop: "10px" }} className="btn-rmv">
              Remove File
            </button>
          </div>
        )}

        <input
          type="submit"
          value={isLoading ? "Processing..." : id ? "Update" : "Save"}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default AddEdit;
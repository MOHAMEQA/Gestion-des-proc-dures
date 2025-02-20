import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/View.css";

const View = () => {
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchGuide = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:4000/services/${id}`);
        
        if (!response.ok) {
          throw new Error(`Guide not found (${response.status})`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setGuide(data);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          toast.error(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchGuide();
    } else {
      setError("Invalid guide ID");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => {
    navigate("/GuildList");
  };

  if (isLoading) {
    return (
      <div className="view-container loading">
        <div className="loading-spinner"></div>
        <p>Loading guide details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn-back" onClick={handleBack}>
          Back to Guide List
        </button>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="view-container not-found">
        <h2>Guide Not Found</h2>
        <p>The requested guide could not be found.</p>
        <button className="btn-back" onClick={handleBack}>
          Back to Guide List
        </button>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Guide Details</h2>
        <button className="btn-back" onClick={handleBack}>
          Back to Guide List
        </button>
      </div>

      <div className="guide-details">
        <div className="detail-item">
          <label>ID:</label>
          <span>{guide.id}</span>
        </div>

        <div className="detail-item">
          <label>Titre:</label>
          <span>{guide.titre}</span>
        </div>

        <div className="detail-item">
          <label>Description:</label>
          <p className="description">{guide.description}</p>
        </div>

        <div className="detail-item">
          <label>Service:</label>
          <span>{guide.service}</span>
        </div>

        {guide.filePath && (
          <div className="detail-item">
            <label>File:</label>
            <div className="file-preview">
              {/\.(jpg|jpeg|png|gif)$/i.test(guide.filePath) ? (
                <img
                  src={`http://localhost:4000/uploads/${guide.filePath}`}
                  alt={`${guide.titre} preview`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "placeholder-image-url.jpg";
                    toast.error("Error loading image");
                  }}
                />
              ) : (
                <a
                  href={`http://localhost:4000/uploads/${guide.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  View File
                </a>
              )}
            </div>
          </div>
        )}

         
        </div>
      </div>
  
  );
};

export default View;
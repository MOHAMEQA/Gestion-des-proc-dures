import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GuidePDF from "./GuidePDF";
import "../css/GuideTable.css";

const GuildList = () => {
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGuides = async () => {
      try {
        const response = await fetch("http://localhost:4000/services");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          setGuides(data);
        }
      } catch (error) {
        console.error("Error fetching guides:", error);
        toast.error(`Error fetching guides: ${error.message}`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGuides();
    return () => {
      isMounted = false;
    };
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) {
      return;
    }

    setDeleteInProgress(id);
    try {
      const response = await fetch(`http://localhost:4000/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setGuides((prevGuides) => prevGuides.filter((guide) => guide.id !== id));
      toast.success("Guide deleted successfully");
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast.error(`Error deleting guide: ${error.message}`);
    } finally {
      setDeleteInProgress(null);
    }
  };

  const renderFilePreview = (guide) => {
    if (!guide.filePath) {
      return "Aucun fichier";
    }

    const fileUrl = `http://localhost:4000/uploads/${guide.filePath}`;
    const isPDF = /\.pdf$/i.test(guide.filePath);
    const isImageFile = /\.(jpg|jpeg|png|gif)$/i.test(guide.filePath);

    if (isPDF) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-view"
        >
          Voir PDF
        </a>
      );
    }

    if (isImageFile) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-view"
        >
          Voir Image
        </a>
      );
    }

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="file-download-link"
      >
        Télécharger Fichier
      </a>
    );
  };

  return (
    <div className="guide-list-container">
      <h2>Liste des Guides</h2>
      <div className="guide-actions">
        <Link to="/add">
          <button className="btn-add">Ajouter un guide</button>
        </Link>

        {guides.length > 0 && (
          <PDFDownloadLink
            document={<GuidePDF guides={guides} />}
            fileName="All_Guides.pdf"
            className="pdf-download-link"
          >
            {({ loading, error }) => (
              <button
                className={`btn-download ${loading ? "loading" : ""}`}
                disabled={loading || error}
              >
                {loading ? "Génération..." : "Télécharger Tous les Guides"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {guides.length === 0 ? (
        <div className="no-guides">
          <p>Aucun guide disponible. Commencez par en ajouter un!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="guide-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Service</th>
                <th>Fichier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide, index) => (
                <tr key={guide.id}>
                  <td>{index + 1}</td>
                  <td>{guide.titre}</td>
                  <td>
                    {guide.description.length > 100
                      ? `${guide.description.substring(0, 100)}...`
                      : guide.description}
                  </td>
                  <td>{guide.service}</td>
                  <td>{renderFilePreview(guide)}</td>
                  <td className="action-buttons">
                    <Link to={`/update/${guide.id}`} state={{ guide }}>
                      <button
                        className="btn btn-edit"
                        disabled={deleteInProgress === guide.id}
                      >
                        Modifier
                      </button>
                    </Link>
                    <button
                      className={`btn btn-delete ${
                        deleteInProgress === guide.id ? "loading" : ""
                      }`}
                      onClick={() => onDelete(guide.id)}
                      disabled={deleteInProgress === guide.id}
                    >
                      {deleteInProgress === guide.id ? "..." : "Supprimer"}
                    </button>
                    <Link to={`/view/${guide.id}`}>
                      <button
                        className="btn btn-view"
                        disabled={deleteInProgress === guide.id}
                      >
                        Voir
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GuildList;
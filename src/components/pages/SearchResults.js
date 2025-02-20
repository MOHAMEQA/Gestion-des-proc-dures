import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SearchResultsPDF from "./SearchResultsPDF"; // Import PDF component
import "../css/SearchResults.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      console.log("Fetching:", `http://localhost:4000/services/search?query=${query}`);

      fetch(`http://localhost:4000/services/search?query=${query}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data received:", data);
          setResults(data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("Error fetching search results");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <>
          <ul>
            {results.map((guide) => (
              <li key={guide.id}>
                <h3>{guide.titre}</h3>
                <p>{guide.description}</p>
                <p>{guide.service}</p>
              </li>
            ))}
          </ul>

          {/* PDF Download Button */}
          <PDFDownloadLink document={<SearchResultsPDF query={query} results={results} />} fileName={`Search_Results_${query}.pdf`}>
            {({ loading }) => (
              <button className="btn-download">{loading ? "Generating PDF..." : "Download PDF"}</button>
            )}
          </PDFDownloadLink>
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;

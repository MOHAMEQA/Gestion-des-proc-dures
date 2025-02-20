import React, { useEffect, useState } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import "../css/Header.css"

const Header = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  const [search , setSearch] = useState("");
  const navigate = useNavigate(); 
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    window.location.href = "/"; // Redirect to the login page
  };
  



  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("Home");
    } else if (location.pathname === "/add") {
      setActiveTab("ADD");
    } else if (location.pathname === "/about") {
      setActiveTab("About");
    }
  }, [location]);
const handleSubmit = (e) => {
   e.preventDefault();
   if (search.trim()) {
    
      navigate(`/search?query=${search}`);
      setSearch("")
    }
}
  return (
    <div className="header">
      <p className="logo">Gestion Des procédures</p>
      <div className="header-right">
         <form onSubmit={handleSubmit} style={{display:"inline"}}>
            <input
            type="text"
            className="inputField"
            placeholder="Search titre ..."
            onChange={(e)=> setSearch(e.target.value)}
            value={search}
            />
         </form>
        <Link to="/GuildList">
          <p
            className={`${activeTab === "Home" ? "active" : ""}`}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        <Link to="/add">
          <p
            className={`${activeTab === "ADD" ? "active" : ""}`}
            onClick={() => setActiveTab("ADD")}
          >
            Ajouter 
          </p>
        </Link>
        <Link to="/About">
          <p
            className={`${activeTab === "About" ? "active" : ""}`}
            onClick={() => setActiveTab("About")}
          >
            About
          </p>
        </Link>
        <button onClick={handleLogout} className="button-log">Se déconnecter</button>
        
      </div>
      
    </div>
  );
};

export default Header;
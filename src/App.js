import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuildList from "./components/pages/GuildList";
import AddEdit from "./components/pages/AddEdit";
import View from "./components/pages/View";
import SearchResults from "./components/pages/SearchResults";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import About from "./components/pages/About";
import Header from "./components/pages/Header";
import ProtectedRoute from "./components/pages/ProtectedRoute"




const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/GuildList"
            element={
              <>
                <Header />
                <GuildList />
              </>
            }
          />
          
          <Route
            path="/add"
            element={
              <>
                <Header />
                <AddEdit />
              </>
            }
          />
          <Route
            path="/update/:id"
            element={
              <>
                <Header />
                <AddEdit />
              </>
            }
          />
          <Route
            path="/view/:id"
            element={
              <>
                <Header />
                <View />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <Header />
                <SearchResults />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <About />
              </>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
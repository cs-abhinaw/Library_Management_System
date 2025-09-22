import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const navStyle = {
    backgroundColor: "#222",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 30px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  };

  const logoStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4da6ff",
  };

  const linkContainer = {
    display: "flex",
    gap: "20px",
  };

  const linkStyle = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#4da6ff" : "#ddd",
    fontSize: "16px",
    fontWeight: isActive ? "bold" : "normal",
    borderBottom: isActive ? "2px solid #4da6ff" : "none",
    paddingBottom: "3px",
    transition: "color 0.3s ease",
  });

  return (
    <nav style={navStyle}>
      <h1 style={logoStyle}>📚 Global Library System</h1>
      <div style={linkContainer}>
        <Link to="/" style={linkStyle(location.pathname === "/")}>
          Dashboard
        </Link>
        <Link to="/books" style={linkStyle(location.pathname === "/books")}>
          Books
        </Link>
        <Link to="/issue" style={linkStyle(location.pathname === "/issue")}>
          Issue Book
        </Link>
        <Link to="/return" style={linkStyle(location.pathname === "/return")}>
          Return Book
        </Link>
       
      </div>
    </nav>
  );
}

export default Navbar;

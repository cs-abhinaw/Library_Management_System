import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../src/Pages/Dashboard";
import Books from "../src/Pages/Books";
// import IssueBook from "../src/Pages/IssueBook";
import ReturnBook from "../src/Pages/ReturnBook";
import Navbar from "./component/Navbar";
import LibraryDashboard from "./Pages/LibraryDashboarrd";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 font-sans">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/issue" element={<LibraryDashboard />} />
            <Route path="/return" element={<ReturnBook />} />
            {/* <Route path="/user" element={<User />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

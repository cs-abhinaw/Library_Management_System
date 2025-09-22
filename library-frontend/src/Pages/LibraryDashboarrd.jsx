import { useState } from "react";
import IssueBook from "./IssueBook";
import IssuedBooks from "./IssuedBooks";

function LibraryDashboard() {
  const [activeTab, setActiveTab] = useState("issue"); // default: Issue Book

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-700 p-6 border-b">
          📚 Issue BOOKs
        </h1>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("issue")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === "issue"
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 text-gray-700"
            }`}
          >
            ➕ Issue Book
          </button><br /><br />
          <button
            onClick={() => setActiveTab("issued")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === "issued"
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 text-gray-700"
            }`}
          >
            📖 Issued Books
          </button><br /><br />
          {/* <button
            onClick={() => setActiveTab("issue")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              activeTab === "issue"
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 text-gray-700"
            }`}
          >
            ➕ Book Reservation
          </button> */}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {activeTab === "issue" && <IssueBook />}
        {activeTab === "issued" && <IssuedBooks />}
        {activeTab === "reserve" && <IssuedBooks />}
      </div>
    </div>
  );
}

export default LibraryDashboard;

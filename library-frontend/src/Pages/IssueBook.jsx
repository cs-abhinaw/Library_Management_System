import { useState } from "react";
import axios from "axios";

function IssueBook({ onBookIssued }) {   // 👈 agar parent se pass karna ho to yaha define
  const [memberId, setMemberId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [empId, setEmpId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/issue", {
        member_id: memberId,
        isbn: isbn,
        emp_id: empId,
      });
      setMessage(`✅ ${res.data.message}, ID: ${res.data.issued_id}`);

      // notify dashboard (optional)
      if (onBookIssued) {
        onBookIssued();   // 👈 yeh tab chalega jab parent ne prop pass kiya ho
      }

      // reset form
      setMemberId("");
      setIsbn("");
      setEmpId("");
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{height:"100vh",display:"",justifyContent:"center"}}>
      <div className="" style={{display:"flex",justifyContent:"center",marginTop:"40px"}}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all hover:scale-105 duration-300">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
            📚 Issue a Book
          </h2>

          <form onSubmit={handleIssue} className="space-y-6">
            {/* Member ID */}
            <div>
              <label htmlFor="memberId" className="block text-sm font-semibold text-gray-700">
                Member ID
              </label>
              <input
                type="text"
                id="memberId"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                placeholder="Enter Member ID"
                required
              />
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className="block text-sm font-semibold text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                placeholder="Enter ISBN"
                required
              />
            </div>

            {/* Employee ID */}
            <div>
              <label htmlFor="empId" className="block text-sm font-semibold text-gray-700">
                Employee ID
              </label>
              <input
                type="text"
                id="empId"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                placeholder="Enter Employee ID"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-indigo-700 hover:to-purple-700"} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Issue Book"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-sm font-medium transition duration-300 ${
                message.includes("✅")
                  ? "bg-green-100 text-green-900 border-l-4 border-green-500"
                  : "bg-red-100 text-red-900 border-l-4 border-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      
        
        
      
    </div>
  );
}

export default IssueBook;



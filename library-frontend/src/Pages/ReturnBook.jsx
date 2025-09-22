import { useState } from "react";
import axios from "axios";

function ReturnBook({ onBookReturned }) {
  const [issuedId, setIssuedId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReturn = async (e) => {
    e.preventDefault();

    if (!issuedId.trim()) {
      setMessage("❌ Issued ID is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/return", {
        issued_id: issuedId.trim(),
      });

      // show message
      setMessage(
        `✅ ${res.data.message}. Fine: ₹${res.data.fine_amount} (Overdue: ${res.data.overdue_days} days)`
      );

      // clear input
      setIssuedId("");

      // update dashboard (+1 total books)
      if (onBookReturned) {
        onBookReturned();
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{justifyContent:"center"}}
    className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Return a Book</h2>
      <form onSubmit={handleReturn} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Issued ID"
          value={issuedId}
          onChange={(e) => setIssuedId(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Processing..." : "Return Book"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes("✅")
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ReturnBook;
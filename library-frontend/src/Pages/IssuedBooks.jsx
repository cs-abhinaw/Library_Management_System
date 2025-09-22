import { useEffect, useState } from "react";
import axios from "axios";

function IssuedBooks() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/issued-books");
      setIssuedBooks(res.data);
    } catch (err) {
      console.error("Error fetching issued books:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-6">Loading issued books...</p>;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📖 Issued Books
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Issued ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Member</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Book</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Employee</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Issued Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issuedBooks.length > 0 ? (
              issuedBooks.map((book) => (
                <tr
                  key={book.issued_id}
                  className="hover:bg-indigo-50 transition duration-150"
                >
                  <td className="px-4 py-3 text-gray-700">{book.issued_id}</td>
                  <td className="px-4 py-3 text-gray-700">{book.member_name}</td>
                  <td className="px-4 py-3 text-gray-700">{book.book_name}</td>
                  <td className="px-4 py-3 text-gray-700">{book.emp_id}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(book.issued_date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6"
                >
                  No books issued yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IssuedBooks;

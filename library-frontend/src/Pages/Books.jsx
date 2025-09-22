import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi"; // search icon

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    margin: '0 0 1rem 0'
  },
  searchContainer: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    width: '33.333333%'
  },
  searchIcon: {
    color: '#6b7280',
    marginRight: '0.5rem'
  },
  searchInput: {
    outline: 'none',
    width: '100%',
    border: 'none',
    fontSize: '1rem'
  },
  table: {
    border: '1px solid #d1d5db',
    width: '100%',
    tableLayout: 'auto',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#e5e7eb'
  },
  th: {
    padding: '0.75rem 1.5rem',
    border: '1px solid #d1d5db',
    textAlign: 'left',
    fontWeight: '600'
  },
  tbody: {
    backgroundColor: 'white'
  },
  tr: {
    transition: 'background-color 0.2s'
  },
  trHover: {
    backgroundColor: '#f3f4f6'
  },
  td: {
    padding: '0.5rem 1.5rem',
    border: '1px solid #d1d5db'
  },
  noResults: {
    textAlign: 'center',
    padding: '1rem'
  }
};

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.book_title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Books List</h2>
      
      {/* Search box */}
      <div style={styles.searchContainer}>
        <FiSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by title, ISBN or category"
          style={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Books table */}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>ISBN</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Quantity</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {filteredBooks.map((b, index) => (
            <tr 
              key={b.isbn} 
              style={{
                ...styles.tr,
                ...(hoveredRow === index ? styles.trHover : {})
              }}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td style={styles.td}>{b.isbn}</td>
              <td style={styles.td}>{b.book_title}</td>
              <td style={styles.td}>{b.category}</td>
              <td style={styles.td}>{b.quantity}</td>
            </tr>
          ))}
          {filteredBooks.length === 0 && (
            <tr>
              <td colSpan="4" style={{...styles.td, ...styles.noResults}}>
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
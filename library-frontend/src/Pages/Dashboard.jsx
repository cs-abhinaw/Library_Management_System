import { useEffect, useState } from "react";

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 1rem 0'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb'
  },
  statIcon: {
    width: '3rem',
    height: '3rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    fontSize: '1.5rem'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 0.5rem 0'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: 0
  },
  recentSection: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  sectionHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid #f3f4f6'
  },
  tr: {
    transition: 'background-color 0.2s'
  },
  trHover: {
    backgroundColor: '#f9fafb'
  },
  bookTitle: {
    fontWeight: '500',
    color: '#111827'
  },
  category: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  noData: {
    padding: '2rem',
    textAlign: 'center',
    color: '#6b7280'
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '2px solid #e5e7eb',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  }
};

// Add CSS animation for spinner
const spinKeyframes = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0,
    lowStock: 0,
    recentlyAdded: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Replace with your actual axios call:
        // const booksResponse = await axios.get("http://localhost:5000/books");
        
        // For demonstration, using fetch (replace with your axios call)
        const response = await fetch("http://localhost:5000/books");
        const books = await response.json();

        // Calculate statistics
        const totalBooks = books.length;
        const categories = [...new Set(books.map(book => book.category))];
        const totalCategories = categories.length;
        const lowStock = books.filter(book => book.quantity <= 2).length;
        const recentlyAdded = books.filter(book => {
          // Assuming you have a date field, otherwise show last 5 books
          return true;
        }).slice(-5).length;

        setStats({
          totalBooks,
          totalCategories,
          lowStock,
          recentlyAdded
        });

        // Set recent books (last 5 books)
        setRecentBooks(books.slice(-5).reverse());
        
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <>
        <style>{spinKeyframes}</style>
        <div style={styles.container}>
          <div style={styles.loadingCard}>
            <div style={styles.spinner}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{...styles.loadingCard, backgroundColor: '#fef2f2', border: '1px solid #fecaca'}}>
          <p style={{color: '#991b1b'}}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Library Dashboard</h1>
          <p style={styles.subtitle}>Welcome to your Library Management System 📚</p>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#dbeafe', color: '#3b82f6'}}>
              📚
            </div>
            <h2 style={styles.statNumber}>{stats.totalBooks}</h2>
            <p style={styles.statLabel}>Total Books</p>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#dcfce7', color: '#16a34a'}}>
              📂
            </div>
            <h2 style={styles.statNumber}>{stats.totalCategories}</h2>
            <p style={styles.statLabel}>Categories</p>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#fed7d7', color: '#dc2626'}}>
              ⚠️
            </div>
            <h2 style={styles.statNumber}>{stats.lowStock}</h2>
            <p style={styles.statLabel}>Low Stock (≤2)</p>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.statIcon, backgroundColor: '#e0e7ff', color: '#6366f1'}}>
              ✨
            </div>
            <h2 style={styles.statNumber}>{stats.recentlyAdded}</h2>
            <p style={styles.statLabel}>Recently Added</p>
          </div>
        </div>

        {/* Recent Books Section */}
        <div style={styles.recentSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Books</h3>
          </div>
          
          {recentBooks.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ISBN</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.map((book, index) => (
                  <tr 
                    key={book.isbn}
                    style={{
                      ...styles.tr,
                      ...(hoveredRow === index ? styles.trHover : {})
                    }}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <code style={{backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem'}}>
                        {book.isbn}
                      </code>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.bookTitle}>{book.book_title}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.category}>{book.category}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{fontWeight: '600', color: book.quantity <= 2 ? '#dc2626' : '#111827'}}>
                        {book.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.noData}>
              <p>No books found in the library</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
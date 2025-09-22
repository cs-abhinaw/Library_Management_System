require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let pool;
async function initDb() {
  pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'library_management_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}
initDb().catch(err => {
  console.error("DB connection failed:", err);
  process.exit(1);
});

/* -------------------------
   Utility helpers
   ------------------------- */
function formatDateToSQL(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetween(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diff = e - s;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/* -------------------------
   Books endpoints
   ------------------------- */
// GET /books - list all books
app.get('/books', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT isbn, book_title, category, rental_price, status, author, publisher, quantity FROM books');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET /books/:isbn - get single book
app.get('/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const [rows] = await pool.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST /books - add a book
/* -------------------------
   Issue book endpoint
   - checks quantity > 0
   - inserts into issued_status
   - decrements books.quantity
   ------------------------- */
app.post("/issue", async (req, res) => {
  const { member_id, isbn, emp_id } = req.body;
  console.log("📥 Issue request:", req.body);

  try {
    // check member
    const [members] = await pool.query("SELECT * FROM members WHERE member_id = ?", [member_id]);
    if (members.length === 0) {
      console.log("❌ Member not found:", member_id);
      return res.status(400).json({ error: "Member not found" });
    }

    // check book
    const [books] = await pool.query("SELECT * FROM books WHERE isbn = ?", [isbn]);
    if (books.length === 0) {
      console.log("❌ Book not found:", isbn);
      return res.status(400).json({ error: "Book not found" });
    }

    if (books[0].quantity <= 0) {
      console.log("❌ Book not available (quantity 0)");
      return res.status(400).json({ error: "Book not available" });
    }

    // issue book
const issued_id = "IS-" + uuidv4().slice(0, 8);
    await pool.query(
      "INSERT INTO issued_status (issued_id, issued_member_id, issued_book_name, issued_date, issued_book_isbn, issued_emp_id) VALUES (?, ?, ?, NOW(), ?, ?)",
      [issued_id, member_id, books[0].book_title, isbn, emp_id]
    );

    // update book quantity
    await pool.query("UPDATE books SET quantity = quantity - 1 WHERE isbn = ?", [isbn]);

    console.log("✅ Book issued successfully:", issued_id);
    res.json({ message: "Book issued successfully", issued_id });
  } catch (err) {
    console.error("❌ Backend error while issuing:", err);
    res.status(500).json({ error: err.message || "Failed to issue book" });
  }
});



// PUT /books/:isbn - update book fields (partial allowed)
app.put('/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const allowed = ['book_title', 'category', 'rental_price', 'status', 'author', 'publisher', 'quantity'];
    const fields = [];
    const values = [];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No valid fields provided' });
    values.push(isbn);
    const sql = `UPDATE books SET ${fields.join(', ')} WHERE isbn = ?`;
    await pool.query(sql, values);
    res.json({ message: 'Book updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

/* -------------------------
   Members endpoints
   ------------------------- */
app.get('/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT member_id, member_name, member_address, reg_date FROM members');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

/* -------------------------
   Issue book endpoint
   - checks quantity > 0
   - inserts into issued_status
   - decrements books.quantity
   ------------------------- */
/* -------------------------
   Issue book endpoint
   - checks quantity > 0
   - inserts into issued_status
   - decrements books.quantity
   ------------------------- */
app.post("/issue", async (req, res) => {
  const { member_id, isbn, emp_id } = req.body;
  console.log("📥 Issue request:", req.body);

  try {
    // check member
    const [members] = await pool.query("SELECT * FROM members WHERE member_id = ?", [member_id]);
    if (members.length === 0) {
      console.log("❌ Member not found:", member_id);
      return res.status(400).json({ error: "Member not found" });
    }

    // check book
    const [books] = await pool.query("SELECT * FROM books WHERE isbn = ?", [isbn]);
    if (books.length === 0) {
      console.log("❌ Book not found:", isbn);
      return res.status(400).json({ error: "Book not found" });
    }

    if (books[0].quantity <= 0) {
      console.log("❌ Book not available (quantity 0)");
      return res.status(400).json({ error: "Book not available" });
    }

    // issue book
    const issued_id = "IS-" + uuidv4().slice(0, 8);
    await pool.query(
      "INSERT INTO issued_status (issued_id, issued_member_id, issued_book_name, issued_date, issued_book_isbn, issued_emp_id) VALUES (?, ?, ?, NOW(), ?, ?)",
      [issued_id, member_id, books[0].book_title, isbn, emp_id]
    );

    // update book quantity
    await pool.query("UPDATE books SET quantity = quantity - 1 WHERE isbn = ?", [isbn]);

    console.log("✅ Book issued successfully:", issued_id);
    res.json({ message: "Book issued successfully", issued_id });
  } catch (err) {
    console.error("❌ Backend error while issuing:", err);
    res.status(500).json({ error: err.message || "Failed to issue book" });
  }
});

// Fetch all issued books with member + book details
// Fetch all issued books with member + book details
app.get("/issued-books", async (req, res) => {
  const query = `
    SELECT 
      i.issued_id,
      m.member_name,
      b.book_title,
      e.emp_name AS issued_by,
      i.issued_date
    FROM issued_status i
    JOIN members m ON i.issued_member_id = m.member_id
    JOIN books b ON i.issued_book_isbn = b.isbn
    JOIN employees e ON i.issued_emp_id = e.emp_id
    LEFT JOIN return_status r ON i.issued_id = r.issued_id
    WHERE r.issued_id IS NULL  -- only not returned yet
    ORDER BY i.issued_date DESC
  `;

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching issued books:", err);
    res.status(500).json({ error: "Database error" });
  }
});





/* -------------------------
   Return book endpoint
   - inserts into return_status (with return_date)
   - calculates fine and returns it
   - increments books.quantity
   ------------------------- */
app.post('/return', async (req, res) => {
  try {
    const { issued_id } = req.body;
    if (!issued_id) return res.status(400).json({ error: 'issued_id required' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // get issued record
      const [issuedRows] = await conn.query('SELECT * FROM issued_status WHERE issued_id = ?', [issued_id]);
      if (issuedRows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: 'Issued record not found' });
      }

      // check if already returned
      const [rRows] = await conn.query('SELECT * FROM return_status WHERE issued_id = ?', [issued_id]);
      if (rRows.length > 0) {
        await conn.rollback();
        return res.status(400).json({ error: 'Book already returned' });
      }

      const issued = issuedRows[0];
      const returnDate = formatDateToSQL();
      const issuedDate = issued.issued_date;

      // compute fine (14 days free, 10 currency units per extra day)
      const diffDays = daysBetween(issuedDate, returnDate);
      const overdueDays = Math.max(0, diffDays - 14);
      const fine = overdueDays * 10;

      const returnId = 'RS-' + uuidv4().slice(0, 8);


      // insert into return_status
      await conn.query(
        `INSERT INTO return_status (return_id, issued_id, return_book_name, return_date, return_book_isbn)
         VALUES (?, ?, ?, ?, ?)`,
        [returnId, issued_id, issued.issued_book_name, returnDate, issued.issued_book_isbn]
      );

      // increment book quantity (if isbn known)
      if (issued.issued_book_isbn) {
        await conn.query('UPDATE books SET quantity = quantity + 1 WHERE isbn = ?', [issued.issued_book_isbn]);
      }

      await conn.commit();
      res.status(201).json({ message: 'Book returned', return_id: returnId, fine_amount: fine, overdue_days: overdueDays });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ error: 'Failed to process return' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------
   Overdue endpoint
   ------------------------- */
app.get('/overdue', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.issued_id, i.issued_member_id, m.member_name, i.issued_book_name, i.issued_book_isbn, i.issued_date,
              DATEDIFF(CURDATE(), i.issued_date) as days_since_issue
       FROM issued_status i
       JOIN members m ON i.issued_member_id = m.member_id
       LEFT JOIN return_status r ON i.issued_id = r.issued_id
       WHERE r.return_id IS NULL AND DATEDIFF(CURDATE(), i.issued_date) > 14`
    );
    // add overdue_days and fine to response
    const result = rows.map(r => {
      const overdue_days = Math.max(0, r.days_since_issue - 14);
      return { ...r, overdue_days, fine_amount: overdue_days * 10 };
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch overdue books' });
  }
});

/* -------------------------
   Reservation endpoint
   ------------------------- */
app.post('/reserve', async (req, res) => {
  try {
    const { member_id, isbn } = req.body;
    if (!member_id || !isbn) return res.status(400).json({ error: 'member_id and isbn required' });

    const reservationDate = formatDateToSQL();
    await pool.query('INSERT INTO reservations (member_id, isbn, reservation_date) VALUES (?, ?, ?)', [member_id, isbn, reservationDate]);
    res.status(201).json({ message: 'Reserved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reserve' });
  }
});

/* -------------------------
   Payment endpoint
   ------------------------- */
app.post('/payment', async (req, res) => {
  try {
    const { member_id, amount } = req.body;
    if (!member_id || amount === undefined) return res.status(400).json({ error: 'member_id and amount required' });
    const date = formatDateToSQL();
    await pool.query('INSERT INTO payments (member_id, amount, payment_date) VALUES (?, ?, ?)', [member_id, amount, date]);
    res.status(201).json({ message: 'Payment recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

/* -------------------------
   Start server
   ------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

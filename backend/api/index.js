import express from "express";
import { pool } from "../db.js";
import cors from "cors";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

async function createDefaultAdmin() {
  try {
    // Cek apakah akun admin sudah ada
    const result = await pool.query("SELECT * FROM users WHERE role = 'admin'");
    
    if (result.rows.length === 0) {
      // Jika admin belum ada, buat admin baru
      const hashedPassword = await argon2.hash("admin123");  // Hash password default

      await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
        ["admin", "admin@example.com", hashedPassword, "admin"]
      );

      console.log("Akun admin default berhasil dibuat.");
    } else {
      console.log("Akun admin sudah ada.");
    }
  } catch (error) {
    console.error("Gagal membuat akun admin default:", error);
  }
}


app.post("/api/login", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [req.body.username]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Verifikasi password
      if (await argon2.verify(user.password, req.body.password)) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });
        
        // Kirim respons dengan token dan user_id
        res.status(200).json({ token, user_id: user.id,role: user.role ,message: "Login berhasil" });
      } else {
        res.status(401).json({ message: "Password salah" });
      }
    } else {
      res.status(404).json({ message: `Username ${req.body.username} tidak ditemukan` });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});



app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  try {
    // Mengecek apakah username sudah ada
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username sudah digunakan" });
    }

    // Mengecek apakah email sudah ada
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email sudah digunakan" });
    }

    // Meng-hash password
    const hash = await argon2.hash(password);

    // Menyimpan pengguna baru ke database
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hash, role]
    );

    res.status(201).json({ message: "Pendaftaran berhasil", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).send("Token tidak valid.");
    }
  } else {
    res.status(401).send("Anda belum login (tidak ada otorisasi).");
  }
}



// CRUD Products
app.post("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.body.name, req.body.description, req.body.price, req.body.image_url, req.body.category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mendapatkan detail produk berdasarkan ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/api/products/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5 WHERE id = $6",
      [req.body.name, req.body.description, req.body.price, req.body.image_url, req.body.category, req.params.id]
    );
    res.json({ message: "Produk berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.send("Produk berhasil dihapus");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//stock
app.post("/api/products/:productId/stock", async (req, res) => {
  const { productId } = req.params;
  const { sizes } = req.body;

  // Validasi jika sizes tidak ada atau bukan array
  if (!sizes || !Array.isArray(sizes)) {
    return res.status(400).json({ error: "Invalid sizes data" });
  }

  try {
    const insertPromises = sizes.map(({ size, stock }) =>
      pool.query(
        "INSERT INTO stock (product_id, size, stock) VALUES ($1, $2, $3) RETURNING *",
        [productId, size, stock]
      )
    );

    const result = await Promise.all(insertPromises);
    const insertedStock = result.map(res => res.rows[0]);

    res.json(insertedStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to add sizes and stock." });
  }
});

app.get("/api/products/:id/stock", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT size, stock FROM stock WHERE product_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:productId/stock/:size", async (req, res) => {
  const { productId, size } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM stock WHERE product_id = $1 AND size = $2 RETURNING *",
      [productId, size]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stock entry not found" });
    }

    res.json({ message: "Stock berhasil dihapus", deletedStock: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CRUD Orders
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, req.body.order_date, req.body.status, req.body.total_amount, req.body.shipping_address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.get("/api/orders", authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.get('/api/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        o.user_id,
        p.name as product_name,
        oi.size,
        oi.quantity,
        oi.price,
        o.order_date,
        o.total_amount,
        o.shipping_address
      FROM 
        Orders o
      JOIN 
        Order_Items oi ON o.id = oi.order_id
      JOIN 
        Products p ON oi.product_id = p.id
      ORDER BY 
        o.order_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// CRUD Stock
app.post("/api/stock", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO stock (product_id, size, stock) VALUES ($1, $2, $3) RETURNING *",
      [req.body.product_id, req.body.size, req.body.stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/stock", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stock");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id/stock", async (req, res) => {
  const { sizes } = req.body; // sizes is expected to be an array of { size, stock }
  const productId = req.params.id;

  try {
    const client = await pool.connect();
    await client.query('BEGIN'); // Start a transaction

    for (const { size, stock } of sizes) {
      // Update the stock for each size
      const result = await client.query(
        `SELECT * FROM stock WHERE product_id = $1 AND size = $2`,
        [productId, size]
      );

      if (result.rows.length > 0) {
        // Update the existing stock record
        await client.query(
          `UPDATE stock SET stock = $1 WHERE product_id = $2 AND size = $3`,
          [stock, productId, size]
        );
      } else {
        // Insert a new stock record if it doesn't exist
        await client.query(
          `INSERT INTO stock (product_id, size, stock) VALUES ($1, $2, $3)`,
          [productId, size, stock]
        );
      }
    }

    await client.query('COMMIT'); // Commit the transaction
    client.release();

    res.json({ message: "Stok berhasil diperbarui" });
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback in case of error
    client.release();
    res.status(500).json({ error: err.message });
  }
});


// CRUD Order Items
app.post("/api/order-items", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.body.order_id, req.body.product_id, req.body.size, req.body.quantity, req.body.price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/order-items", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/order-items/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "UPDATE order_items SET order_id = $1, product_id = $2, size = $3, quantity = $4, price = $5 WHERE id = $6",
      [req.body.order_id, req.body.product_id, req.body.size, req.body.quantity, req.body.price, req.params.id]
    );
    res.json({ message: "Order item berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/order-items/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM order_items WHERE id = $1", [req.params.id]);
    res.send("Order item berhasil dihapus");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, size, quantity } = req.body;

  if (size === undefined || size === null) {
    return res.status(400).json({ error: 'Size is required' });
  }

  try {
    await pool.query(
      'INSERT INTO Shopping_Cart (user_id, product_id, size, quantity) VALUES ($1, $2, $3, $4)',
      [user_id, product_id, size, quantity]
    );
    res.status(200).json({ message: 'Item added to cart successfully!' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});


// backend/routes/cart.js

app.get('/cart', authenticateToken, async (req, res) => {
  const user_id = req.user.id; // Assuming req.user contains the authenticated user's info

  console.log("User ID from request:", user_id); // Log user_id

  try {
    const result = await pool.query(`
      SELECT 
        Shopping_Cart.id,Shopping_Cart.product_id, Shopping_Cart.size, Shopping_Cart.quantity,
        Products.name, Products.price, Products.image_url 
      FROM Shopping_Cart
      JOIN Products ON Shopping_Cart.product_id = Products.id
      WHERE user_id = $1
    `, [user_id]);

    console.log("Cart details fetched:", result.rows); // Log the result

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching cart details:', error);
    res.status(500).json({ error: 'Failed to fetch cart details' });
  }
});

app.put('/cart/update', authenticateToken, async (req, res) => {
  const { product_id, size, quantity } = req.body;
  const user_id = req.user.id;

  console.log('Received data:', { product_id, size, quantity, user_id }); // Tambahkan log

  try {
    const result = await pool.query(
      `UPDATE Shopping_Cart 
       SET quantity = $1 
       WHERE user_id = $2 AND product_id = $3 AND size = $4`,
      [quantity, user_id, product_id, size]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ error: 'Failed to update cart item quantity' });
  }
});

app.put("/api/shopping-cart/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "UPDATE shopping_cart SET product_id = $1, size = $2, quantity = $3 WHERE id = $4 AND user_id = $5",
      [req.body.product_id, req.body.size, req.body.quantity, req.params.id, req.user.id]
    );
    res.json({ message: "Item keranjang belanja berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Menghapus item dari cart
app.delete("/cart/:id", async (req, res) => {
  try {
    // Ambil ID item dari parameter
    const itemId = req.params.id;

    // Hapus item dari tabel Shopping_Cart
    const result = await pool.query("DELETE FROM Shopping_Cart WHERE id = $1 RETURNING *", [itemId]);

    // Jika item ditemukan dan dihapus, kirim respons sukses
    if (result.rowCount > 0) {
      res.json({ success: true, message: "Item berhasil dihapus dari keranjang" });
    } else {
      res.status(404).json({ success: false, message: "Item tidak ditemukan di keranjang" });
    }
  } catch (err) {
    // Tangani kesalahan
    res.status(500).json({ error: err.message });
  }
});




// CRUD Payment
app.post("/api/payment", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO payment (order_id, payment_method, payment_status) VALUES ($1, $2, $3) RETURNING *",
      [req.body.order_id, req.body.payment_method, req.body.payment_status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.get("/api/payment", authenticateToken, async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM payment WHERE order_id IN (SELECT id FROM orders WHERE user_id = $1)", [req.user.id]);
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post('/checkout', authenticateToken, async (req, res) => {
  const { shipping_address, payment_method, total_amount } = req.body;
  const user_id = req.user.id;

  const client = await pool.connect(); // Koneksi ke database
  try {
    await client.query('BEGIN'); // Mulai transaksi

    // Membuat order baru
    const result = await client.query(
      `INSERT INTO Orders (user_id, shipping_address, total_amount, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING id`,
      [user_id, shipping_address, total_amount]
    );
    const order_id = result.rows[0].id;

    // Menyimpan informasi pembayaran
    await client.query(
      `INSERT INTO Payment (order_id, payment_method, payment_status) 
       VALUES ($1, $2, 'unpaid')`,
      [order_id, payment_method]
    );

    // Mengambil item keranjang untuk user yang sedang login
    const cartItems = await client.query(
      `SELECT product_id, size, quantity FROM Shopping_Cart WHERE user_id = $1`,
      [user_id]
    );

    if (cartItems.rows.length === 0) {
      throw new Error("Keranjang belanja kosong");
    }

    // Iterasi item keranjang untuk mengurangi stok dan menyimpan ke OrderItems
    for (let item of cartItems.rows) {
      const { product_id, size, quantity } = item;

      // Periksa apakah stok mencukupi
      const stockCheck = await client.query(
        `SELECT stock FROM Stock WHERE product_id = $1 AND size = $2`,
        [product_id, size]
      );

      if (stockCheck.rows.length === 0) {
        throw new Error(`Stok tidak ditemukan untuk produk ID ${product_id} dan ukuran ${size}`);
      }

      const availableStock = stockCheck.rows[0].stock;

      if (availableStock < quantity) {
        throw new Error(`Stok tidak mencukupi untuk produk ID ${product_id} dengan ukuran ${size}`);
      }

      // Kurangi stok produk
      await client.query(
        `UPDATE Stock SET stock = stock - $1 WHERE product_id = $2 AND size = $3`,
        [quantity, product_id, size]
      );

      // Simpan detail order ke tabel OrderItems
      await client.query(
        `INSERT INTO Order_Items (order_id, product_id, size, quantity, price) 
         VALUES ($1, $2, $3, $4, (SELECT price FROM Products WHERE id = $2))`,
        [order_id, product_id, size, quantity]
      );
    }

    // Kosongkan keranjang setelah pesanan berhasil dibuat
    await client.query(`DELETE FROM Shopping_Cart WHERE user_id = $1`, [user_id]);

    await client.query('COMMIT'); // Selesaikan transaksi
    res.json({ success: true, message: "Order berhasil diproses, stok diperbarui" });
  } catch (error) {
    await client.query('ROLLBACK'); // Batalkan transaksi jika terjadi kesalahan
    console.error("Error processing checkout:", error);
    res.status(500).json({ success: false, message: "Gagal memproses order" });
  } finally {
    client.release(); // Pastikan koneksi database dilepas
  }
});

app.get('/cart/total', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT SUM(Products.price * Shopping_Cart.quantity) AS total_amount
       FROM Shopping_Cart
       JOIN Products ON Shopping_Cart.product_id = Products.id
       WHERE Shopping_Cart.user_id = $1`,
      [user_id]
    );

    const totalAmount = result.rows[0].total_amount || 0;

    res.json({ total_amount: totalAmount });
  } catch (error) {
    console.error("Error fetching total amount:", error);
    res.status(500).json({ error: "Failed to fetch total amount" });
  }
});



createDefaultAdmin();
app.listen(3000, () => console.log("Server berhasil dijalankan di port 3000"));


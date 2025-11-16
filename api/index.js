const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect('mongodb://mongo:27017/db_kampus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB - db_kampus'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ========== SCHEMA POSTS ==========
const postsSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  category: String,
  tags: [String],
  views: Number,
  likes: Number,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'posts' });

const Posts = mongoose.model('posts', postsSchema);

// ========== SCHEMA PRODUK ==========
const produkSchema = new mongoose.Schema({
  kode_produk: String,
  nama: String,
  kategori: String,
  sub_kategori: String,
  harga: Number,
  stok: Number,
  deskripsi: String,
  spesifikasi: mongoose.Schema.Types.Mixed,
  berat: Number,
  rating: Number,
  terjual: Number,
  gambar: String,
  tersedia: Boolean,
  createdAt: Date
}, { collection: 'produk' });

const Produk = mongoose.model('produk', produkSchema);

// ========== ROUTES POSTS ==========
app.get('/api/posts', async (req, res) => {
  console.log('📥 GET /api/posts');
  try {
    const posts = await Posts.find();
    console.log('Found ${posts.length} posts');
    res.json(posts);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post tidak ditemukan' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const post = new Posts(req.body);
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ROUTES PRODUK ==========
app.get('/api/produk', async (req, res) => {
  console.log('📥 GET /api/produk');
  try {
    const produk = await Produk.find();
    console.log('Found ${produk.length} produk');
    res.json(produk);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/produk/:kode', async (req, res) => {
  try {
    const produk = await Produk.findOne({ kode_produk: req.params.kode });
    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json(produk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/produk', async (req, res) => {
  const produk = new Produk(req.body);
  try {
    const newProduk = await produk.save();
    res.status(201).json(newProduk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== ROOT ENDPOINT ==========
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ API Anime Paradise berjalan!',
    database: 'db_kampus',
    endpoints: {
      posts: 'GET /api/posts',
      produk: 'GET /api/produk'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoints available',
    routes: {
      posts: '/api/posts',
      produk: '/api/produk'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ${PORT}');
  console.log('Database: db_kampus');
  console.log('Endpoints:');
  console.log(`   - GET http://localhost:${PORT}/api/posts`);
  console.log(`   - GET http://localhost:${PORT}/api/produk`);
});

const express = require('express');
const hbs = require('hbs');
const handlebarsHelpers = require('handlebars-helpers')(); // Tambahkan ini
const fetchNews = require('./utils/berita');
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');



const app = express();
const port = 3000;

hbs.registerHelper(handlebarsHelpers);

// Mengatur view engine
app.set("view engine", "hbs");

// Mengatur direktori untuk file statis
const direktoriPublic = path.join(__dirname, "../public");
app.use(express.static(direktoriPublic));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mengatur direktori views dan partials untuk Handlebars
const direktoriViews = path.join(__dirname, "../templates/views");
const direktoriPartials = path.join(__dirname, "../templates/partials");

app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
hbs.registerPartials(direktoriPartials);
app.set("views", direktoriViews);

// Rute untuk halaman utama dengan navbar kategori
app.get('/dashboard', async (req, res) => {
  try {
    const categories = [
      "politik",
      "hukum",
      "ekonomi",
      "olahraga",
      "humaniora",
      "lifestyle",
      "hiburan",
      "dunia",
      "tekno",
    ];

    const selectedCategory = req.query.category || "politik";

    // Ambil data berita untuk kategori yang dipilih
    const newsData = await fetchNews(selectedCategory);

    res.render('dashboard', {
      pageTitle: `Dashboard ${selectedCategory}`,
      categories,
      selectedCategory,
      news: newsData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rute untuk halaman berita dengan navbar kategori
app.get('/', async (req, res) => {
  try {
    const categories = [
      "politik",
      "hukum",
      "ekonomi",
      "olahraga",
      "humaniora",
      "lifestyle",
      "hiburan",
      "dunia",
      "tekno",
    ];

    // Ambil kategori dari parameter query, jika tidak ada, gunakan "politik" sebagai default
    const selectedCategory = req.query.category || "politik";

    // Ambil data berita untuk kategori yang dipilih
    const newsData = await fetchNews(selectedCategory);

    res.render('berita', {
      pageTitle: `Berita ${selectedCategory}`,
      categories,
      selectedCategory,
      news: newsData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rute untuk menampilkan berita berdasarkan kategori
app.get('/category/:category', async (req, res) => {
  const requestedCategory = req.params.category;

  try {
    const newsData = await fetchNews(requestedCategory);

    res.render('berita', {
      pageTitle: `Berita ${requestedCategory}`,
      categories: [],
      selectedCategory: requestedCategory,
      news: newsData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Rute untuk halaman bantuan dengan navbar kategori
app.get('/bantuan', async (req, res) => {
    try {
      const categories = [
        "politik",
        "hukum",
        "ekonomi",
        "olahraga",
        "humaniora",
        "lifestyle",
        "hiburan",
        "dunia",
        "tekno",
      ];
  
      const selectedCategory = req.query.category || "politik";
  
      // Ambil data berita untuk kategori yang dipilih
      const newsData = await fetchNews(selectedCategory);
  
      res.render('bantuan', {
        pageTitle: `Bantuan ${selectedCategory}`,
        categories,
        selectedCategory,
        news: newsData,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Endpoint untuk menangani formulir laporan
app.post("/lapor", (req, res) => {
  // Ambil data dari formulir
  const { nama, email, pesan } = req.body;

  // Konfigurasi transporter nodemailer (sesuaikan dengan akun email Anda)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "siptyasavirarahmi1@gmail.com",
      pass: "ytnzikfqcppjvmtd",
    },
  });

  // Konfigurasi email
  const mailOptions = {
    from: "siptyasavirarahmi1@gmail.com",
    to: "siptyasavirarahmi1@gmail.com",
    subject: "Laporan Pengguna",
    text: `Nama: ${nama}\nEmail: ${email}\nPesan: ${pesan}`,
  };

  // Kirim email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect('/bantuan'); // Redirect setelah mengirim formulir
    }
    });
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

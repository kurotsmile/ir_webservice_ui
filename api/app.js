import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Thiết lập thư mục views và view engine
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');

// Thiết lập thư mục public
app.use('/public', express.static(path.join(__dirname, '../public')));

// Các route
app.get('/', (req, res) => {
    res.render('index2');
});

app.get('/login', (req, res) => {
    res.render('p1_login');
});

// Định nghĩa export để Vercel sử dụng
export default app;

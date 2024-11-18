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
app.use((req, res, next) => {
    res.locals.ver = '1.1.2';
    res.locals.currentRoute = req.path;
    next();
});

app.get('/', (req, res) => {
    res.render('p1_login');
});

app.get('/home', (req, res) => {
    res.render('p6_home');
});

app.get('/login', (req, res) => {
    res.render('p1_login');
});

app.get('/service_login', (req, res) => {
    res.render('p2_service_login');
});

app.get('/change_password', (req, res) => {
    res.render('p3_change_password');
});

app.get('/pset_list', (req, res) => {
    res.render('p4_pset_list');
});

app.get('/alert_waring', (req, res) => {
    res.render('p9_alet_warning');
});

app.get('/edit_pset', (req, res) => {
    res.render('p13_edit_pset');
});

app.get('/forward_operation', (req, res) => {
    res.render('p16_forward_operation');
});

app.get('/jobs', (req, res) => {
    res.render('p22_jobs');
});

app.get('/edit_jobs', (req, res) => {
    res.render('p23_edit_jobs');
});

app.get('/edit_jobs_interlocks', (req, res) => {
    res.render('p25_edit_jobs_interlocks');
});

app.get('/add_pset', (req, res) => {
    res.render('p24_add_pset');
});

app.get('/user_profile', (req, res) => {
    res.render('p60_user_profile');
});

app.get('/about_us', (req, res) => {
    res.render('p61_about_us');
});

app.get('/barcode', (req, res) => {
    res.render('p55_barcode');
});

app.get('/alarm', (req, res) => {
    res.render('p62_alarm');
});

// Định nghĩa export để Vercel sử dụng
export default app;

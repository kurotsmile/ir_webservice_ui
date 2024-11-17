
import express from 'express';

const app = express();
const port = 3011;

app.set('views', './src/views'); 
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


app.get('/', (req, res) => {
    res.render('index2');
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

app.get('/jobs', (req, res) => {
    res.render('p22_jobs');
});

app.listen(port, () => {
    console.log('App is running...');
});

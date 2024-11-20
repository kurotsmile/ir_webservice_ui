import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use((req, res, next) => {
    res.locals.ver = '1.1.9';
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
    const filePath = path.join(__dirname, '../public', 'jsonData', 'PsetList.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const psetList = JSON.parse(data);
        res.render('p4_pset_list', { psetList });
    });
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
    const filePath = path.join(__dirname, '../public', 'jsonData', 'JobList.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const jsonList = JSON.parse(data);
        res.render('p22_jobs', { jsonList });
    });
});

app.get('/edit_jobs', (req, res) => {
    res.render('p23_edit_jobs');
});

app.get('/add_pset', (req, res) => {
    res.render('p24_add_pset');
});

app.get('/edit_jobs_interlocks', (req, res) => {
    res.render('p25_edit_jobs_interlocks');
});

app.get('/ethernet_setting', (req, res) => {
    res.render('p28_ethernet_setting');
});

app.get('/fail_rules', (req, res) => {
    res.render('p26_fail_rules');
});

app.get('/global_settings', (req, res) => {
    res.render('p27_global_settings');
});

app.get('/accessories', (req, res) => {
    res.render('p29_accessories');
});

app.get('/date_and_time', (req, res) => {
    res.render('p30_date_and_time');
});

app.get('/system_initialisation', (req, res) => {
    res.render('p31_system_initialisation');
});

app.get('/wifi_setting_and_hotspot', (req, res) => {
    res.render('p34_wifi_setting_and_hotspot');
});

app.get('/buzzer_setting', (req, res) => {
    res.render('p35_buzzer_setting');
});

app.get('/pfop_settings', (req, res) => {
    res.render('p36_pfop_settings');
});

app.get('/bcode_vin_setting', (req, res) => {
    res.render('p37_bcode_vin_setting');
});

app.get('/barcode_string', (req, res) => {
    res.render('p38_barcode_string');
});

app.get('/ac_toolsnet_setting', (req, res) => {
    res.render('p39_ac_toolsnet_setting');
});

app.get('/fieldbus_settings', (req, res) => {
    res.render('p40_fieldbus_settings');
});

app.get('/fieldbus_io_setting', (req, res) => {
    res.render('p41_fieldbus_io_setting');
});

app.get('/cycle_result', (req, res) => {
    res.render('p47_cycle_result');
});

app.get('/barcode', (req, res) => {
    res.render('p55_barcode');
});

app.get('/tool_calibartion', (req, res) => {
    res.render('p56_tool_calibartion');
});

app.get('/calibration_data', (req, res) => {
    res.render('p57_calibration_data');
});

app.get('/calibration_result', (req, res) => {
    res.render('p58_calibration_result');
});

app.get('/kt_calibration_result', (req, res) => {
    res.render('p59_kt_calibration_result');
});

app.get('/user_profile', (req, res) => {
    res.render('p60_user_profile');
});

app.get('/about_us', (req, res) => {
    res.render('p61_about_us');
});

app.get('/alarm', (req, res) => {
    res.render('p62_alarm');
});

app.get('/edit_alarm', (req, res) => {
    res.render('p63_alarm_edit');
});

export default app;

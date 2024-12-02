import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkAndReadFile, readJsonFile, get_file_system,fileExists } from './src/script/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express();
const port = 3000;

app.set('views', './src/views'); 
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use((req, res, next) => {
    res.locals.ver = '1.4.2';
    res.locals.currentRoute = req.path;
    next();
});
app.use(express.json());

app.get('/', (req, res) => {
    res.render('p1_login');
});

app.get('/home', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("JobList"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'JobList.json');

        const filePath = (await checkAndReadFile(primaryPath)) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p6_home', { jsonList: jsonData });
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
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

app.get('/pset_list', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("PsetList"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'PsetList.json');
        const jsonPDefaultPath = path.join(__dirname, 'public', 'jsonData', 'PDefault.json');

        const filePath = (await checkAndReadFile(primaryPath)) ? primaryPath : secondaryPath;

        const jsonData = await readJsonFile(filePath);
        const jsonPDefault = await readJsonFile(jsonPDefaultPath);

        const psetList = Array.isArray(jsonData) ? jsonData : [];
        for (let i = psetList.length; i < 16; i++) {
            psetList.push({ ID: "", Name: "", Status: false, StepCount: 0, index: i + 1 });
        }

        res.render('p4_pset_list', { psetList, jsonPDefault });
    } catch (error) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});

app.get('/alert_waring', (req, res) => {
    res.render('p9_alet_warning');
});

app.get('/edit_pset', async (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

    try {
        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        let jsonData;
        if (primaryData) {
            jsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            jsonData = JSON.parse(secondaryData);
        } else {
            jsonData = {};
        }
        res.render('p13_edit_pset', { jsonData, id, name });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/forward_operation', async (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

    try {
        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        let jsonData;
        if (primaryData) {
            jsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            jsonData = JSON.parse(secondaryData);
        } else {
            jsonData = {};
        }
        res.render('p16_forward_operation', { jsonData, id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/edit_pset_step', async (req, res) => {
    const id = req.query.id;
    const index_step = req.query.index_step;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

    try {
        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        let jsonData;
        if (primaryData) {
            jsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            jsonData = JSON.parse(secondaryData);
        } else {
            jsonData = {};
        }

        res.render('p19_edit_pset_step', { jsonData, id, index_step });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/reverse_operation', async (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

    try {
        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        let jsonData;
        if (primaryData) {
            jsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            jsonData = JSON.parse(secondaryData);
        } else {
            jsonData = {};
        }

        res.render('p20_reverse_operation', { jsonData, id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/jobs', async (req, res) => {
    const primaryPath = path.join(get_file_system("JobList"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'JobList.json');
    const jsonJDefaultPath = path.join(__dirname, 'public', 'jsonData', 'JDefault.json');

    try {
        const primaryData = await checkAndReadFile(primaryPath);
        const filePath = primaryData ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        const jsonJDefault = await readJsonFile(jsonJDefaultPath);

        const jsonList = Array.isArray(jsonData) ? jsonData : [];
        for (let i = jsonList.length; i < 32; i++) {
            const obj_j = { ...jsonJDefault, index: i + 1 };
            jsonList.push(obj_j);
        }

        res.render('p22_jobs', { jsonList, jsonJDefault });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/edit_jobs', async (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);
    const plistPath = path.join(get_file_system('PsetList'));

    try {
        const [primaryData, secondaryData, psetListData] = await Promise.all([
            checkAndReadFile(primaryPath),
            checkAndReadFile(secondaryPath),
            checkAndReadFile(plistPath),
        ]);

        const jsonData = primaryData ? JSON.parse(primaryData) : secondaryData ? JSON.parse(secondaryData) : {};
        const psetList = psetListData ? JSON.parse(psetListData) : {};

        res.render('p23_edit_jobs', { jsonData, psetList, id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/add_pset', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("PsetList"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'PsetList.json');
        const jsonPDefaultPath = path.join(__dirname, 'public', 'jsonData', 'PDefault.json');

        const filePath = await checkAndReadFile(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        const jsonPDefault = await readJsonFile(jsonPDefaultPath);
        const psetList = Array.isArray(jsonData) ? jsonData : [];

        for (let i = psetList.length; i < 16; i++) {
            psetList.push({ ID: "", Name: "", Status: false, StepCount: 0, index: i + 1 });
        }

        const id = req.query.id;
        const specificPrimaryPath = path.join(get_file_system(id));
        const specificSecondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

        const primaryData = await checkAndReadFile(specificPrimaryPath);
        const secondaryData = await checkAndReadFile(specificSecondaryPath);
        
        let specificJsonData;
        if (primaryData) {
            specificJsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            specificJsonData = JSON.parse(secondaryData);
        } else {
            specificJsonData = {};
        }

        res.render('p24_add_pset', { jsonData: specificJsonData, id, psetList, jsonPDefault });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});


app.get('/edit_jobs_interlocks', async (req, res) => {
    try {
        const id = req.query.id;
        const primaryPath = path.join(get_file_system(id));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id}.json`);

        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        const jsonData = primaryData ? JSON.parse(primaryData) : secondaryData ? JSON.parse(secondaryData) : {};

        res.render('p25_edit_jobs_interlocks', { jsonData, id });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/fail_rules', async (req, res) => {
    try {
        const id_job = req.query.id_job;
        const index_p = req.query.index_p;
        const primaryPath = path.join(get_file_system(id_job));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${id_job}.json`);

        const primaryData = await checkAndReadFile(primaryPath);
        const secondaryData = await checkAndReadFile(secondaryPath);

        const jsonData = primaryData ? JSON.parse(primaryData) : secondaryData ? JSON.parse(secondaryData) : {};

        res.render('p26_fail_rules', { jsonData, id_job, index_p });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});


app.get('/global_settings', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p27_global_settings', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/ethernet_setting', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p28_ethernet_setting', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/accessories', (req, res) => {
    res.render('p29_accessories');
});

app.get('/date_and_time', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p30_date_and_time', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/system_initialisation', (req, res) => {
    res.render('p31_system_initialisation');
});

app.get('/wifi_setting_and_hotspot', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p34_wifi_setting_and_hotspot', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/buzzer_setting', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p35_buzzer_setting', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/pfop_settings', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Communication"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p36_pfop_settings', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/bcode_vin_setting', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Settings"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p37_bcode_vin_setting', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/barcode_string', (req, res) => {
    res.render('p38_barcode_string');
});

app.get('/ac_toolsnet_setting', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Communication"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p39_ac_toolsnet_setting', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/fieldbus_settings', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Communication"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p40_fieldbus_settings', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/fieldbus_io_setting', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("Communication"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p41_fieldbus_io_setting', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/cycle_result', (req, res) => {
    res.render('p47_cycle_result');
});

app.get('/backup_and_restore', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("System"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p48_backup_and_restore', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
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

app.get('/alarm', async (req, res) => {
    try {
        const primaryPath = path.join(get_file_system("System"));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);

        res.render('p62_alarm', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});
app.get('/edit_alarm', async (req, res) => {
    const index_edit = req.query.index_edit;
    const primaryPath = path.join(get_file_system("System"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

    try {
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p63_alarm_edit', { jsonData, index_edit });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/debug_logs', (req, res) => {
    res.render('p64_debug_logs');
});

app.get('/dio', async (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    try {
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p65_dio', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/dio_edit', async (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    try {
        const filePath = await fileExists(primaryPath) ? primaryPath : secondaryPath;
        const jsonData = await readJsonFile(filePath);
        res.render('p66_dio_edit', { jsonData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.post('/save-json', async (req, res) => {
    const { data_json, file_name } = req.body;

    if (!data_json || !file_name) {
        return res.status(400).json({ error: 'data_json and file_name are required' });
    }
    const filePath = path.join(get_file_system(file_name));
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data_json, null, 2));
        console.log(`File saved successfully at ${filePath}`);
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (err) {
        console.error('Error writing JSON file:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.post('/update-json', async (req, res) => {
    const { index, dataJson, file_name } = req.body;

    if (index === undefined || !dataJson) {
        return res.status(400).json({ error: "Missing index or dataJson in request body" });
    }

    const primaryPath = path.join(get_file_system(file_name));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', file_name + '.json');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : secondaryPath;

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        if (index < 0 || index >= jsonData.length) {
            return res.status(400).json({ error: "Invalid index provided" });
        }

        jsonData[index] = { ...jsonData[index], ...dataJson };

        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

        res.status(200).json({
            message: "Update successful",
            updatedObject: jsonData[index],
        });
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            return res.status(500).json({ error: `File not found: ${err.message}` });
        }
        return res.status(500).json({ error: `Error processing file: ${err.message}` });
    }
});

app.post('/update-list-by-id', async (req, res) => {
    const { dataJson, file_name } = req.body;

    if (!dataJson || !dataJson.ID) {
        return res.status(400).json({ error: "Missing dataJson or ID in request body" });
    }

    const primaryPath = path.join(get_file_system(file_name));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', file_name + '.json');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : secondaryPath;

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const objIndex = jsonData.findIndex(obj => obj.ID === dataJson.ID);
        if (objIndex === -1) {
            return res.status(400).json({ error: "Object with the provided ID not found" });
        }

        jsonData[objIndex] = { ...jsonData[objIndex], ...dataJson };

        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

        res.status(200).json({
            message: "Update successful",
            updatedObject: jsonData[objIndex],
        });
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            return res.status(500).json({ error: `File not found: ${err.message}` });
        }
        return res.status(500).json({ error: `Error processing file: ${err.message}` });
    }
});

app.post('/update-list-by-field', async (req, res) => {
    try {
        const { dataJson, file_name } = req.body;
        if (!dataJson || !dataJson.ID) {
            return res.status(400).json({ error: "Missing dataJson or ID in request body" });
        }

        const primaryPath = path.join(get_file_system(file_name));
        const secondaryPath = path.join(__dirname, 'public', 'jsonData', `${file_name}.json`);

        let filePath;
        try {
            await fs.access(primaryPath);
            filePath = primaryPath;
        } catch {
            filePath = secondaryPath;
        }

        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const objIndex = jsonData.findIndex(obj => obj.ID === dataJson.ID);
        if (objIndex === -1) {
            return res.status(400).json({ error: "Object with the provided ID not found" });
        }

        Object.assign(jsonData[objIndex], dataJson);

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
        res.status(200).json({
            message: "Update successful",
            updatedObject: jsonData[objIndex],
        });
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.post('/delete-file', async (req, res) => {
    const { file_name } = req.body;
    if (!file_name) {
        return res.status(400).json({ success: false, message: 'File name cannot be empty' });
    }

    const filePath = path.join(get_file_system(file_name));

    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        await fs.promises.unlink(filePath);

        return res.status(200).json({ success: true, message: 'File deleted successfully.' });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ success: false, message: 'File does not exist.' });
        }
        return res.status(500).json({ success: false, message: 'File deletion failed.', error: err.message });
    }
});

app.listen(port, () => {
    console.log('App is running...');
});
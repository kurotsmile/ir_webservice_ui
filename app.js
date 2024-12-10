import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express();
const port = 3000;

function get_file_system(nameFile) {
    const dirData = path.join(os.homedir(), 'Data');

    if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, { recursive: true });
    
    const filePath = path.join(dirData, `${nameFile}.json`);
    return filePath;
}

const checkAndReadFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(null);
            } else {
                fs.readFile(filePath, 'utf8', (readErr, data) => {
                    if (readErr) {
                        reject(new Error(`Failed to read file at ${filePath}: ${readErr.message}`));
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    });
};

const readJsonFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(`Failed to read file at ${filePath}: ${err.message}`));
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (parseErr) {
                    reject(new Error(`Error parsing JSON data from ${filePath}: ${parseErr.message}`));
                }
            }
        });
    });
};


app.set('views', './src/views'); 
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/public', express.static('public'));
app.use((req, res, next) => {
    res.locals.ver = '1.5.1';
    res.locals.currentRoute = req.path;
    next();
});
app.use(express.json());

app.get('/', (req, res) => {
    res.render('p1_login');
});

app.get('/home', (req, res) => {
    const primaryPath = path.join(get_file_system("JobList"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'JobList.json');

    return new Promise((resolve, reject) => {
        fs.access(primaryPath, fs.constants.F_OK, (err) => {
            const filePath = err ? secondaryPath : primaryPath;
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    reject(new Error(`Failed to read file at ${filePath}: ${readErr.message}`));
                } else {
                    try {
                        const jsonData = JSON.parse(data);
                        res.render('p6_home', { jsonList:jsonData });
                    } catch (parseErr) {
                        reject(new Error(`Error parsing JSON data from ${filePath}: ${parseErr.message}`));
                    }
                }
            });
        });
    });
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
    const primaryPath = path.join(get_file_system("PsetList"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'PsetList.json');
    const jsonPDefaultPath = path.join(__dirname, 'public', 'jsonData', 'PDefault.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            const jsonPDefault = await readJsonFile(jsonPDefaultPath);
            const psetList = Array.isArray(jsonData) ? jsonData : [];

            for (let i = psetList.length; i < 16; i++) psetList.push({ID: "",Name: "",Status: false,StepCount: 0,index: i + 1});

            res.render('p4_pset_list', { psetList, jsonPDefault });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/alert_waring', (req, res) => {
    res.render('p9_alet_warning');
});

app.get('/edit_pset', (req, res) => {
    const id = req.query.id;
    const name = req.query.name;

    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p13_edit_pset', { jsonData, id, name });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/forward_operation', (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p16_forward_operation', { jsonData, id});
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/edit_pset_step', (req, res) => {
    const id = req.query.id;
    const index_step = req.query.index_step;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p19_edit_pset_step', { jsonData, id,index_step});
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/reverse_operation', (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p20_reverse_operation', { jsonData, id});
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/jobs', (req, res) => {
    const primaryPath = path.join(get_file_system("JobList"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'JobList.json');
    const jsonJDefaultPath = path.join(__dirname, 'public', 'jsonData', 'JDefault.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            const jsonJDefault = await readJsonFile(jsonJDefaultPath);
            const jsonList = Array.isArray(jsonData) ? jsonData : [];

            for (let i = jsonList.length; i < 32; i++){
                let obj_j=jsonJDefault;
                obj_j.index=i + 1;
                jsonList.push(obj_j);
            }

            res.render('p22_jobs', { jsonList, jsonJDefault });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});


app.get('/edit_jobs', async (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');
    const plistPath = path.join(get_file_system('PsetList'));

    try {
        const [primaryData, secondaryData, psetListData] = await Promise.all([
            checkAndReadFile(primaryPath),
            checkAndReadFile(secondaryPath),
            checkAndReadFile(plistPath)
        ]);

        let jsonData = {};
        if (primaryData) {
            jsonData = JSON.parse(primaryData);
        } else if (secondaryData) {
            jsonData = JSON.parse(secondaryData);
        }

        let psetList = {};
        if (psetListData) {
            psetList = JSON.parse(psetListData);
        }

        res.render('p23_edit_jobs', { jsonData, psetList, id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/add_pset', (req, res) => {
    const primaryPath = path.join(get_file_system("PsetList"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'PsetList.json');
    const jsonPDefaultPath = path.join(__dirname, 'public', 'jsonData', 'PDefault.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            const jsonPDefault = await readJsonFile(jsonPDefaultPath);
            const psetList = Array.isArray(jsonData) ? jsonData : [];

            for (let i = psetList.length; i < 16; i++) psetList.push({ID: "",Name: "",Status: false,StepCount: 0,index: i + 1});

            const id = req.query.id;
            const primaryPath = path.join(get_file_system(id));
            const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');
        
            Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
                .then(([primaryData, secondaryData]) => {
                    let jsonData;
                    if (primaryData) {
                        jsonData = JSON.parse(primaryData);
                    } else if (secondaryData) {
                        jsonData = JSON.parse(secondaryData);
                    } else {
                        jsonData = {};
                    }
                    res.render('p24_add_pset', { jsonData, id,psetList,jsonPDefault});
                })
                .catch((err) => {
                    console.error(err.message);
                    res.status(500).send('An error occurred while processing your request.');
                });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/edit_jobs_interlocks', (req, res) => {
    const id = req.query.id;
    const primaryPath = path.join(get_file_system(id));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p25_edit_jobs_interlocks', { jsonData, id });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/fail_rules', (req, res) => {
    const id_job = req.query.id_job;
    const index_p=req.query.index_p;
    const primaryPath = path.join(get_file_system(id_job));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', id_job + '.json');

    Promise.all([checkAndReadFile(primaryPath), checkAndReadFile(secondaryPath)])
        .then(([primaryData, secondaryData]) => {
            let jsonData;
            if (primaryData) {
                jsonData = JSON.parse(primaryData);
            } else if (secondaryData) {
                jsonData = JSON.parse(secondaryData);
            } else {
                jsonData = {};
            }
            res.render('p26_fail_rules', { jsonData, id_job,index_p});
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send('An error occurred while processing your request.');
        });
});

app.get('/global_settings', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p27_global_settings', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/ethernet_setting', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p28_ethernet_setting', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/accessories', (req, res) => {
    res.render('p29_accessories');
});

app.get('/date_and_time', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p30_date_and_time', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/system_initialisation', (req, res) => {
    res.render('p31_system_initialisation');
});

app.get('/wifi_setting_and_hotspot', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p34_wifi_setting_and_hotspot', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/buzzer_setting', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p35_buzzer_setting', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/pfop_settings', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p36_pfop_settings', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/bcode_vin_setting', (req, res) => {
    const primaryPath = path.join(get_file_system("Settings"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Settings.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p37_bcode_vin_setting', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/barcode_string', (req, res) => {
    res.render('p38_barcode_string');
});

app.get('/ac_toolsnet_setting', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p39_ac_toolsnet_setting', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/fieldbus_settings', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p40_fieldbus_settings', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/fieldbus_io_setting', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p41_fieldbus_io_setting', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/cycle_result', (req, res) => {
    res.render('p47_cycle_result');
});

app.get('/backup_and_restore', (req, res) => {
    const primaryPath = path.join(get_file_system("System"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p48_backup_and_restore', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/firmware_upgrade', (req, res) => {
    const primaryPath = path.join(get_file_system("System"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p49_firmware_upgrade', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/accessories_edit', (req, res) => {
    res.render('p51_accessories_edit');
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
    const primaryPath = path.join(get_file_system("System"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p62_alarm', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/edit_alarm', (req, res) => {
    const index_edit = req.query.index_edit;
    const primaryPath = path.join(get_file_system("System"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'System.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p63_alarm_edit', {jsonData,index_edit});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/debug_logs', (req, res) => {
    res.render('p64_debug_logs');
});

app.get('/dio', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p65_dio', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.get('/dio_edit', (req, res) => {
    const primaryPath = path.join(get_file_system("Communication"));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', 'Communication.json');

    fs.access(primaryPath, fs.constants.F_OK, async (err) => {
        const filePath = err ? secondaryPath : primaryPath;
        try {
            const jsonData = await readJsonFile(filePath);
            res.render('p66_dio_edit', {jsonData});
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
});

app.post('/save-json', (req, res) => {
    const { data_json, file_name } = req.body;
    if (!data_json || !file_name) {
        return res.status(400).json({ error: 'data_json and file_name are required' });
    }
    const filePath = path.join(get_file_system(file_name));
    fs.writeFile(filePath, JSON.stringify(data_json, null, 2), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log(`File saved successfully at ${filePath}`);
        }
    });
    res.status(200).json({ message: 'Data saved successfully!' });
});

app.post('/update-json', (req, res) => {
    const { index, dataJson,file_name} = req.body;
    if (index === undefined || !dataJson) {
        return res.status(400).json({ error: "Missing index or dataJson in request body" });
    }
    const primaryPath = path.join(get_file_system(file_name));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', file_name+'.json');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : secondaryPath;
    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            return res.status(500).json({ error: `Failed to read file: ${readErr.message}` });
        }

        try {
            const jsonData = JSON.parse(data);
            if (index < 0 || index >= jsonData.length) {
                return res.status(400).json({ error: "Invalid index provided" });
            }
            jsonData[index] = { ...jsonData[index], ...dataJson };
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: `Failed to write file: ${writeErr.message}` });
                }

                res.status(200).json({
                    message: "Update successful",
                    updatedObject: jsonData[index],
                });
            });
        } catch (parseErr) {
            return res.status(500).json({ error: `Error parsing JSON data: ${parseErr.message}` });
        }
    });
});

app.post('/update-list-by-id', (req, res) => {
    const { dataJson, file_name } = req.body;
    if (!dataJson || !dataJson.ID) {
        return res.status(400).json({ error: "Missing dataJson or ID in request body" });
    }

    const primaryPath = path.join(get_file_system(file_name));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', file_name + '.json');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : secondaryPath;

    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            return res.status(500).json({ error: `Failed to read file: ${readErr.message}` });
        }

        try {
            const jsonData = JSON.parse(data);
            const objIndex = jsonData.findIndex(obj => obj.ID === dataJson.ID);
            if (objIndex === -1) {
                return res.status(400).json({ error: "Object with the provided ID not found" });
            }
            jsonData[objIndex] = { ...jsonData[objIndex], ...dataJson };
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: `Failed to write file: ${writeErr.message}` });
                }
                res.status(200).json({
                    message: "Update successful",
                    updatedObject: jsonData[objIndex],
                });
            });
        } catch (parseErr) {
            return res.status(500).json({ error: `Error parsing JSON data: ${parseErr.message}` });
        }
    });
});

app.post('/update-list-by-field', (req, res) => {
    const { dataJson, file_name } = req.body;
    if (!dataJson || !dataJson.ID) {
        return res.status(400).json({ error: "Missing dataJson or ID in request body" });
    }

    const primaryPath = path.join(get_file_system(file_name));
    const secondaryPath = path.join(__dirname, 'public', 'jsonData', file_name + '.json');
    const filePath = fs.existsSync(primaryPath) ? primaryPath : secondaryPath;

    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            return res.status(500).json({ error: `Failed to read file: ${readErr.message}` });
        }

        try {
            const jsonData = JSON.parse(data);
            const objIndex = jsonData.findIndex(obj => obj.ID === dataJson.ID);
            if (objIndex === -1) {
                return res.status(400).json({ error: "Object with the provided ID not found" });
            }

            Object.keys(dataJson).forEach(key => {
                jsonData[objIndex][key] = dataJson[key];
            });

            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: `Failed to write file: ${writeErr.message}` });
                }
                res.status(200).json({
                    message: "Update successful",
                    updatedObject: jsonData[objIndex],
                });
            });
        } catch (parseErr) {
            return res.status(500).json({ error: `Error parsing JSON data: ${parseErr.message}` });
        }
    });
});

app.post('/delete-file', (req, res) => {
    const { file_name } = req.body;

    if (!file_name)return res.status(400).json({ success: false, message: 'File name cannot be empty' });

    const primaryPath = path.join(get_file_system(file_name));
    fs.access(primaryPath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).json({ success: false, message: 'File does not exist.' });
        fs.unlink(primaryPath, (err) => {
            if (err) return res.status(500).json({ success: false, message: 'File deletion failed.', error: err.message });
            return res.status(200).json({ success: true, message: 'File deleted successfully.' });
        });
    });
});

app.listen(port, () => {
    console.log('App is running...');
});
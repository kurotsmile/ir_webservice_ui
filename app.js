import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import dgram from 'dgram';

// Importing required services and modules
import * as resultService from './src/script/resultService.js';
// import { drawTA, drawTT, drawAT, drawCT, data07, graphSettings } from './src/script/graphService.js';
import * as graphService from './src/script/graphService.js';
import * as converter from './model/Converter.js';
console.log('App is running...');

// Setup Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000 // 25 seconds
});

const UDP_IP = '127.0.0.1'; // Server IP
const UDP_PORT = 12421;      // Server port

// Create a UDP socket
const sock = dgram.createSocket('udp4');
// Bind the socket to the specified IP and port
sock.bind(UDP_PORT, UDP_IP, () => {
    console.log('Client bound to ' + UDP_IP + ':' + UDP_PORT);
});
// Get file path and directory name using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup static files and views
app.use(express.static(path.join(__dirname, 'src')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use('/public',express.static(path.join(__dirname, 'public')));

let psets = []
let stepCount =0
let angletarget = 0;
let controllerIP = ''
let PI4Ip ='';
// Render main page with job data
/*
app.get('/', async (req, res) => {
    try {
        const jobs = await resultService.getListJob()

         // Filter jobs with valid IDs
        res.render('index', { jobs });
    } catch (error) {
        console.error('Error loading job list:', error);
        res.status(500).send('Error loading job list');
    }
});
*/

app.get('/', (req, res) => {
    res.render('index2');
});

app.get('/login', (req, res) => {
    res.render('login_flow1');
});

app.get('/service_login', (req, res) => {
    res.render('service_login_flow2');
});

// Emit commands every 50ms
setInterval(() => {
    // sendCmds(io, cmdInfo);
}, 50);

// Socket.IO connection
io.on('connection', (socket) => {
    // socket.on('cmdresp', (data) => {
    //     handleCmdResponse(data, socket);
    // });

    socket.on('disconnect', (err) => {
        console.log('A client disconnected', err);
    });
});

let rData = { routine07: [], routine0E: [], peakinfo: [], ip: [], others: [] }
// let rData = []
let ratio = 0
// Listen for incoming messages
sock.on('message', async (udpData) => {
    if (udpData.length == 508) {
        rData.routine07.push(udpData)
    } else if (udpData.length == 248) {
        rData.routine0E = udpData
    } else {
        rData.others.push(udpData)
    }
    // console.log("bnl", udpData)
});

// Handle any socket errors
sock.on('error', (err) => {
    console.error(`Socket error: ${err}`);
});

// Optional: Handle socket close event
sock.on('close', () => {
    console.log('Socket closed');
});

// Optional: Keep the client running
process.on('SIGINT', () => {
    sock.close(() => {
        console.log('Client closed');
        process.exit(0);
    });
});

let oldStepPeakAngle = 0
let isPassPset = 0;
let flag = 0;
let isearlyAngle = 0
function mainHandler(rx07, rx0E) {
    const dataRoutine07 =  converter.parseRoutine07(rx07);
    const tiltAngle = converter.getAngle(rx0E);
    io.emit('tilt_angle', tiltAngle);
    if (dataRoutine07.prog_status_cnt > 0) {
        if (dataRoutine07.tighten_state) {
            isPassPset= 0;
            let peakTorqueValue = 0
            let peakAngleValue = 0
            
            const torque = Math.abs(dataRoutine07.torque_data[dataRoutine07.prog_status_cnt - 1]*ratio)
            graphService.data07.torque.push(Math.ceil(torque*100)/100);
            peakTorqueValue = Math.ceil((dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].peak_torque * ratio)*100)/100;
            peakAngleValue = Math.round(dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].prog_step_degree);
            oldStepPeakAngle = 0
            for (let i = 0;i<dataRoutine07.prog_status_cnt-1;i++) {
                oldStepPeakAngle += Math.round(dataRoutine07.prog_status[i].prog_step_degree);
            }
            graphService.data07.angle.push(oldStepPeakAngle + peakAngleValue);

            if(dataRoutine07.prog_status_cnt > 0 && dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].prog_step_ng_if == 0){
                if (angletarget == 0) {
                    let uopdatepsetinfo = 0
                    if (dataRoutine07.prog_status_cnt < stepCount) {
                        uopdatepsetinfo = resultService.updateJob(psets, dataRoutine07.pset_idx, dataRoutine07.prog_status_cnt);
                        io.emit('resultData', uopdatepsetinfo);
                        // if current step pass, check next sten angle target
                        if (psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt].Type != 2) {
                            angletarget = 0
                        } else {
                            angletarget = psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt].AT.AngleTarget
                        }
                    } else {
                        const result = resultService.showStepResults( peakTorqueValue, peakAngleValue, 0 );
                        io.emit('resultData', result);
                        isPassPset = 1
                        isearlyAngle = 0
                    }
                } else {
                    if (peakAngleValue >= angletarget) {
                        angletarget = 0
                        let uopdatepsetinfo = 0
                        if (dataRoutine07.prog_status_cnt < stepCount) {
                            uopdatepsetinfo = resultService.updateJob(psets, dataRoutine07.pset_idx, dataRoutine07.prog_status_cnt);
                            io.emit('resultData', uopdatepsetinfo);
                            // if current step pass, check next sten angle target
                            if (psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt].Type != 2) {
                                angletarget = 0
                            } else {
                                angletarget = psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt].AT.AngleTarget
                            }
                        } else {
                            const result = resultService.showStepResults( peakTorqueValue, peakAngleValue, 0 );
                            io.emit('resultData', result);
                            isPassPset = 1
                            isearlyAngle = 0
                        }
                    } else {
                        // due to data error - early release of peak angle will temporarily handle like this
                        // if not hold before reaching angle target, its early release
                        isearlyAngle = 1
                    }
                }
            } else {
                isearlyAngle = 1
            }

            if(flag == 0){
                PI4Ip = converter.getip()
                io.emit('bindingIP', {controllerIP, PI4Ip});

                const initData = resultService.initData();
                io.emit('resultData', initData);
                flag=1;

                let uopdatepsetinfo = resultService.updateJob(psets, dataRoutine07.pset_idx, dataRoutine07.prog_status_cnt-1);
                graphService.graphSettings.maxTorque = uopdatepsetinfo.torque_high_limit;
                stepCount = psets[dataRoutine07.pset_idx].StepCount
                if (psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt - 1].Type != 2) {
                    angletarget = 0
                } else {
                    angletarget = psets[dataRoutine07.pset_idx].Steps[dataRoutine07.prog_status_cnt - 1].AT.AngleTarget
                }
                io.emit('resultData', uopdatepsetinfo);

                let unit = psets[dataRoutine07.pset_idx].Units
                if (unit == "Kg-Cm") {
                    ratio = 1/0.0980665
                } else if (unit == "Kg-M") {
                    ratio = 1/9.80665003
                } else if (unit == "Nm") {
                    ratio = 1/1
                } else if (unit == "dNm") {
                    ratio = 1/0.1
                } else if (unit == "Ft-lbs") {
                    ratio = 1/1.3558179483
                } else if (unit == "In-lbs") {
                    ratio = 1/0.11298483
                }
                // console.log(ratio)
            }
            
            const result = resultService.showStepResults( peakTorqueValue, peakAngleValue, dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].prog_step_ng_if );
            io.emit('torqueAndAngleUpdate', result);

            if (peakTorqueValue > graphService.graphSettings.maxTorque) {
                graphService.graphSettings.maxTorque = peakTorqueValue*1.5
            }
            graphService.drawGraph(io)
        } else {
            flag = 0
            // if (data.peakinfo.length >= 8) {
            //     const peakTorque = Buffer.from(data.peakinfo.slice(0, 4)); // Extract the bytes
            //     let peakTorqueValue = peakTorque.readFloatLE(0); // Read as a little-endian float

            //     const peakAngle = Buffer.from(data.peakinfo.slice(4, 8)); // Extract the bytes
            //     let peakAngleValue = peakAngle.readFloatLE(0); // Read as a little-endian float
            //     const result = resultService.showStepResults( peakTorqueValue, peakAngleValue, dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].prog_step_ng_if );
            //     io.emit('resultData', result);
                
            if(isPassPset == 1){
                isPassPset = 0;
                oldStepPeakAngle = 0;
                graphService.data07.torque = [];
                graphService.data07.angle = [];
            }
            
            let earlyrelease = 0
            if (angletarget > 0) {
                earlyrelease = 2
            } else {
                earlyrelease = 4
            }
            if(dataRoutine07.prog_status_cnt > 0 && dataRoutine07.prog_status[dataRoutine07.prog_status_cnt - 1].prog_step_ok_if == earlyrelease) {
                //early release
                oldStepPeakAngle = 0;
                graphService.data07.torque = [];
                graphService.data07.angle = [];
            }
            if (isearlyAngle == 1) {
                isearlyAngle = 0;
                oldStepPeakAngle = 0;
                graphService.data07.torque = [];
                graphService.data07.angle = [];
            }
            // data.peakinfo = []
            // }
        }
    }
}

// setInterval( async () => {
//     if (rData.routine07.length>0) {
//         const r07 = rData.routine07.shift()
//         const r0E = rData.routine0E
//         await mainHandler(r07, r0E)
//     }
// }, 5);

async function callhandler() {
    while(1) {
        if (rData.routine07.length>0) {
            const r07 = rData.routine07.shift()
            const r0E = rData.routine0E
            mainHandler(r07, r0E)
        }
    }
}

callhandler()


//function to update ip
function ipupdate(ip) {
    // controllerIP = ip.slice(1,5)
}

// API route to get psets by job ID
app.get('/get-pset-by-job-id', async (req, res) => {
    try {

        let jobId = req.query['job-id'];
        let result = {}
        result = await resultService.selectNewJob(jobId);
        for (let index = 0; index < result.jobList.Psets.length; index++) {
            const item = result.jobList.Psets[index];
            
            const psetIndex = await resultService.getPsetById(item.ID);
            psets[index] = psetIndex
            
        }
        stepCount = result.resultData.stepCount;
        // psetCount = result.resultData.PsetCount;
        angletarget = result.resultData.angle_target;
        graphService.graphSettings.maxTorque = result.resultData.torque_high_limit;
        res.json(result.resultData);

    } catch (error) {
        console.error('Error fetching psets:', error);
        res.status(500).send('Error fetching psets');
    }
});


console.log('App is running...');

server.listen(4003, () => {
    console.log('Server running on port 3000');
});
console.log('App is running...');
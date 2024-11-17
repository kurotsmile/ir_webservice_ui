import os from 'os'

let progState = {
    prog_step: 0,
    prog_step_seq: 0,
    prog_step_time: 0,
    prog_step_degree: 0,
    prog_step_ok_if: 0,
    prog_step_ng_if: 0,
    peak_vel: 0,
    peak_torque: 0
}

let dataRoutine07 = {
    cmd: 0, //0x80|PI4_CMD_STATUS_TEST
    tighten_enable: 0,
    tighten_seq: 0,
    tighten_state: 0, //0:stop, 1:run

    job_idx: 0,
    pset_list_idx: 0,
    pset_idx: 0,
    pass_count: 0,
    in_status: 0, //input status, bit0->in0, bit1->in1, ...
    out_status: 0, //output status, bit0->out0, bit1->out1, ...
    mes_online: 0,
    mes_power: 0,
    tighten_ng_flag: 0,


    screw_tighten_ok_cnt: 0,
    screw_tighten_ng_cnt: 0,
    complete_cnt: 0, //complete product count
    total_ng: 0, //ng screw count
    total_pass: 0, //pass screw count
    screw_day_sn: 0,

    current_date: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        reserved: 0
    },
    current_temp: 0, //～
    current_vel: 0, //rpm
    peak_vel: 0, //rpm

    prog_status: [],
    torque_data: [],
    step_data: [],
    degree_data: [],
    velocity_data: [],
    reserved1: [],
    screw_ok_percent: 0, //%
    reserved2: [],
    prog_status_cnt: 0,
    torque_degree_data_cnt: 0,
    crc: 0
}





//parsing data from controller
let Offset = 0;
function GetByte(data) {
    const ret = data[Offset]
    Offset++
    return ret
}

function GetU16(data) {
    const ret = Buffer.from(data.slice(Offset, Offset+2)).readUInt16LE(0)
    Offset+=2
    return ret
}

function GetU32(data) {
    const ret = Buffer.from(data.slice(Offset, Offset+4)).readUInt32LE(0)
    Offset+=4
    return ret
}

function GetFloat(data) {
    const ret = Buffer.from(data.slice(Offset, Offset+4)).readFloatLE(0)
    Offset+=4
    return ret
}

function parseRoutine07(data) {
    let ret = dataRoutine07
    Offset = 0;
    ret.cmd = GetByte(data);
    ret.tighten_enable = GetByte(data);
    ret.tighten_seq = GetByte(data);
    ret.tighten_state = GetByte(data);
    ret.job_idx = GetByte(data);
    ret.pset_list_idx = GetByte(data);
    ret.pset_idx = GetByte(data);
    ret.pass_count = GetByte(data);
    ret.in_status = GetByte(data);
    ret.out_status = GetByte(data);
    ret.mes_online = GetByte(data);
    ret.mes_power = GetByte(data);
    ret.tighten_ng_flag = GetU32(data);


    ret.screw_tighten_ok_cnt = GetU16(data);
    ret.screw_tighten_ng_cnt = GetU16(data);
    ret.complete_cnt = GetU32(data);
    ret.total_ng = GetU32(data);
    ret.total_pass = GetU32(data);
    ret.screw_day_sn = GetU32(data);

    ret.current_date.year = GetU16(data);
    ret.current_date.month = GetByte(data);
    ret.current_date.day = GetByte(data);
    ret.current_date.hour = GetByte(data);
    ret.current_date.minute = GetByte(data);
    ret.current_date.second = GetByte(data);
    ret.current_date.reserved = GetByte(data);

    ret.current_temp = GetFloat(data);
    ret.current_vel = GetFloat(data);
    ret.peak_vel = GetFloat(data);

    for (let i = 0; i < 8; i++) {
        let progstate = { ...progState }
        progstate.prog_step = GetByte(data);
        progstate.prog_step_seq = GetByte(data);
        progstate.prog_step_time = GetU16(data);
        progstate.prog_step_degree = GetFloat(data);
        progstate.prog_step_ok_if = GetU16(data);
        progstate.prog_step_ng_if = GetU16(data);
        progstate.peak_vel = GetFloat(data);
        progstate.peak_torque = GetFloat(data);

        ret.prog_status[i] = progstate
    }


    for (let i = 0; i < 16; i++) ret.torque_data[i] = GetFloat(data);
    for (let i = 0; i < 16; i++) ret.step_data[i] = GetByte(data);
    for (let i = 0; i < 16; i++) ret.degree_data[i] = GetFloat(data);
    for (let i = 0; i < 16; i++) ret.velocity_data[i] = GetFloat(data);
    for (let i = 0; i < 16; i++) ret.reserved1[i] = GetFloat(data);

    ret.screw_ok_percent = GetFloat(data);
    for (let i = 0; i < 12; i++) {
        ret.reserved2[i] = GetByte(data);
    }
    
    ret.prog_status_cnt = GetByte(data);
    ret.torque_degree_data_cnt = GetByte(data);
    ret.crc = GetU16(data);

    return ret
}







// old code
function getTorque(raw_resp) {
    // console.log(Math.floor(Date.now(data)/1000))
    
    // console.log(raw_resp)
    if ((raw_resp == null) && (raw_resp == undefined)) return 0
    // console.log(raw_resp.slice(216, 220))
    // writeTorqueToTxt(raw_resp)
    const buffer = Buffer.from(raw_resp.slice(216, 220)); // Extract the bytes
    let floatValue = buffer.readFloatLE(0)*10; // Read as a little-endian float
    if (floatValue < 0.001) floatValue = 0.0
    // console.log(floatValue)
    // console.log(Math.floor(Date.now(data)/1000))
    return floatValue

}

function getDegree(raw_resp) {
    if ((raw_resp == null) && (raw_resp == undefined)) return 0
    const buffer = Buffer.from(raw_resp.slice(296, 300)); // Extract the bytes
    const floatValue = buffer.readFloatLE(0); // Read as a little-endian float
    const intvalue = Math.round(floatValue)
    // console.log(intvalue)
    return intvalue

}

function getTimeStamp(raw_resp) {
    if ((raw_resp == null) && (raw_resp == undefined)) return 0
    const year = raw_resp[36] << 8 | raw_resp[37]
    const month = raw_resp[38]
    const day = raw_resp[39]
    const hour = raw_resp[40]
    const minute = raw_resp[41]
    const second = raw_resp[42]
    const timestamp = [year, month, day, hour, minute, second]
    return timestamp
}

function getAngle(raw_resp) {
    // writeAngleToTxt(raw_resp)
    if ((raw_resp == null) && (raw_resp == undefined)) return -1
    return raw_resp[1]
}

function getip() {
    // const os = require('os');

    const networkInterfaces = os.networkInterfaces();
    const wirelessIPAddresses = [];

    for (const iface in networkInterfaces) {
    networkInterfaces[iface].forEach((interfaceInfo) => {
        if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal && iface.startsWith('w')) {
        wirelessIPAddresses.push(interfaceInfo.address);
        }
    });
    }
    return wirelessIPAddresses[0];

}
export {getTorque, getDegree, getAngle, getTimeStamp, parseRoutine07, getip};

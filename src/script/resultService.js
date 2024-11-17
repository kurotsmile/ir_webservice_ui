import * as sto from '../../model/Storage.js';
// Dictionary for color mappings
const Dic = {
    Cr: {
        Red: "red",
        Orange: "orange",
        Blue: "blue",
        Grey: "grey",
        Green: "green"
    }
};

const resultData = {
    torque_number: 0,
    torque_target: 0.90,
    torque_high_limit: 1.00,
    torque_low_limit: 0.80,
    angle_high_limit: 720,
    angle_low_limit: 0,
    angle_target: 0,
    angle_number: 0,
    tilt_angle: 0,

    crTorque: Dic.Cr["Green"],
    crTorUp: Dic.Cr["Grey"],
    crTorDn: Dic.Cr["Grey"],
    crAngle: Dic.Cr["Green"],
    crAngUp: Dic.Cr["Grey"],
    crAngDn: Dic.Cr["Grey"],
    Hint: [],
    HintCount: 3,
    lbStepHint1: "",
    lbStepHint2: "",
    stepName: "",
    imStepRes: "",
    Units: "Nm",
    NxtPset: "",
    PsetCount: 0,
    CurPset: 0,
    TraceSelection: "",
    stepCount: 0
}

// Check if the number is within the expected range
const checkPassCycle = (torque_number, torque_high_limit, torque_low_limit) => {
    return torque_number >= torque_low_limit && torque_number <= torque_high_limit;
}

// Function to check and update torque and angle values
function showStepResults(Tor, Ang, prog_step_ng_if) {
    let result = { ...resultData }
    result.HintCount = 0;
    result.torque_number = Tor;
    result.angle_number = Ang;
    if (prog_step_ng_if == 0) {
        result.crAngDn = result.crAngUp = result.crTorUp = result.crTorDn = Dic.Cr["Grey"]
        result.crTorque = result.crAngle = Dic.Cr["Green"]
        result.imStepRes = "/public/SVG/Pass.svg"

        return result;
    }

    result.imStepRes = "/public/SVG/Fail.svg";
    // Torque checks
    if (Tor > resultData.torque_high_limit) {
        result.crTorUp = result.crTorque = Dic.Cr["Red"];
        if (result.HintCount < 2) {
            result.Hint[result.HintCount++] = 'High Torque'
        }
    }

    if (Tor < resultData.torque_low_limit) {
        result.crTorDn = result.crTorque = Dic.Cr["Orange"];
        if (result.HintCount < 2) {
            result.Hint[result.HintCount++] = "Low Torque";
        }
    }

    if (Tor >= resultData.torque_low_limit && Tor <= resultData.torque_high_limit) {
        result.crTorque = Dic.Cr["Blue"];
        result.crTorUp = result.crTorDn = Dic.Cr["Grey"];
    }

    // Angle checks
    if (Ang > resultData.angle_high_limit) {
        result.crAngUp = result.crAngle = Dic.Cr["Red"];
        if (result.HintCount < 2) {
            result.Hint[result.HintCount++] = "High Angle";
        }
    }

    if (Ang < resultData.angle_low_limit) {
        result.crAngDn = result.crAngle = Dic.Cr["Orange"];
        if (result.HintCount < 2) {
            result.Hint[result.HintCount++] = "Low Angle";
        }
    }

    if (Ang >= resultData.angle_low_limit && Ang <= resultData.angle_high_limit) {
        result.crAngle = Dic.Cr["Blue"];
        result.crAngUp = result.crAngDn = Dic.Cr["Grey"];
    }
    // Assign step hints
    result.lbStepHint1 = result.Hint[0] || "";
    result.lbStepHint2 = result.Hint[1] || "";

    // due to wrong data from controller, so have to use this, will be removed when getting correct data
    if (prog_step_ng_if = 255) {
        result.HintCount = 2;
    } 

    return result;

}

function initData() {
    return { ...resultData }
}
async function selectNewJob(jobId) {

    const jobList = await sto.readJobFile(jobId);
    const psetList = await sto.getPset(jobList.Psets[0].ID);
    const TA = psetList.Steps[0].TA;
    resultData.torque_high_limit = TA.TorqueHighLimit
    resultData.torque_low_limit = TA.TorqueLowLimit
    resultData.torque_target = TA.TorqueTarget

    resultData.angle_low_limit = TA.AngleLowLimit
    resultData.angle_high_limit = TA.AngleHighLimit
    resultData.stepName = `STEP #${psetList.Steps[0].Type}`
    resultData.Units = psetList.Units;
    resultData.NxtPset = psetList.Name;
    resultData.PsetCount = jobList.PsetCount;
    resultData.stepCount = psetList.StepCount;

    return {resultData , jobList}
}
async function getPsetById(ID) {
    return await sto.getPset(ID);
    
}

function updateJob(psetList, curPset, curStep) {

    let psetDetail = psetList[curPset];
    const step = psetDetail.Steps[curStep];

    let TA = {}
    switch (step.Type) {
        case 1:
            TA = psetDetail.Steps[curStep].TA;
           
            resultData.torque_target = TA.TorqueTarget
            resultData.angle_target = ""
            break;

        case 2:
            TA = psetDetail.Steps[curStep].AT;
            resultData.angle_target = TA.AngleTarget
            resultData.torque_target = ""

            break;
        case 3:
            TA = psetDetail.Steps[curStep].PT;
            break;
        default:
            break;
    }
    
    resultData.torque_high_limit = TA.TorqueHighLimit
    resultData.torque_low_limit = TA.TorqueLowLimit
    resultData.angle_low_limit = TA.AngleLowLimit
    resultData.angle_high_limit = TA.AngleHighLimit
    resultData.stepName = `STEP #${curStep+1}`
    resultData.Units = psetDetail.Units;
    resultData.NxtPset = psetDetail.Name;
    resultData.PsetCount = psetList.PsetCount;
    resultData.CurPset = curPset;
    resultData.curStep = curStep;
    resultData.TraceSelection = psetDetail.TraceSelection;
    resultData.stepCount = psetDetail.StepCount;

    return resultData
}

async function getListJob() {
    const jobList = await sto.loadJobList();
    const jobs = jobList.filter(v => v.ID);
    return jobs
}
// const testSelectJob = await updateJob("J1728739100640473", 1, 0)
// console.log("selectNewJob", testSelectJob)

// //Pass
// const case1 = showStepResults(2.5, 210)
// console.log("case1", case1)

// //Low Torque
// const case2 = showStepResults(1, 210)
// console.log("case2", case2)

// //Hight Torque
// const case3 = showStepResults(4, 100)
// console.log("case3", case3)

// //Hight Angle
// //Low Torque
// const case4 = showStepResults(1, 33000)
// console.log("case3", case4)
// Exporting necessary functions and result
export { showStepResults, selectNewJob, getListJob, initData, updateJob, getPsetById };
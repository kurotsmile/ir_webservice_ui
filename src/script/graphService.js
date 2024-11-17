
const graphSettings = {
    graphType: '0',
    maxAngle: 1000,
    maxTorque: 3,
    maxX: 500,
    reset: 1,
     listLabels :[ [], [],[],[]],
     listLabelY : [ [], [],[],[]]
  };
let data07 = { torque: new Array(), angle: new Array(), angle: new Array() , times: new Array() }
function drawTA() {
    const lbX = [];
    const lbY = [];
    graphSettings.maxAngle = Math.max(...data07.angle)
    // console.log(graphSettings.maxAngle)
    if (data07.torque.length > 1) {
        lbX[0] = lbY[0] = 0;
        for (let i = 1; i <= 5; i++) {
            lbX[i] = (graphSettings.maxAngle * 1.02 * i / 5).toFixed(0);
            lbY[i] = (graphSettings.maxTorque * i / 5).toFixed(2);
        }
        graphSettings.listLabels[0] = lbX
        graphSettings.listLabelY[0] = lbY
    }
}

function drawTT() {
    const lbX = [];
    const lbY = [];
    if (data07.torque.length > 1) {
        lbX[0] = lbY[0] = 0;
        for (let i = 1; i <= 5; i++) {
            lbX[i] = (data07.torque.length * i * 0.008 / 5).toFixed(2);
            lbY[i] = (graphSettings.maxTorque * i / 5).toFixed(2);
        }
        graphSettings.listLabels[1] = lbX
        graphSettings.listLabelY[1] = lbY
    }
}

function drawAT() {
    const lbX = [];
    const lbY = [];
    if (data07.angle.length > 1) {  
        graphSettings.maxAngle = Math.max(...data07.angle)
        lbX[0] = lbY[0] = 0;
        for (let i = 1; i <= 5; i++) {
            lbX[i] = (data07.torque.length * 1.02 * i * 0.008 / 5).toFixed(2);
            lbY[i] = (graphSettings.maxAngle * 1.02 * i / 5).toFixed(0);
        }
        graphSettings.listLabels[2] = lbX
        graphSettings.listLabelY[2] = lbY
    }
}

function drawGraph(io) {
    drawTA()
    drawTT()
    drawAT()
    io.emit('drawLine', { data: data07, graphSettings})
}
 
export {drawGraph,  data07, graphSettings}
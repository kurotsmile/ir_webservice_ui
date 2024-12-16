let data = [];
let angles = [];
let maxA = 0;
let maxT = 3;
let listLabels = [
    [0, 185, 370, 556, 741, 926],
    [0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    []
]
let listLabelY = [
    [0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    [0, 200, 400, 600, 800, 1000],
    []
]

let labels = []
let labelY = []
let canvas = {}
let graphWidth = 0;
let graphHeight = 0;
let ctx = {}
let reset = 1;
let txtLegend1 = 'Angle'
let txtLegend2 = 'Torque'
let socket = {}
let maxX = 500
let selectedValue = 0;

const padding = 50;
const numYTicks = 5;
const numXTicks = 6;
const minValue = 0;    // Minimum random value
const maxValue = 3;  // Maximum random value

function graphSelectEvent() {
    document.getElementById('chartTypeSelect').addEventListener('change', function () {
        selectedValue = this.value;
        labels = listLabels[selectedValue];
        labelY = listLabelY[selectedValue];
        
        switch(selectedValue) {
            case '0': 
                txtLegend1 = 'Angle';
                txtLegend2 = 'Torque';
                break;
            case '1': 
                txtLegend1 = 'Time';
                txtLegend2 = 'Torque';
                break;
            case '2': 
                txtLegend1 = 'Time';
                txtLegend2 = 'Angle';
                break;
            case '3': 
                txtLegend1 = 'Time';
                txtLegend2 = 'Current';
                labels = listLabels[0];
                labelY = listLabelY[0];
                break;
        }

        drawLegend();
        addDataPoint();
    });
}


function addDataPoint() {
     const newPoint = generateRandomPoint(minValue, maxValue);
    //data.push(newPoint);
    const anglePoint = generateRandomPoint(0, 36000);
     //angles.push(anglePoint)

    //if (data.length > numPoints) data.shift();

    // Clear canvas and redraw everything
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(padding, padding, canvas.width - 2 * padding, canvas.height - 2 * padding);
    drawGrid();
    drawLegend();
    drawLineGraph();
}

// Function to draw the grid
function drawGrid() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    // Draw horizontal grid lines (y-axis)
    for (let i = 0; i <= numYTicks; i++) {
        const y = (canvas.height - padding) - (i * (graphHeight / numYTicks));
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();

        const rightPadding = canvas.width - padding; // Adjust the padding for the right side
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(labelY[i], rightPadding + 10, y + 5); // Adjust x position for the right side
    }
 
    // Draw vertical grid lines (x-axis)
    for (let i = 0; i < numXTicks; i++) {
        const x = padding + (i * (graphWidth / (numXTicks - 1)));
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + graphHeight);
        ctx.stroke();

        // Draw X-axis labels
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(labels[i], x - 10, padding + graphHeight + 20);
    }
}

// Function to plot line graph
function drawLineGraph() {
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (selectedValue == 0) {

        maxA = Math.max(...angles)
        data.forEach((value, index) => {
            let x = padding + ((angles[index] / (maxA*1.02)) * graphWidth);
            let y = padding + graphHeight - (value / maxT) * graphHeight;

            if (index === 0) {
                x = padding;
                y = padding + graphHeight;
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
    } else if (selectedValue == 1) {

        // let t = data.length * 1.02;
        // if (maxX < t) maxX = t;

        data.forEach((value, index) => {
            // console.log(index, data.length)
            let x = padding + (((index + 1) / (data.length * 1.02)) * graphWidth);
            let y = padding + graphHeight - (value / maxT) * graphHeight;

            if (index === 0) {
                x = padding;
                y = padding + graphHeight;
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
    } else if (selectedValue == 2) {
        maxA = Math.max(...angles)
        angles.forEach((value, index) => {
            let x = padding + (((index + 1) / (data.length * 1.02)) * graphWidth);
            let y = padding + graphHeight - (value / (maxA*1.02)) * graphHeight;

            if (index === 0) {
                x = padding;
                y = padding + graphHeight;
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
    }

    ctx.stroke();
}
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}
// Function to draw legends
function drawLegend() {
    ctx.fillStyle = 'white';  // Background color of the text
    drawRoundedRect(canvas.width / 2 - 60, 35, 110, 30, 15)

    ctx.font = '15px Arial';
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 45, 50, 8, 0, Math.PI * 2);

    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(txtLegend1, canvas.width / 2 - 25, 55);

    //////////////
    ctx.fillStyle = 'white';  // Background color of the text
    drawRoundedRect(32, canvas.height / 2 - 35, 37, 80, 15)

    ctx.font = '15px Arial';
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(50, canvas.height / 2 + 30, 8, 0, Math.PI * 2);

    ctx.save();
    ctx.translate(25, canvas.height / 2 - 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(txtLegend2, - 70, 30);
    ctx.restore();
}


function generateRandomPoint(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}
function resizeChart() {
    canvas.height = (window.innerHeight * 0.5) + 20;
    graphWidth = canvas.width - 100;
    graphHeight = canvas.height - 100;
    drawGrid();
    drawLegend();
    drawLineGraph();
}
window.addEventListener('resize', resizeChart);

$(document).ready(function () {
    render_chart();
});


function render_chart(){
    labels = listLabels[0]
    labelY = listLabelY[0]

    canvas = document.getElementById('myChart');
    ctx = canvas.getContext('2d');
    graphSelectEvent();

    graphWidth = canvas.width - 100;
    graphHeight = canvas.height - 100;

    drawGrid();
    drawLegend();

    socket = io();
    socket.on('drawLine', (result) => {
        console.log(result);
        
        data = result.torque;
        angles = result.angle;
        
        /*
        listLabels = result.graphSettings.listLabels;
        listLabelY = result.graphSettings.listLabelY;
        labels = listLabels[selectedValue];
        labelY = listLabelY[selectedValue];
        maxA = result.graphSettings.maxAngle;
        maxT = result.graphSettings.maxTorque;
        reset = result.graphSettings.reset;
        maxX = result.graphSettings.maxX;
        */
        addDataPoint();
    });
}

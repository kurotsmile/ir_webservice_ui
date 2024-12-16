let socket = {};

let txtLegend1 = 'Angle';
let txtLegend2 = 'Torque';

let selectedValue = 0;
let listLabels = [
    [0, 185, 370, 556, 741, 926],
    [0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    []
];
let listLabelY = [
    [0, 0.1, 0.2, 0.3, 0.4, 0.5],
    [0, 0.10, 0.20, 0.30, 0.40, 0.50],
    [0, 200, 400, 600, 800, 1000],
    []
];
let labels = [];
let labelY = [];
let canvas = {};
const numYTicks = 5;
const numXTicks = 6;
const padding = 50;
let graphWidth = 0;
let graphHeight = 0;

$(document).ready(function () {
    load_charjs();
});

function load_charjs(){

    labels = listLabels[selectedValue];
    labelY = listLabelY[selectedValue];

    canvas = document.getElementById('myChart');
    graphWidth = canvas.width - 100;
    graphHeight = canvas.height - 100;

    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Torque',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 3,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            width: window.innerWidth * 50,
            height: window.innerHeight * 50 ,
            layout: {
                padding: {
                    top: 80,
                    right: 80, 
                    bottom: 50,
                    left: 43
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {display: false},
                    ticks: {display: false},
                    grid: {display: false}
                },
                y: {
                    title: {display: false},
                    ticks: {display: false},
                    grid: {display: false}
                }
            }
        }
    });

    window.add_data = function (newAngle, newTorque) {
        myChart.data.labels.push(newAngle);
        myChart.data.datasets[0].data.push(newTorque);
        myChart.update();
    };

    socket = io();
    let count_col = 0;
    var max_y=0.0;
    socket.on('drawLine', (result) => {
        $.each(result.torque, function (index, value) {
            count_col++;
            if(parseFloat(value)>max_y){
                max_y=parseFloat(value);
            }

            add_data(count_col, value);
            let labs_x=createSixSteps(count_col);
            labels[0]=labs_x[0];
            labels[1]=labs_x[1];
            labels[2]=labs_x[2];
            labels[3]=labs_x[3];
            labels[4]=labs_x[4];
            labels[5]=labs_x[5];


            var labs_y=createSixSteps_float(max_y);
            labelY[0]=labs_y[0];
            labelY[1]=labs_y[1];
            labelY[2]=labs_y[2];
            labelY[3]=labs_y[3];
            labelY[4]=labs_y[4];
            labelY[5]=labs_y[5];
        });
    });

    Chart.register({
        id: 'myPlugin',
        beforeDraw: function(chart) {
            drawGrid(chart);
        },
        afterDraw: function(chart) {
            drawLegend(chart);
        }
    });
}

function createSixSteps(maxValue) {
    let steps = [];
    let stepValue;

    if (maxValue <= 0) {
        stepValue = 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(i * stepValue);
        }
    } else if (maxValue < 30) {
        stepValue = 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(i * stepValue);
        }
    } else {
        stepValue = maxValue / 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(Math.round(i * stepValue));
        }
    }
    return steps;
}

function createSixSteps_float(maxValue) {
    let steps = [];
    let stepValue;

    if (maxValue <= 0) {
        stepValue = 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(parseFloat((i * stepValue).toFixed(2)));
        }
    } else if (maxValue < 30) {
        stepValue = 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(parseFloat((i * stepValue).toFixed(2)));
        }
    } else {
        stepValue = maxValue / 5;
        for (let i = 0; i <= 5; i++) {
            steps.push(parseFloat((i * stepValue).toFixed(2)));
        }
    }
    return steps;
}


function drawTable(chart, chartArea) {
    var ctx = chart.ctx;
    var rows = 5;
    var cols = 5;
    var cellWidth = chartArea.width / cols;
    var cellHeight = chartArea.height / rows;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#999999';
    
    for (let i = 0; i <= rows; i++) {
        let y = chartArea.top + i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.left + chartArea.width, y);
        ctx.stroke();
    }

    for (let j = 0; j <= cols; j++) {
        let x = chartArea.left + j * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.top + chartArea.height);
        ctx.stroke();
    }

    ctx.restore();
}

function drawRoundedRect(chart,x, y, width, height, radius) {
    chart.ctx.beginPath();
    chart.ctx.moveTo(x + radius, y);
    chart.ctx.lineTo(x + width - radius, y);
    chart.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    chart.ctx.lineTo(x + width, y + height - radius);
    chart.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    chart.ctx.lineTo(x + radius, y + height);
    chart.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    chart.ctx.lineTo(x, y + radius);
    chart.ctx.arcTo(x, y, x + radius, y, radius);
    chart.ctx.closePath();
    chart.ctx.fill();
}

function drawLegend(chart) {
    chart.ctx.fillStyle = 'white';
    drawRoundedRect(chart,chart.chartArea.width / 2 - 60, 35, 110, 30, 15)

    chart.ctx.font = '15px Arial';
    chart.ctx.fillStyle = 'orange';
    chart.ctx.beginPath();
    chart.ctx.arc(chart.chartArea.width / 2 - 45, 50, 8, 0, Math.PI * 2);

    chart.ctx.fill();
    chart.ctx.fillStyle = 'black';
    chart.ctx.fillText(txtLegend1, chart.chartArea.width / 2 - 25, 55);

    chart.ctx.fillStyle = 'white'; 
    drawRoundedRect(chart,32, chart.chartArea.height / 2 - 35, 37, 80, 15)

    chart.ctx.font = '15px Arial';
    chart.ctx.fillStyle = 'cyan';
    chart.ctx.beginPath();
    chart.ctx.arc(50,chart.chartArea.height / 2 + 30, 8, 0, Math.PI * 2);

    chart.ctx.save();
    chart.ctx.translate(25, chart.chartArea.height / 2 - 50);
    chart.ctx.rotate(-Math.PI / 2);
    chart.ctx.fill();
    chart.ctx.fillStyle = 'black';
    chart.ctx.fillText(txtLegend2, - 70, 30);
    chart.ctx.restore();
}

function drawGrid(chart) {
    chart.ctx.strokeStyle = '#444';
    chart.ctx.lineWidth = 1;
    for (let i = 0; i <= numYTicks; i++) {
        const y = (canvas.height - padding) - (i * (graphHeight / numYTicks));
        chart.ctx.beginPath();
        chart.ctx.moveTo(padding, y-8);
        chart.ctx.lineTo(padding + graphWidth, y-8);
        chart.ctx.stroke();

        const rightPadding = canvas.width- padding;
        chart.ctx.fillStyle = 'white';
        chart.ctx.font = '12px Arial';
        chart.ctx.fillText(labelY[i], rightPadding + 10, y + 5);
    }
 
    for (let i = 0; i < numXTicks; i++) {
        const x = padding + (i * (graphWidth/ (numXTicks - 1)));
        chart.ctx.beginPath();
        chart.ctx.moveTo(x, padding);
        chart.ctx.lineTo(x, padding + graphHeight);
        chart.ctx.stroke();

        chart.ctx.fillStyle = 'white';
        chart.ctx.font = '12px Arial';
        chart.ctx.fillText(labels[i], x - 10, padding + graphHeight + 20);
    }
}

function resizeChart() {
    canvas.height = (window.innerHeight * 0.5) + 20;
    graphWidth = canvas.width - 100;
    graphHeight = canvas.height - 100;
    myChart.update();
}
window.addEventListener('resize', resizeChart);
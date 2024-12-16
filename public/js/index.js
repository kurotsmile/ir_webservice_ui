function toggleScreen(screen) {
    // Hide all screens
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('graphScreen').classList.remove('active');

    // Show the selected screen
    if (screen === 'results') {
        document.getElementById('resultsScreen').classList.add('active');
        document.getElementById('resultsBtn').classList.add('active');
        document.getElementById('graphBtn').classList.remove('active');
    } else {
        document.getElementById('graphScreen').classList.add('active');
        document.getElementById('graphBtn').classList.add('active');
        document.getElementById('resultsBtn').classList.remove('active');
    }
}

// document.querySelector('.fa-caret-down').addEventListener('click', function() {
//     let container = this.closest('.select-container');
//     container.classList.add('active');
// });

// document.querySelectorAll('.dropdown li').forEach(item => {
//     item.addEventListener('click', function () {
//         debugger
//         let selectedJob = this.getAttribute('data-value');
//         console.log('Selected job:', selectedJob);

//         let container = this.closest('.select-container');
//         container.classList.remove('active');
//     });
// });

// document.addEventListener('click', function(e) {
//     let container = document.querySelector('.select-container');
//     if (!container.contains(e.target)) {
//         container.classList.remove('active');
//     }
// });


function replaceIconFromCheckToX(data) {
    const imgElement = document.getElementById("img-status");
    if(data.HintCount == 3){
        imgElement.src = "";
        replaceBackgroudColor('#task-icon', 'green')
        return;
    }
    imgElement.src = data.imStepRes;
    if (data.HintCount > 0) {
        // $('#task-icon i').removeClass('fa-check').addClass('fa-x');
        replaceBackgroudColor('#task-icon', 'red')
    } else {
        // $('#task-icon i').removeClass('fa-x').addClass('fa-check');
        replaceBackgroudColor('#task-icon', 'green')
    }
}

function replaceBackgroudColor(id, color) {
    const arrayColor = ['red', 'green', 'orange', 'blue', 'grey']
    for (const element of arrayColor) {
        $(id).removeClass(element)
    }
    $(id).addClass(color);
}

function replaceHtmlContent(id, content) {
    $(id).html(content);
}

function replaceBackgroudColorTor(data) {

    replaceBackgroudColor('#crTorque', data.crTorque)
    replaceHtmlContent('#torque_number', data.torque_number.toFixed(2))

    replaceBackgroudColor('#crTorUp', data.crTorUp)
    replaceHtmlContent('#torque_high_limit', data.torque_high_limit.toFixed(2))

    replaceBackgroudColor('#crTorDn', data.crTorDn)
    replaceHtmlContent('#torque_low_limit', data.torque_low_limit.toFixed(2))

    replaceHtmlContent('#torque_target', data.torque_target == ""? "" : data.torque_target.toFixed(2))

}


function replaceBackgroudColorAngel(data) {

    replaceBackgroudColor('#crAngle', data.crAngle)
    replaceHtmlContent('#angle_number', data.angle_number)

    replaceBackgroudColor('#crAngUp', data.crAngUp)
     replaceHtmlContent('#angle_high_limit', data.angle_high_limit)

    replaceBackgroudColor('#crAngDn', data.crAngDn)
    replaceHtmlContent('#angle_low_limit', data.angle_low_limit)

    replaceHtmlContent('#angle_target', data.angle_target)

}


function replaceTextFromCheckToX( data) {
    replaceHtmlContent('#hint1',data.lbStepHint1 == "" ? '&nbsp;' :data.lbStepHint1  )
    replaceHtmlContent('#hint2', data.lbStepHint2 == "" ? '&nbsp;':  data.lbStepHint2)
}

// function replaceTextNextPage(data) {
//     $('#textNextPage').html(`
//         <span>Next: P${data.nextPage}</span>
//     `);
// }

function replaceStepPage(data) {
    replaceHtmlContent('#stepPage', data.stepName)
}
function replaceTiltAngle(data) {
    $('#tilt_angle').html(`${data}`);
}

function replaceProgessFill(data) {
    console.log("1", data)
    $('#progress-bar-fill').html(`
        <div class="progress-fill"></div>
        <span class="progress-label">P${data.currentPage}</span>
        <span class="progress-status">${data.currentPage}/${data.totalPage}</span>
    `);
}

const selectJob = async (jobId) => {
    try {
        const apiUrl = `/get-pset-by-job-id?job-id=${jobId}`;
        
        // Make the GET request
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        alert(JSON.stringify(data));
        // Update the DOM with received data
        updateTextContent('textNextPage', `Next: ${data.NxtPset}`);
        updateTextContent('lbStep', `${data.CurPset}/${data.PsetCount}`);
        updateTextContent('curPset', `P${data.CurPset}`);
        updateTextContent('unit', `${data.Units}`);

        // Update progress bar
        const percentage = (data.CurPset / data.PsetCount) * 100;
        updateProgressBar('progress-bar-fill', percentage);

        // Get the Torque-Angle (TA) for the current Pset step
      

        // Update torque limits
        updateTextContent('torque_high_limit', data.torque_high_limit.toFixed(2));
        updateTextContent('torque_target', data.torque_target.toFixed(2));
        updateTextContent('torque_low_limit', data.torque_low_limit.toFixed(2));

        // Update angle limits
        updateTextContent('angle_high_limit', data.angle_high_limit);
        updateTextContent('angle_low_limit', data.angle_low_limit);

    } catch (error) {
        console.error("Error fetching or updating job data:", error);
        // Optionally display error in the UI
    }
};

// Utility function to update text content
const updateTextContent = (elementId, content) => {
    document.getElementById(elementId).textContent = content;
};

// Utility function to update progress bar width
const updateProgressBar = (elementId, percentage) => {
    document.getElementById(elementId).style.width = `${percentage}%`;
};

function handleJobChange() {
    const selectElement = document.getElementById('job-selection');
    const selectedJobId = selectElement.value; // Get the selected job ID

    if (selectedJobId) {
        console.log("Selected Job ID:", selectedJobId);
        //selectJob(selectedJobId); // Call selectJob if a valid job is selected
    } else {
        console.warn("No job selected"); // Optional: handle case when no job is selected
    }
}

// Function to update torque and angle data
const updateTorqueAndAngle = (data) => {
    const torqueNumber = parseFloat(data.torque_number) || 0;
    const angleNumber = parseFloat(data.angle_number) || 0;

    // Update the DOM with formatted torque and angle values
    $('#torque_number').text(torqueNumber.toFixed(2));
    $('#angle_number').text(angleNumber);
};

// Function to handle updates based on HintCount
const handleHintCountUpdates = (data) => {
    replaceIconFromCheckToX(data);
    // replaceBackgroudColor(data.HintCount);
    replaceTextFromCheckToX(data);
    replaceBackgroudColorTor(data);
    replaceBackgroudColorAngel(data);
};

// Function to handle page and progress bar updates
const handlePageAndProgressUpdates = (data) => {
    // replaceTextNextPage(data);
    replaceStepPage(data);
    // replaceProgessFill(data);
};

const updateCurrentPset = (data)=>{
    updateTextContent('textNextPage', `Next: ${data.NxtPset}`);
}


window.onload = () => {
    const jobSelection = document.getElementById('job-selection');
    
    // Select the first job option if available
    if (jobSelection.options.length > 1) {  // Assuming the first option is the placeholder
        jobSelection.selectedIndex = 1;  // Select the first job after placeholder
        jobSelection.dispatchEvent(new Event('change'));  // Trigger onchange event
    }
};

$(document).ready(function () {
    // Initialize the socket
    const socket = io();
    // Handle 'resultData' event
    socket.on('resultData', (data) => {
        alert(data);
        updateTorqueAndAngle(data);
        handleHintCountUpdates(data);
        handlePageAndProgressUpdates(data);
    });

    // Handle 'tilt_angle' event
    socket.on('tilt_angle', (data) => {
        replaceTiltAngle(data);
    });

    // Handle 'tilt_angle' event
    socket.on('torqueAndAngleUpdate', (data) => {
        updateTorqueAndAngle(data);
    });

    socket.on('handlePsetChange', (data) => {
        updateCurrentPset(data)
    });
    
    socket.on('bindingIP', (data) => {
        const deviceIpController = document.getElementById('device-ip-controller');
        const PI4Ip = document.getElementById('device-ip');
        deviceIpController.textContent = data.controllerIP;
        PI4Ip.textContent = data.PI4Ip;
    });
    
    // // Handle 'tilt_angle' event
    // socket.on('initColor', (data) => {

    // });
});




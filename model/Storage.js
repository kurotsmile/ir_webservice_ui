import fs from 'fs/promises';
import path from 'path';
import os from 'os'

const readJobFile = async (inID) => {
    try {
        const fnJob = getFullName(inID);
        const data = await fs.readFile(fnJob, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing the JSON file', error);
        throw new Error('Error reading data');
    }
};

function getFullName(inID) {
    const dirData = path.join(os.homedir(), 'Data');
    console.log("Home Path: ", path.join(dirData, `${inID}.json`))
    return path.join(dirData, `${inID}.json`);
}

const loadJobList = async ()=> {
    try {
        const fnJobList = getFullName("JobList");
        const fileContent = await fs.readFile(fnJobList, 'utf-8');
        const jobList = JSON.parse(fileContent);
        return jobList; // Returning the parsed job list    
    } catch (error) {
        console.error('Error reading or parsing the JSON file', error);
        throw new Error('Error reading data');
    }
    // Read the file synchronously
    
}

const getPset = async( inID)=>{
    if(inID != "")
        {
            const fnPset = getFullName(inID);
            const fileContent = await fs.readFile(fnPset, 'utf-8');
            return JSON.parse(fileContent);
        }
        return {};
}


export {readJobFile, loadJobList, getPset}
// Verify the URL parameter :state matches one of the 50 possible state abbreviations. 

const fsPromises = require('fs').promises;
const path = require('path');
const express = require('express');

const verifyState = async (req, res, next) => {
    try {
        // Retrieve data from the statesData.json file
        const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');
        
        // Parse data
        const data = JSON.parse(rawdata);
        
        // Create an array of state codes
        const stateCodeArray = [];
        for (let i = 0; i < data.length; i++) {
            stateCodeArray[i] = data[i].code;
        }

        // Search stateCodeArray for received state parameter
        let stateParam = req.params.state;
        stateParam = stateParam.replace(":", "");
        stateParam = stateParam.toUpperCase();

        const foundState = stateCodeArray.find((stateCode) => stateCode == stateParam);
        if (foundState) {
            // Attach the verified code to the request object
            req.code = foundState;
            next;
        } else {
            res.json({"message": "No states found."});
        }

    } catch (err) {
        console.error(err);
    }
}

module.exports = { verifyState };
// Verify the URL parameter :state matches one of the 50 possible state abbreviations. 

const fileData = require('../model/statesData.json');

const verifyState = (req, res, next) => {
        
        // Create an array of state codes
        const stateCodeArray = [];
        fileData.forEach((state) => {
            stateCodeArray.push(state.code);
        });

        // Search stateCodeArray for received state parameter
        let stateParam = req.params.state;
        stateParam = stateParam.toUpperCase();        
        const foundState = stateCodeArray.find((stateCode) => stateCode === stateParam);

        // If found, attach the verified code to the request object
        if (foundState) {
            req.code = foundState;
        
        // If not found, return an error message
        } else {
           return res.json({"message": "Invalid state abbreviation parameter"});
        }
        next();
}

module.exports = verifyState;
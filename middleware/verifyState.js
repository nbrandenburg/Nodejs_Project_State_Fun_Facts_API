// Verify the URL parameter :state matches one of the 50 possible state abbreviations. 

const fileData = require('../model/statesData.json');

const verifyState = async (req, res, next) => {

    try {
        
        // Create an array of state codes
        const stateCodeArray = [];
        fileData.forEach((state) => {
            stateCodeArray.push(state.code);
        })

        // Search stateCodeArray for received state parameter
        let stateParam = req.params.state;
        stateParam = stateParam.toUpperCase();        
        const foundState = stateCodeArray.find((stateCode) => stateCode === stateParam);

        // If found, attach the verified code to the request object
        if (foundState) {
            req.code = foundState;
            next;
        
        // If not found, return an error message
        } else {
            res.json({"message": "No states found."});
        }

    } catch (err) {
        console.error(err);
    }
}

module.exports = { verifyState };
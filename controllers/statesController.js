const State = require('../model/State');
const fsPromises = require('fs').promises;
const path = require('path');
const { verifyState } = require('../middleware/verifyState');


// GET all
const getAllStates = async (req, res) => {
    
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Retrieve data from MongoDB
    const databaseData = await State.find();

    // Match states in file with states in database
    fileData.forEach((fileState) => {
        const databaseState = databaseData.find((state) => state.stateCode == fileState.code);
        
        // If the state is in the database, store its funfacts in an array
        if (databaseState) {
            const factArray = databaseState.funfacts;

            // Append funfacts to the rest of the state facts
            if (factArray.length !== 0) {
                fileState.funfacts = [...factArray];
            }
        }
    });

    // Check for contig query
    if (req.query.contig) {
        const contig = req.query.contig;

        // If contig is true, return 48 contiguous states
        if (contig) {
            let contigStates = [];
            fileData.forEach((state) => {
                if (state.code != "AK" && state.code != "HI") {
                    contigStates.push(state);
                }
            });
            res.json(contigStates);
        }

        // If contig is false, return AK and HI
        else {
            let nonContigStates = [];
            fileData.forEach((state) => {
                if (state.code == "AK" || state.code == "HI") {
                    nonContigStates.push(state);
                }
            });
            res.json(nonContigStates);
        }
    }

    // If contig query is not set, return all states
    else {
        res.json(fileData);
    }    
}

// POST
const createNewState = async (req, res) => {
    // Make sure funfacts were provided
    if (!req?.body?.funfacts) {
        return res.status(400).json({"message": "State fun facts value required"});
    }

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state.toUpperCase()
    }).exec();

    try {

        // If the state doesn't exist in the DB, create it
        if (!state) {
            const result = await State.create({
                stateCode: req.params.state.toUpperCase(),
                funfacts: req.body.funfacts
            });
            res.status(201).json(result);
        }

        // If there are already funfacts for the state, merge them with the new funfacts
        else {
            state.funfacts.push(req.body.funfacts);

            // Save to database
            const result = await state.save();
            res.status(201).json(result);
        }

    } catch (error) {
        console.error(error);
    }
}

// PATCH
const updateState = async (req, res) => {

    // Make sure funfacts and index were provided
    if (!req?.body?.funfacts || !req?.body?.index) {
        return res.status(400).json({"message": "Fun facts and index required to update"});
    }

    const index = req.body.index;

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state.toUpperCase()
    }).exec();

    try {

        // Find the funfact to be updated using the index   
        state.funfacts[index - 1] = req.body.funfacts;

        // Save to database
        result = await state.save();
        res.status(201).json(result);

    } catch (error) {
        console.error(error);
    }
}

// DELETE
const deleteState = async (req, res) => {

    // Make sure index was provided
    if (!req?.body?.index) {
        return res.status(400).json({"message": "Index required to delete"});
    }

    const index = req.body.index;

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state.toUpperCase()
    }).exec();

    try {

        // Find the funfact to be deleted using the index   
        state.funfacts.splice((index - 1), 1);

        // Save to database
        result = await state.save();
        res.status(201).json(result);

    } catch (error) {
        console.error(error);
    }
}

// GET single
const getState = async (req, res) => {
    // Make sure state is provided
    if (!req?.params?.state) return res.status(400).json({'message': 'State required.'});

    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Retrieve data from MongoDB
    const databaseData = await State.find();

    // Match states in file with states in database
    fileData.forEach((fileState) => {
        const databaseState = databaseData.find((state) => state.stateCode == fileState.code);
        
        // If the state is in the database, store its funfacts in an array
        if (databaseState) {
            const factArray = databaseState.funfacts;

            // Append funfacts to the rest of the state facts
            if (factArray.length !== 0) {
                fileState.funfacts = [...factArray];
            }
        }
    });

    let result;
    // Find Parameter State
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            result = fileState;
        }
    })

    // Set response
    res.json(result);
}

// Capital
const getStateCapital = async (req, res) => {
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);
    
    // Find Parameter State
    let paramState;   
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            paramState = fileState;
        }
    });

    // Create array with state name and capital
    const capitalArray = {
        state: paramState.state,
        capital: paramState.capital_city
    }
    res.json(capitalArray);
}

// Nickname
const getStateNickname = async (req, res) => {
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Retrieve data from MongoDB
    const databaseData = await State.find();

    // Find Parameter State
    let paramState;
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            paramState = fileState;
        }
    });

    // Create array with state name and nickname
    const nicknameArray = {
        state: paramState.state,
        nickname: paramState.nickname
    }
    res.json(nicknameArray);
}

// Population
const getStatePopulation = async (req, res) => {
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Find Parameter State
    let paramState;    
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            paramState = fileState;
        }
    });

    // Format number
    const population = new Intl.NumberFormat("en-US").format(paramState.population);

    // Create array with state name and population
    const populationArray = {
        state: paramState.state,
        population: population
    }
    res.json(populationArray);
}

// Admission
const getStateAdmission = async (req, res) => {
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Find Parameter State
    let paramState;    
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            paramState = fileState;
        }
    });

    // Create array with state name and admission date
    const admissionArray = {
        state: paramState.state,
        admitted: paramState.admission_date
    }
    res.json(admissionArray);
}

// Random Fun Fact
const getStateFunfact = async (req, res) => {
    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse json data
    const fileData = await JSON.parse(rawdata);

    // Retrieve data from MongoDB
    const databaseData = await State.find();

    // Match states in file with states in database
    fileData.forEach((fileState) => {
        const databaseState = databaseData.find((state) => state.stateCode == fileState.code);
        
        // If the state is in the database, store its funfacts in an array
        if (databaseState) {
            const factArray = databaseState.funfacts;

            // Append funfacts to the rest of the state facts
            if (factArray.length !== 0) {
                fileState.funfacts = [...factArray];
            }
        }
    });
    
    let paramState;
    // Find Parameter State
    fileData.forEach((fileState) => {
        if (fileState.code === req.params.state.toUpperCase()) {
            paramState = fileState;
        }
    });

    // Create array with state name and random fun fact
    const admissionArray = {
        state: paramState.state,
        funfact: paramState.admission
    }
    res.json(admissionArray);
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState, 
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    getStateFunfact
}
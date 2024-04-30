const State = require('../model/State');
const fsPromises = require('fs').promises;
const path = require('path');
const { verifyState } = require('../middleware/verifyState');


// GET all
const getAllStates = async (req, res) => {

    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');

    // Parse data
    const states = await JSON.parse(rawdata);

    // Retrieve funfacts from database

    // If statesFunFacts exist, merge them with the data from the file
    
    res.json(states);
}

// POST
const createNewState = async (req, res) => {
    // Make sure funfacts were provided
    if (!req?.body?.funfacts) {
        return res.status(400).json({"message": "Fun facts required to create"});
    }

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state
    }).exec();

    try {

        // If the state doesn't exist in the DB, create it
        if (!state) {
            const result = await State.create({
                stateCode: req.params.state,
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

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state
    }).exec();

    try {

        // Find the funfact to be updated using the index   
        state.funfacts[index + 1] = req.body.funfacts;

        // Save to database
        const result = await State.update({
            stateCode: req.params.state,
            funfacts: state.funfacts
        });

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

    // Find state in database
    const state = await State.findOne({
        stateCode: req.params.state
    }).exec();

    try {

        // Find the funfact to be deleted using the index   
        const deleted =  delete state.funfacts[index + 1];

        // Save to database
        const result = await State.update({
            stateCode: req.params.state,
            funfacts: state.funfacts
        });

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

    // Verify state
    verifyState();

    // Retrieve data from the statesData.json file
    const rawdata = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'statesData.json'), 'utf8');
    const data = JSON.parse(rawdata);
    const state = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].code == req.code) {
            state = data[i];
        }
    }

    // Retrieve state funfacts from database
    const stateFunFacts = await State.findOne({ _state: req.params.state }).exec();
    if(!stateFunFacts) {
        return res.status(204).json({ 'message': `No state matches ${req.body.state}`});
    }

    // Merge data from file and database
    state.push(stateFunFacts);

    // Set response
    res.json(state);
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState, 
    getState
}
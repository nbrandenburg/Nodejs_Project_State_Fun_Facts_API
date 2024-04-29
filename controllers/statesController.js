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
    
    // Retrieve states from MongoDB
    const statesFunFacts = await State.find();
   
    if (!statesFunFacts) return res.status(204).json({ 'message': 'No states found.'});
    
    // Combine data from file and database
    for (let i = 0; i < states.length; i++) {
        if (states[i].code == statesFunFacts[i].stateCode) {
            states[i].push(statesFunFacts[i].funfacts);
        }
    }

    // Set response
    res.json(states);
}

// POST
const createNewState = async (req, res) => {
    // Make sure funfacts parameter is provided
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'Fun Fact is required.' });
    }

    // Verify State with middleware
    verifyState(req, res);

    // Check if funfacts already exist for the state
    const stateFunFacts = await State.findOne({ _state: req.code }).exec();

    try{
        // If funfacts already exist, merge them with the new ones
        const newFacts = req.body.funfacts;

        if (stateFunFacts) {
            for (let i = 0; i < newFacts.length; i++) {
                stateFunFacts.push({
                    funfacts: newFacts[i]
                });

            }
            const result = await State.create({
                stateCode: req.code,
                funfacts: stateFunFacts
            });
            res.status(201).json(result);
        }
        // Otherwise, create new funfacts
        else {
            const result = await State.create({
                stateCode: req.code,
                funfacts: req.body.funfacts
            });
            res.status(201).json(result);
        }
    } catch (err) {
        console.error(err);
    }
}

// PATCH
const updateState = async (req, res) => {
    // Make sure funfacts parameter is provided
    if (!req?.body?.state) {
        return res.status(400).json({ 'message': 'state parameter is required.' });
    }

    const state = await State.findOne({ _state: req.body.state }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches ${req.body.state}`});
    }
    if (req.body?.firstname) state.firstname = req.body.firstname;
    if (req.body?.lastname) state.lastname = req.body.lastname;
    const result = await state.save();
    res.json(result);
}

// DELETE
const deleteState = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message': 'State code required.'});

    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ 'message': `No state matches ID ${req.body.id}`});
    }
    const result = await state.deleteOne({ _id: req.body.id });
    res.json(result);
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
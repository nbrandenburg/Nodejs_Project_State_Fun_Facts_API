const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require ('../../middleware/verifyState');

// GET all states
router.route('/').get(statesController.getAllStates);

// GET single state - uses middleware
router.route('/:state').get(verifyState, statesController.getState);
router.route('/:state/capital').get(verifyState, statesController.getStateCapital);
router.route('/:state/nickname').get(verifyState, statesController.getStateNickname);
router.route('/:state/population').get(verifyState, statesController.getStatePopulation);
router.route('/:state/admission').get(verifyState, statesController.getStateAdmission);

router.route('/:state/funfact')
    .get(verifyState, statesController.getRandomStateFunfact)
    .post(verifyState, statesController.createNewState)
    .patch(verifyState, statesController.updateState)
    .delete(verifyState, statesController.deleteState)

// Catch all for routes that do not exist
router.route('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

module.exports = router;

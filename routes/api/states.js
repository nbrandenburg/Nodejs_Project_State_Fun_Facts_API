const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

// GET
router.route('/').get(statesController.getAllStates)
router.route('/:state').get(statesController.getState)
router.route('/:state/capital').get(statesController.getStateCapital)
router.route('/:state/nickname').get(statesController.getStateNickname)
router.route('/:state/population').get(statesController.getStatePopulation)
router.route('/:state/admission').get(statesController.getStateAdmission)
router.route('/:state/funfact').get(statesController.getRandomStateFunfact)

// POST
router.route('/:state/funfact').post(statesController.createNewState)

// PATCH
router.route('/:state/funfact').patch(statesController.updateState)

// DELETE
router.route('/:state/funfact').delete(statesController.deleteState)

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

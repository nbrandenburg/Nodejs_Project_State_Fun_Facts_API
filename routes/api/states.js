const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    
    .patch(statesController.updateState)
    .delete(statesController.deleteState);

    router.route('/:state')
        .get(statesController.getState)
        .post(statesController.createNewState);

module.exports = router;

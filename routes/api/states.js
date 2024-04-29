const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)    

    router.route('/:state')
        .get(statesController.getState)
        .post(statesController.createNewState)
        .patch(statesController.updateState)
        .delete(statesController.deleteState);

module.exports = router;

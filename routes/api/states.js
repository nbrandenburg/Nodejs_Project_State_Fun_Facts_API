const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    
router.route('/states')
    .get(statesController.getAllStates)

router.route('/states/:state/capital')
    .get(statesController.getStateCapital)

router.route('/states/:state/nickname')
    .get(statesController.getStateNickname)

router.route('/states/:state/population')
    .get(statesController.getStatePopulation)

router.route('/states/:state/admission')
    .get(statesController.getStateAdmission)

router.route('/states/:state/funfact')
    .get(statesController.getStateFunfact)
    .post(statesController.createNewState)
    .patch(statesController.updateState)
    .delete(statesController.deleteState)

router.route('/states/:state')
    .get(statesController.getState)     

module.exports = router;

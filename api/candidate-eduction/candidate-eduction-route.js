const express = require('express');
const router = express.Router();
const candidateEductionController = require('./candidate-eduction-controller'); // Ensure the correct path and export

// Define a route for creating a user
 router.post('/', candidateEductionController.createCandidateEduction);
router.put('/', candidateEductionController.updateCandidteEduction); 

router.get('/', candidateEductionController.getCandidteListEduction);
 router.get('/:candidateId', candidateEductionController.getEductionByCandidteId);
router.delete('/', candidateEductionController.deleteCandidateEduction); 

module.exports = router; // Export the router

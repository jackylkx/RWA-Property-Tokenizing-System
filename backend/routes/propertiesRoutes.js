const express = require('express');
const router = express.Router();
const PropertiesController = require('../controllers/propertiesController');

// Routes
router.post('/', PropertiesController.createProperties);
router.get('/:id', PropertiesController.getPropertiesById);
router.put('/:id', PropertiesController.updateProperties);
router.delete('/:id', PropertiesController.deleteProperties);

module.exports = router;
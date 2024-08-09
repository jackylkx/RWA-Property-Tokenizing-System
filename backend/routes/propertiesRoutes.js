const express = require('express');
const router = express.Router();
const PropertiesController = require('../controllers/propertiesController');

// Routes
router.post('/', PropertiesController.createProperties);
router.put('/:id', PropertiesController.listProperties);
router.get('/:id', PropertiesController.getPropertiesById);
router.get('/fundstatus/:fundstatus', PropertiesController.getPropertiesByStatus);
router.get('/', PropertiesController.getPropertiesByListing);
router.get('/fundstatus/:fundstatus/seller/:seller', PropertiesController.getPropertiesByStatusSeller);
router.get('/seller/:seller', PropertiesController.getPropertiesBySeller);
router.put('/:id', PropertiesController.updateProperties);
router.delete('/:id', PropertiesController.deleteProperties);

module.exports = router;
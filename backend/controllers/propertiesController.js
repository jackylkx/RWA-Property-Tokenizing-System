// controllers/PropertiesController.js (Request handlers)

const Properties = require('../models/Properties');

module.exports = {
    async createProperties(req, res) {
        try {
            const Properties = await Properties.create(req.body);
            res.status(201).json(Properties);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getPropertiesById(req, res) {
        try {
            const Properties = await Properties.findById(req.params.id);
            res.status(200).json(Properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesByStatus(req, res) {
        try {
            const Properties = await Properties.find({ fundStatus : req.param.fundStatus });
            res.status(200).json(Properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesByStatusSeller(req, res) {
        try {
            const Properties = await Properties.find({ fundStatus : req.param.fundStatus, seller: req.param.seller });
            res.status(200).json(Properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async updateProperties(req, res) {
        try {
            const Properties = await Properties.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(Properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async deleteProperties(req, res) {
        try {
            await Properties.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    }
};
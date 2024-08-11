// controllers/PropertiesController.js (Request handlers)

const Properties = require('../models/Properties');

module.exports = {
    async createProperties(req, res) {
        try {
            const properties = await Properties.create(req.body);
            res.status(201).json(properties);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getPropertiesById(req, res) {
        try {
            
            const properties = await Properties.find({propertyid : req.params.id});
            if (properties.length === 0) {
                return res.status(404).json({ message: 'No listed properties found' });
            }
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ message: error.message  });
        }
    },

    async getPropertiesByRefundStatus(req, res) {
        try {
            const properties = await Properties.find({ fundStatus : 3, isListed :true, approval : true });            
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesByStatus(req, res) {
        try {
            const properties = await Properties.find({ fundStatus : req.params.fundstatus });            
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesByStatusSeller(req, res) {
        try {
            const properties = await Properties.find({ fundstatus : req.param.fundStatus, seller: req.param.seller });
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesBySeller(req, res) {
        try {
   
            const properties = await Properties.find({ seller: { $regex: `^${req.params.seller}$`, $options: 'i' }  });
            if (properties.length === 0) {
                return res.status(404).json({ message: 'No listed properties found' });
            }
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    },

    async getPropertiesByListing(req, res) {
        try {
            const properties = await Properties.find({ isListed : true });
            if (properties.length === 0) {
                return res.status(404).json({ message: 'No listed properties found' });
            }
            res.status(200).json(properties);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    },


    async updateProperties(req, res) {
        try {
    
            const properties = await Properties.findOneAndUpdate({propertyid : req.params.id}, req.body, { new: true });
            if (!properties) {
                return res.status(404).json({ message: 'Property not found' });
            }
            
            res.status(200).json(properties);
        } catch (error) {
            res.status(404).json({ Error: error.message });
        }
    },

    async deleteProperties(req, res) {
        try {
            await properties.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: 'Properties not found' });
        }
    }
};
const express = require('express');
const router = express.Router();
const { veterinary, schema } = require('../models/animalreg'); 
const validateAnim = require('../middleware/vetMiddleWare');

// Create and save a new animal
router.post("/create", validateAnim(schema), async (req, res) => {
    try {
        const cow = new veterinary(req.body);
        const data = await cow.save();
        res.status(201).json({ success: true, message: "Data added successfully", data });
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating" });
    }
});

//count
router.get('/count', async (req, res) => {
    try {
        const count = await veterinary.countDocuments();
        res.json({ success: true, count });
    } catch (error) {
        console.error("Error fetching total count:", error);
        res.status(500).json({ success: false, error: "Failed to fetch total count" });
    }
});
//count female cows
router.get('/count-females', async (req, res) => {
    try {
        const count = await veterinary.countDocuments({ $or: [{ gender: "female" }, { gender: "Female" }] });
        res.json({ success: true, count });
    } catch (error) {
        console.error("Error fetching total count of females:", error);
        res.status(500).json({ success: false, error: "Failed to fetch total count of females" });
    }
});

// Retrieve animals
router.get('/retrieve', async (req, res) => {
    try {
        const data = await veterinary.find({ age: { $exists: true } }); // Retrieve all animals
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ message: error.message || "Error occurred while retrieving" });
    }
});

// Retrieve by id
router.get('/retrieve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await veterinary.findById(id);
        if (!animal) {
            return res.status(404).json({ message: `Animal with id ${id} not found` });
        }
        res.json({ success: true, data: animal });
    } catch (error) {
        res.status(500).json({ message: `Error retrieving animal: ${error.message}` });
    }
});

// Update by id
router.put('/update/:id', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Data to update can not be empty" });
        }
        
        const id = req.params.id;
        const updatedAnimal = await veterinary.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if (!updatedAnimal) {
            res.status(400).json({ message: `Cannot update cow with id ${id}. May be not found` });
        } else {
            // Fetch the updated 
            const updatedData = await veterinary.findById(id);
            res.status(200).json({ success: true, message: "Animal updated successfully", data: updatedData });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating cow" });
    }
});

// Delete by id
router.delete('/delete/:id',validateAnim(schema), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnimal = await veterinary.findByIdAndDelete(id); // Corrected
        if (!deletedAnimal) {
            return res.status(404).json({ message: `Cannot delete with id ${id}. May be wrong` });
        }
        res.status(200).json({ success: true, message: "Animal deleted successfully", deletedAnimal });
    } catch (error) {
        res.status(500).json({ message: `Couldn't delete: ${error.message}` });
    }
});


router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Animal Registry API' });
});

module.exports = router;

const Medicine = require("../models/medicineModel");

const addMedicine = async (req, res) => {
    const { name, type, dose, amount, reminder } = req.body;
    try {
        const userId = req.user._id;
        const medicine = new Medicine({
            name,
            type,
            dose,
            amount,
            reminder,
            userId,
        });

        await medicine.save();
        res.status(201).send(medicine);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const usedMedicine = async (req, res) => {
    const { medicineId } = req.params;
    const userId = req.user._id;
    try {
        const medicine = await Medicine.findOneAndUpdate(
            { _id: medicineId, userId },
            { usedToday: true },
            { new: true }
        );
        if (!medicine) {
            return res.status(404).send({ error: "Medicine not found" });
        }
        res.send(medicine);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getUserMedicine = async (req, res) => {
    const userId = req.user._id;
    try {
        const medicine = await Medicine.find({ userId });
        res.send(medicine);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteMedicine = async (req, res) => {
    const { medicineId } = req.params;
    const userId = req.user._id;
    try {
        const medicine = await Medicine.findOneAndDelete({
            _id: medicineId,
            userId,
        });
        if (!medicine) {
            return res.status(404).send({ error: "Medicine not found" });
        }
        res.send(medicine);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateMedicine = async (req, res) => {
    const { medicineId } = req.params;
    const userId = req.user._id;
    const { name, type, dose, amount, reminder } = req.body;

    try {
        const medicine = await Medicine.findOneAndUpdate(
            { _id: medicineId, userId },
            { name, type, dose, amount, reminder },
            { new: true }
        );
        if (!medicine) {
            return res.status(404).send({ error: "Medicine not found" });
        }
        res.send(medicine);
    } catch (error) {}
};

module.exports = {
    addMedicine,
    usedMedicine,
    getUserMedicine,
    deleteMedicine,
    updateMedicine,
};

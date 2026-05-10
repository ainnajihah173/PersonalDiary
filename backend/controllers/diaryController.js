const Diary = require('../models/Diary');


// UPDATE CREATE
const createDiary = async (req, res) => {

    try {

        const diary = await Diary.create({

            user: req.user._id,

            title: req.body.title,

            content: req.body.content,

            mood: req.body.mood
        });

        res.status(201).json(diary);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// READ ALL
const getDiaries = async (req, res) => {
    try {

        // Filter by the logged-in user's ID
        const diaries = await Diary.find({ user: req.user._id });

        res.json(diaries);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// READ SINGLE
const getDiaryById = async (req, res) => {
    try {

        const diary = await Diary.findById(req.params.id);

        if (!diary) {
            return res.status(404).json({
                message: 'Diary not found'
            });
        }

        // Check ownership
        if (diary.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }


        res.json(diary);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE
const updateDiary = async (req, res) => {
    try {
        let diary = await Diary.findById(req.params.id);

        if (!diary) {
            return res.status(404).json({
                message: 'Diary not found'
            });
        }

        // Check ownership
        if (diary.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, content, mood } = req.body;

        diary = await Diary.findByIdAndUpdate(
            req.params.id,
            { title, content, mood },
            { new: true }
        );

        res.json(diary);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE
const deleteDiary = async (req, res) => {
    try {
        const diary = await Diary.findById(req.params.id);

        if (!diary) {
            return res.status(404).json({
                message: 'Diary not found'
            });
        }

        // Check ownership
        if (diary.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await diary.deleteOne();

        res.json({
            message: 'Diary deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createDiary,
    getDiaries,
    getDiaryById,
    updateDiary,
    deleteDiary
};
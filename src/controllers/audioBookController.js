const AudioBook = require("../models/audioBookModel");

exports.AddAudioBook = async (req, res) => {
    /*
    #swagger.parameters['audioFile'] = {
            in: 'formData',
            description: 'Audio File. Note: Do not test the file upload Here',
            required: false,
            type: 'file'
        }
    #swagger.parameters['coverImage'] = {
            in: 'formData',
            description: 'Cover Photo. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
        }
    */
    const { title, author, description, duration, genre } = req.body;
    const audioFile = req.files["audioFile"][0].path;
    const coverImage = req.files["coverImage"][0].path;
    const userId = req.user._id;

    try {
        const audioBook = new AudioBook({
            title,
            author,
            description,
            duration,
            genre,
            audioFile,
            coverImage,
            addedBy: userId,
        });

        await audioBook.save();
        res.status(201).send(audioBook);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getAllAudioBook = async (req, res) => {
    try {
        const audioBooks = await AudioBook.find({});
        res.send(audioBooks);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

exports.getAudioBook = async (req, res) => {
    const { audioBookId } = req.params;
    try {
        const audioBook = AudioBook.findById(audioBookId);
        if (!audioBook) {
            return res.status(404).send({ error: "AudioBook not found" });
        }
        res.send(audioBook);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

exports.updateAudioBook = async (req, res) => {
    /*
    #swagger.parameters['audioFile'] = {
            in: 'formData',
            description: 'Audio File. Note: Do not test the file upload Here',
            required: false,
            type: 'file'
        }
    #swagger.parameters['coverImage'] = {
            in: 'formData',
            description: 'Cover Photo. Note: Do not test the photo upload Here',
            required: false,
            type: 'file'
        }
    */
    const { audioBookId } = req.params;
    const { title, author, description, duration, genre } = req.body;
    const audioFile = req.files["audioFile"][0].path;
    const coverImage = req.files["coverImage"][0].path;
    const userId = req.user._id;
    try {
        const audioBook = await AudioBook.findById(audioBookId);
        if (!audioBook) {
            return res.status(404).send({ error: "AudioBook not found" });
        }
        if (audioBook.addedBy.toString() !== userId.toString()) {
            return res.status(403).send({
                error: "Your are not permitted to perform this operation",
            });
        }

        const updatedAudioBook = await AudioBook.findOneAndUpdate(
            { _id: audioBookId },
            {
                title,
                author,
                description,
                duration,
                genre,
                audioFile,
                coverImage,
            },
            { new: true }
        );
        res.send(updatedAudioBook);
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

exports.deleteAudioBook = async (req, res) => {
    const { audioBookId } = req.params;
    const userId = req.user._id;
    try {
        const audioBook = await AudioBook.findById(audioBookId);
        if (!audioBook) {
            return res.status(404).send({ error: "AudioBook not found" });
        }
        if (audioBook.addedBy.toString() !== userId.toString()) {
            return res.status(403).send({
                error: "Your are not permitted to perform this operation",
            });
        }
        await AudioBook.deleteOne({ _id: audioBookId });
        res.send({ message: "AudioBook Deleted Successfully", audioBook });
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};

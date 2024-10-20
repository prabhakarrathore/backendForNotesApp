const data = require('../model/Notes');
const { encrypt, decrypt } = require("../secure/encrypt")

const getAllNotes = async (req, res) => {
    if (!req?.params?.userid) {
        return res.status(400).json({ 'message': 'ID is required.' });
    }
    const Notes = await data.find({ userId: req.params.userid }).exec();
    if (!Notes) return res.status(204).json({ 'message': 'No Notes found.' });
    const decryptedNotes = Notes.map(note => ({
        id: note._doc._id.toString(),
        title: decrypt(JSON.parse(note.title)),
        note: decrypt(JSON.parse(note.note)),
        fav: note.fav
    }));
    res.json(decryptedNotes);
};

const createNewNote = async (req, res) => {
    if (!req?.params?.userid) {
        return res.status(400).json({ 'message': 'title or note is required.' });
    }
    if (req?.params?.userid !== req.id) {
        return res.status(400).json({ 'message': 'Id has modified.' });
    }
    const encryptedNote = encrypt(req.body.note);
    const encryptedTitle = encrypt(req.body.title);
    try {
        const result = await data.create({
            userId: req.params.userid,
            title: JSON.stringify(encryptedTitle),
            note: JSON.stringify(encryptedNote),
            fav: false,
        })
        res.status(201).json(result);
    } catch (error) {
        console.error(error)
    }
    res.status(201).json(data.note);
};

const updateNote = async (req, res) => {
    if (!req?.body?.id && !req?.params?.userid) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    };
    if (req?.params?.userid !== req.id) {
        return res.status(400).json({ 'message': 'Id has modified.' });
    }
    const note = await data.findOne({ userId: req.params.userid, _id: req.body.id }).exec();
    if (!note) {
        return res.status(204).json({ "message": `No Note ID matches ${req.body.id}.` });
    };
    decrypt(JSON.parse(note.title));
    decrypt(JSON.parse(note.note));

    const encryptedTitle = encrypt(req.body.title);
    const encryptedNote = encrypt(req.body.note);
    if (req.body?.title || !req.body?.title) note.title = JSON.stringify(encryptedTitle);
    if (req.body?.note || !req.body?.note) note.note = JSON.stringify(encryptedNote);
    const result = await note.save();
    res.json(result);
}
const favoriteNote = async (req, res) => {
    if (!req?.params?.id && !req?.params?.userid) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    };
    if (req?.params?.userid !== req.id) {
        return res.status(400).json({ 'message': 'Id has modified.' });
    }
    const note = await data.findOne({ userId: req.params.userid, _id: req.params.id }).exec();
    if (!note) {
        return res.status(204).json({ "message": `No Note ID matches ${req.params.id}.` });
    };

    note.fav = !note.fav;

    const result = await note.save();
    res.json(result);
}

const deleteNote = async (req, res) => {
    if (!req?.params?.id && !req?.params?.userid) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    };
    if (req?.params?.userid !== req.id) {
        return res.status(400).json({ 'message': 'Id has modified.' });
    }
    const note = await data.findOne({ userId: req.params.userid, _id: req.params.id }).exec();
    if (!note) {
        return res.status(400).json({ "message": `Note ID ${req.params.id} not found` });
    }
    const result = await data.deleteOne({ _id: req.params.id });
    res.json(result);
}

module.exports = {
    getAllNotes,
    updateNote,
    deleteNote,
    createNewNote,
    favoriteNote
}

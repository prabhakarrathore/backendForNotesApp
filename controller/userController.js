const User = require("../model/User");
const data = require("../model/Notes");

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
};
const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });

    if (req?.params?.id !== req.id) {
        return res.status(400).json({ 'message': 'Id has modified.' });
    }

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.params.id });
    await data.deleteMany({ userId: req.params.id });
    res.json(result);
};

module.exports = {
    deleteUser,
    getUser
}
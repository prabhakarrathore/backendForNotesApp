const User = require("../model/User");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content to send back

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true });
        return res.sendStatus(204); // No content to send back
    }

    // Remove the refresh token from the user's refreshToken array
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204); // No content to send back
}

module.exports = { handleLogout };

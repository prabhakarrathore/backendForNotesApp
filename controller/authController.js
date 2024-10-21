const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    try {
        const cookies = req.cookies;
        const { user, pwd } = req.body;
        if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

        const foundUser = await User.findOne({ username: user }).exec();
        if (!foundUser) {
            return res.sendStatus(401); // Unauthorized
        }

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            // Create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "id": foundUser.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            let newRefreshTokenArray =
                !cookies?.jwt
                    ? foundUser.refreshToken
                    : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

            if (cookies?.jwt) {
                const refreshToken = cookies.jwt;
                const foundToken = await User.findOne({ refreshToken }).exec();
                if (!foundToken) {
                    newRefreshTokenArray = [];
                }
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            }

            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } else {
            res.sendStatus(401); // Unauthorized
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal Server Error
    }
}

module.exports = { handleLogin };

const { UserToken } = require('../models/user');
const jwt = require('jsonwebtoken');


const createToken = async (req, res, data) => {
    try {

        const existingToken = await UserToken.findOne({ _id: data._id });

        const expireInOneDay = 3600 * 24; // 24 hours in seconds
        const token = jwt.sign({ data: data }, process.env.SECRET_KEY, { expiresIn: expireInOneDay });

        if (existingToken) {
            // Check if the existing token is still valid
            if (existingToken.active === 1) {
                // If token exists and is active, update it
                existingToken.token = token;
                existingToken.expiresIn = expireInOneDay;
                await existingToken.save(); // Save the updated token document

                return {
                    isVerified: true,
                    token: token,
                    message: "Token updated successfully.",
                };
            } else {
                // If the existing token is not active (expired), create a new token
                existingToken.token = token;
                existingToken.active = 1; // Reactivate the token
                existingToken.expiresIn = expireInOneDay;
                await existingToken.save(); // Save the updated token document

                return {
                    isVerified: true,
                    token: token,
                    message: "New token created as the previous one was inactive.",
                };
            }
        } else {
            // If token doesn't exist, create a new token
            const newUserToken = new UserToken({
                _id: data._id,
                token: token,
                active: 1,
                expiresIn: expireInOneDay, // Set expiration as timestamp
            });

            await newUserToken.save(); // Save the new token document to the database

            return {
                isVerified: true,
                token: token,
                message: "New token created successfully.",
            };
        }
    } catch (error) {
        console.error("Error creating/updating token:", error);
        return {
            isVerified: false,
            message: "Error creating token",
        };
    }
};

const verifyToken = async (req, res, next) => {
    const bearerHeader = await req.headers["authorization"];
    if (!bearerHeader) {
        return { message: "Token is missing", isVerified: false };
    }
    let token = bearerHeader.split(" ")[1];
    if (typeof bearerHeader !== "undefined" && token) {
        let matchToken = await UserToken.findOne({ token: token });
        try {
            if (matchToken && matchToken.active === 1) {
                const decode = await jwt.verify(token, process.env.SECRET_KEY);
                return {
                    message: "Success",
                    isVerified: true,
                    data: decode,
                    token: token,
                };
            } else {
                return {
                    message: "Token Expired !!",
                    isVerified: false,
                    data: "",
                };
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return {
                    message: "Token Expired",
                    isVerified: false,
                    data: "",
                };
            } else {
                console.log(error);
                return {
                    message: "UnAuthorized User !!",
                    isVerified: false,
                    data: "",
                };
            }
        }
    } else {
        res.status(400).send({ status: false, message: "Invalid token" });
    }
};


module.exports = { createToken, verifyToken };
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['editor', 'viewer'], default: 'editor' },
    password: { type: String, required: true, select: false, minLength: 8 },
}, { versionKey: false });

const userTokenSchema = new mongoose.Schema({
    token: { type: String },
    active: { type: Number, default: 1 },
    expiresIn: { type: Number }
}, { versionKey: false })

const User = mongoose.model('User', userSchema);
const UserToken = mongoose.model('UserToken', userTokenSchema);



module.exports = { User, UserToken };
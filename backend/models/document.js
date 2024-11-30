const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    createdBy: { type: ObjectId, ref: 'User', required: true },
    versions: [
        {
            versionId: { type: String },
            content: { type: String },
            timestamp: { type: Date, default: Date.now },
            modifiedBy: { type: ObjectId, ref: 'User' }
        }
    ]
}, { versionKey: false });

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
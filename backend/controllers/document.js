const Document = require('../models/document');
const { verifyToken } = require('../services/tokenServices');


const createNewDocument = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (!verification.isVerified) {
            return res.status(401).json({ status: false, message: verification.message })
        }
        const { title, content } = req.body;
        const createdBy = verification.data.data.id;


        const newDocument = {
            title,
            content,
            createdBy
        }
        await Document.create(newDocument);
        res.status(201).json({ status: true, message: 'Document created successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const getAllDocument = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (!verification.isVerified) {
            return res.status(401).json({ status: false, message: verification.message })
        }
        const createdBy = verification.data?.data?.id;
        if (!createdBy) {
            return res.status(400).json({ status: false, message: "Invalid or missing user ID" });
        }
        const documents = await Document.find({ createdBy }).populate('createdBy');
        if (!documents) {
            return res.status(404).json({ status: false, message: "No documents found for the user" })
        }
        res.status(200).json({ status: true, message: "Get all document for user", data: documents })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const getDocumentById = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (!verification.isVerified) {
            return res.status(401).json({ status: false, message: verification.message })
        }
        const { id } = req.params;
        const getDocumentById = await Document.findOne({ _id: id })
        if (!getDocumentById) {
            return res.status(404).json({ status: false, message: "Document not found" })
        }
        return res.status(200).json({ status: true, message: "Get document by id", data: getDocumentById })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const updateDocument = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (!verification.isVerified) {
            return res.status(401).json({ status: false, message: verification.message })
        }
        const { id } = req.params;
        const userId = verification.data?.data?.id;
        const { title, content } = req.body
        const document = await Document.findById({ _id: id });
        if (!document) {
            return res.status(404).json({ status: false, message: "Document not found" });
        }
        // Check if the user has permission to edit
        if (document.createdBy.toString() !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized to edit this document" });
        }
        const updateFields = {};
        if (title !== undefined) {
            updateFields.title = title;
        }
        if (content !== undefined) {
            updateFields.content = content;
        }
        const updateResult = await Document.updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (updateResult.modifiedCount === 1) {
            req.io.emit('editDocument', async ({ id, content, title }) => {
                const document = await Document.findOne({ _id: id });
                if (document) {
                    document.content = content;
                    document.title = title
                    document.versions += 1;
                    await document.save();
                    io.to(docId).emit('documentUpdated', document);
                }
            });
            return res.status(200).json({ status: true, message: "Document updated successfully" });
        } else {
            return res.status(500).json({ status: false, message: "Failed to update document" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

const joinDocument = async (req, res, io) => {
    try {
        // const verification = await verifyToken(req, res);
        // if (!verification.isVerified) {
        //     return res.status(401).json({ status: false, message: verification.message });
        // }

        const { id } = req.body;

        // Find the document
        const document = await Document.findById({ _id: id }).populate('createdBy');
        if (!document) {
            return res.status(404).json({ status: false, message: "Document not found" });
        }


        req.io.emit("joinDocument", {
            documentId: id,
            document,
            message: "Document joined successfully",
        });
        return res.status(200).json({ status: true, message: "Joined document successfully", data: document });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

module.exports = { createNewDocument, getAllDocument, getDocumentById, updateDocument, joinDocument }
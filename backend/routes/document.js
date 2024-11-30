const express = require('express');
const router = express.Router();

const { createNewDocument, getAllDocument, getDocumentById, updateDocument, joinDocument } = require('../controllers/document');

router.post('/create', createNewDocument);
router.get('/all', getAllDocument);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.post('/join', joinDocument);


module.exports = router;
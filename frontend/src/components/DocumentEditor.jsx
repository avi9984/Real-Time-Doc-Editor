import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000');

const DocumentEditor = () => {
    const quillRef = useRef();
    const { docId } = useParams(); // Get docId from URL parameters

    useEffect(() => {
        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            placeholder: 'Start typing...',
        });

        // Join the document room
        socket.emit('joinDocument', docId);

        // Load initial document content
        socket.on('loadDocument', (content) => {
            quill.setContents(content);
        });

        // Update content when others edit
        socket.on('documentUpdated', (delta) => {
            quill.updateContents(delta);
        });

        // Emit changes on user edits
        quill.on('text-change', () => {
            const content = quill.getContents();
            socket.emit('editDocument', { docId, changes: content });
        });

        return () => {
            // Clean up socket listeners
            socket.off('loadDocument');
            socket.off('documentUpdated');
        };
    }, [docId]);

    return <div ref={quillRef} style={{ width: '50vw', height: '90vh' }} />;
};

export default DocumentEditor;
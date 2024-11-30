import { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const CreateDocument = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleCreateDocument = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/documents/create', {
                title,
                content
            }, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            setMessage(response.data.message);
            navigate('/documents')
        } catch (error) {
            console.error(error);
            setMessage('Error creating document');
        }
    };

    return (
        <div>
            <h2>Create New Document</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleCreateDocument}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">Create Document</button>
            </form>
        </div>
    );
};

export default CreateDocument;

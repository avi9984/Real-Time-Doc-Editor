import { useEffect, useState } from 'react';
import axios from '../api';


const AllDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        axios.get('/documents/all', {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(response => {
                setDocuments(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching documents:', error); // Log the error
                setError('Error fetching documents');
            });
    }, []);

    return (
        <div>
            <h2>All Documents</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <li key={doc._id}>
                            <a href={`/document/${doc._id}`}>
                                {doc.title}
                                {doc.content}
                            </a>
                        </li>
                    ))
                ) : (
                    <li>No documents available.</li>
                )}
            </ul>
        </div>
    );
};

export default AllDocuments;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApiData.css';

const ApiData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', body: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (post) => {
    setIsEditing(true);
    setCurrentPost(post);
  };

  const handleAddClick = () => {
    setIsEditing(true);
    setCurrentPost({ title: '', body: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPost.id) {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${currentPost.id}`, currentPost);
      setData(data.map(post => post.id === response.data.id ? response.data : post));
    } else {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', currentPost);
      setData([...data, response.data]);
    }
    setIsEditing(false);
    setCurrentPost({ title: '', body: '' });
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  return (
    <div className="container">
      <h1 className="title">Posts</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <input
            type="text"
            name="title"
            value={currentPost.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="input-field"
          />
          <textarea
            name="body"
            value={currentPost.body}
            onChange={handleInputChange}
            placeholder="Body"
            className="textarea-field"
          />
          <button type="submit" className="submit-button">Save</button>
          <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <button onClick={handleAddClick} className="add-button">Add New Post</button>
          <ul className="post-list">
            {data.map(post => (
              <li key={post.id} className="post-item">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-body">{post.body}</p>
                <button onClick={() => handleEditClick(post)} className="edit-button">Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ApiData;

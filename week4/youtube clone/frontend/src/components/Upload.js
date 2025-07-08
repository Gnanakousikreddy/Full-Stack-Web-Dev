import React, { useState , useEffect} from 'react';
import axios from '../axiosConfig'; // your configured Axios instance
import { useNavigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';

const Upload = ({theme}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('access');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !title || !thumbnail) {
      setError('Please fill all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video_file', videoFile);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post('/videos/upload/', formData);

      setSuccess('Video uploaded successfully!');
      setError('');

      // Optional: Redirect to Dashboard or Home
      setTimeout(() => {
        navigate('/dashboard'); // or '/'
      }, 1500);

    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <FormContainer theme={theme}>
      <h2 className="mb-4 text-center">Upload Video</h2>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Video Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thumbnail Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
          />
        </div>

        <button type="submit">Upload</button>
      </form>
    </FormContainer>
  );
};

export default Upload;

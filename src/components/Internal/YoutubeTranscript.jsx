import React, { useState } from 'react';
import axios from 'axios';

const YoutubeTranscriptGrabber = () => {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTranscript = async () => {
    setLoading(true);
    setError('');
    setTranscript('');

    try {
      const response = await axios.post('http://localhost:5000/transcript', { url });
      
      if (!response.data.success) {
        throw new Error(response.data.error);
      }

      setTranscript(response.data.transcript);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch transcript');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="youtube-transcript-container">
      <h2>YouTube Transcript Grabber</h2>
      <div className="input-section">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube Video URL"
          className="url-input"
        />
        <button 
          onClick={fetchTranscript}
          disabled={loading || !url}
          className="fetch-button"
        >
          {loading ? 'Loading...' : 'Get Transcript'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {transcript && (
        <div className="transcript-output">
          <h3>Transcript:</h3>
          <textarea
            value={transcript}
            readOnly
            className="transcript-text"
          />
        </div>
      )}
    </div>
  );
};

export default YoutubeTranscriptGrabber;

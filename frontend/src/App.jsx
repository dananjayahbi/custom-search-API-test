import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [urls, setUrls] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('/search', { query });
      setUrls(response.data.urls);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter search text"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <a href={url}>{url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

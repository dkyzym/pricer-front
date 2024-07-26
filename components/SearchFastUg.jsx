import { useState } from 'react';
import axios from 'axios';

export const SearchComponent = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/search-ug`, {
        params: {
          term,
          locale: 'ru_RU',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setResults(response.data.data);
        setMessage('Search successful');
      } else {
        setMessage('Search failed');
      }
    } catch (error) {
      setMessage('Search failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>FAST Search</h2>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleSearch}>Search</button>
      <p>{message}</p>
      {results.length > 0 && (
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              {item.brand} - {item.number} - {item.descr}
              <a href={item.url}>Details</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

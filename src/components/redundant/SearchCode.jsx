import { useState } from 'react';
import axios from 'axios';

export const SearchCode = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/search-code?code=${encodeURIComponent(code)}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        setMessage('Search successful');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.message);
      }
    }
  };

  return (
    <>
      <h2>Search Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
      <button onClick={handleSearch}>Search</button>
      <p>{message}</p>
      {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
    </>
  );
};

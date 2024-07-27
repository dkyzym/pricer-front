import { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

export const SearchComponent = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:3000/search-ug`, {
        params: {
          term: searchTerm,
          locale: 'ru_RU',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setResults(response.data.data);
        setMessage('Search successful');
      } else {
        setResults([]);
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Search failed: ' + error.message);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  const handleDeepSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/search-ug/deep?pcode=${term}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log(response.data);
        setHtmlContent(response.data.data);
      } else {
        setHtmlContent('');
      }
    } catch (error) {
      setMessage('Search failed: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    debouncedSearch(value);
  };

  const handleItemClick = (item) => {
    console.log(
      `Selected item: ${item.brand} - ${item.number} - ${item.descr}`
    );
  };

  return (
    <div>
      <h2>FAST Search</h2>
      <input
        type="text"
        value={term}
        onChange={handleInputChange}
        placeholder="Enter search term"
      />
      <button onClick={handleDeepSearch}>Fast search</button>
      <p>{message}</p>
      {results.length > 0 ? (
        <ul>
          {results.map((item, index) => (
            <li key={index} onClick={() => handleItemClick(item)}>
              {item.brand} - {item.number} - {item.descr}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

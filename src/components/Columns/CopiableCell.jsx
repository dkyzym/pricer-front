import { useState } from 'react';

export const CopiableCell = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (value) {
      navigator.clipboard
        .writeText(value.toString())
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 500);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      title="Кликните, чтобы скопировать"
    >
      {copied ? 'Скопировано' : value}
    </span>
  );
};

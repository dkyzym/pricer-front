import { useState } from 'react';

export const CopiableCell = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error('Ошибка при копировании в буфер обмена:', err);
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

import { useState } from 'react';

export const CopiableCell = ({ value }) => {
  const [copied, setCopied] = useState(false);

  // Функция-резерв для копирования через document.execCommand
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Делает textarea невидимой, чтобы не сдвигать макет страницы
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 500);
      } else {
        console.error('Fallback: Копирование не удалось.');
      }
    } catch (err) {
      console.error('Fallback: Ошибка копирования', err);
    }

    document.body.removeChild(textArea);
  };

  const handleClick = () => {
    if (!value) return;
    const text = value.toString();

    // Проверяем доступность современного API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 500);
        })
        .catch((err) => {
          console.error(
            'Ошибка использования clipboard API, пробуем fallback:',
            err
          );
          fallbackCopyTextToClipboard(text);
        });
    } else {
      fallbackCopyTextToClipboard(text);
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

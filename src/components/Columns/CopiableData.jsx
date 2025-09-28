import { Check, ContentCopy } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { forwardRef, useEffect, useRef, useState } from 'react';

export const CopiableCell = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = async (e) => {
    e.stopPropagation();

    if (!value && value !== 0) return;

    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Tooltip title={copied ? 'Скопировано!' : 'Кликните, чтобы скопировать'}>
      <span
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          display: 'inline-block',
        }}
      >
        {value}
      </span>
    </Tooltip>
  );
};

// Используем forwardRef для совместимости с MUI Tooltip
export const CopiableContent = forwardRef(({ value, children }, ref) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = async (e) => {
    e.stopPropagation();

    const textToCopy =
      value !== undefined ? String(value) : e.currentTarget.textContent;

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const icon = copied ? (
    <Check fontSize="small" />
  ) : (
    <ContentCopy fontSize="small" />
  );
  const tooltipContent =
    value !== undefined ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon}
        <span>{value}</span>
      </div>
    ) : (
      icon
    );

  return (
    <Tooltip title={tooltipContent} placement="top">
      <span
        ref={ref}
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          width: '100%',
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
});

// Добавляем displayName для отладки
CopiableContent.displayName = 'CopiableContent';

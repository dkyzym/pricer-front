import ClearIcon from '@mui/icons-material/Clear'; // Исправлено импорт ClearIcon
import { CircularProgress, IconButton, TextField } from '@mui/material';
import { memo } from 'react';

const AutocompleteInputComponent = ({
  params,
  inputRef,
  isAutocompleteLoading,
  inputValue,
  handleClearInput,
  hasOptions,
}) => (
  <TextField
    {...params}
    label="Введите запрос"
    variant="outlined"
    inputRef={inputRef}
    InputProps={{
      ...params.InputProps,
      autoComplete: 'off',
      endAdornment: (
        <>
          {isAutocompleteLoading && (
            <CircularProgress color="inherit" size={20} />
          )}
          {(inputValue || hasOptions) && (
            <IconButton
              onClick={handleClearInput}
              size="small"
              sx={{
                visibility: inputValue || hasOptions ? 'visible' : 'hidden',
              }}
            >
              <ClearIcon />
            </IconButton>
          )}
        </>
      ),
    }}
  />
);

AutocompleteInputComponent.displayName = 'AutocompleteInputComponent';

export const AutocompleteInput = memo(AutocompleteInputComponent);

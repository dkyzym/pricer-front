import { AutocompleteInput } from '@components/AutocompleteInput/AutocompleteInput';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
} from '@mui/material';
import { useMemo } from 'react';

export const SearchAutocompleteUI = ({
  inputValue,
  displayOptions,
  onInputChange,
  onChange,
  onKeyDown,
  getOptionLabel,
  getOptionKey,
  isClarifying,
  clarifyingArticle,
  onCancelClarification,
  inputRef,
  isAutocompleteLoading,
  onClearInput,
  showClearHistory,
  onClearHistory,
  isLoading,
  onBrandClarify,
}) => {
  const PaperWithFooter = useMemo(
    () =>
      function CustomPaper(paperProps) {
        return (
          <Paper {...paperProps}>
            {paperProps.children}
            {showClearHistory && (
              <Box
                sx={{
                  p: 0.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  fullWidth
                  size="small"
                  color="error"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onClearHistory}
                >
                  Очистить историю
                </Button>
              </Box>
            )}
          </Paper>
        );
      },
    [showClearHistory, onClearHistory]
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Autocomplete
        sx={{ flexGrow: 1 }}
        freeSolo
        inputValue={inputValue}
        options={displayOptions}
        filterOptions={(x) => x}
        groupBy={(option) => option.group}
        getOptionLabel={getOptionLabel}
        onInputChange={onInputChange}
        getOptionKey={getOptionKey}
        onChange={onChange}
        onKeyDown={onKeyDown}
        PaperComponent={PaperWithFooter}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.key}>
            {getOptionLabel(option)}
          </Box>
        )}
        renderInput={(params) => {
          const startAdornment =
            isClarifying && clarifyingArticle ? (
              <InputAdornment position="start">
                <Chip
                  size="small"
                  label={`Артикул: ${clarifyingArticle}`}
                  onDelete={onCancelClarification}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 0.5, fontWeight: 'medium' }}
                />
              </InputAdornment>
            ) : null;

          const mergedInputProps = {
            ...params.InputProps,
            startAdornment: (
              <>
                {startAdornment}
                {params.InputProps.startAdornment}
              </>
            ),
          };

          return (
            <AutocompleteInput
              params={{ ...params, InputProps: mergedInputProps }}
              inputRef={inputRef}
              isAutocompleteLoading={isAutocompleteLoading}
              inputValue={inputValue}
              hasOptions={Boolean(displayOptions.length)}
              handleClearInput={onClearInput}
              placeholder={
                isClarifying ? 'Введите бренд...' : 'Введите артикул...'
              }
            />
          );
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        onClick={onBrandClarify}
        disabled={!inputValue.trim() || isLoading || isClarifying}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        Уточнить бренд
      </Button>
    </Box>
  );
};

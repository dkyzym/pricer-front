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

/**
 * PaperComponent для Autocomplete: добавляет футер «Очистить историю».
 * onMouseDown preventDefault — чтобы Autocomplete не закрывался при клике по кнопке.
 */
const ClearHistoryPaper = ({ showClearHistory, onClearHistory, children, ...paperProps }) => (
  <Paper {...paperProps}>
    {children}
    {showClearHistory && (
      <Box sx={{ p: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
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

/**
 * Пропсы SearchAutocompleteUI. Соответствуют UseSearchAutocompleteReturn.
 * @typedef {Object} SearchAutocompleteUIProps
 * @property {string} inputValue
 * @property {Array<{group?: string, key?: string, brand?: string, number?: string, descr?: string}>} displayOptions
 * @property {function(React.SyntheticEvent, string): void} onInputChange
 * @property {function(React.SyntheticEvent, object|null): void} onChange
 * @property {function(React.KeyboardEvent): void} onKeyDown
 * @property {function(object): string} getOptionLabel
 * @property {function(object): string} getOptionKey
 * @property {boolean} isClarifying
 * @property {string} [clarifyingArticle]
 * @property {function(React.SyntheticEvent): void} onCancelClarification
 * @property {React.RefObject<HTMLInputElement|null>} inputRef
 * @property {boolean} isAutocompleteLoading
 * @property {function(): void} onClearInput
 * @property {boolean} showClearHistory
 * @property {function(): void} onClearHistory
 * @property {boolean} isLoading
 * @property {function(): void} onBrandClarify
 */

/**
 * UI поиска: Autocomplete (артикул/бренд) + кнопка «Уточнить бренд».
 * Фильтрация опций выполняется в buildDisplayOptions; filterOptions={(x) => x} отключает встроенный фильтр MUI.
 *
 * @param {SearchAutocompleteUIProps} props
 */
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
        PaperComponent={ClearHistoryPaper}
        componentsProps={{ paper: { showClearHistory, onClearHistory } }}
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

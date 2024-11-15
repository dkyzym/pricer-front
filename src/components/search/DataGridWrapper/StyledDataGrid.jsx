import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

const ODD_OPACITY = 0.2;

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // Существующие стили
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
      },
    },
  },
  // Дополнительные кастомные стили
  '& .bestPrice': {
    backgroundColor: '#d0f0c0',
  },
  '& .bestDeadline, & .bestDeliveryDate': {
    backgroundColor: '#c0d0f0',
  },
  '& .bestProbability': {
    backgroundColor: '#f0d0f0',
  },
  '& .highlightBrand': {
    backgroundColor: '#fff3cd',
  },
  // Новые стили для accountType
  '& .beznal-cell': {
    backgroundColor: '#ab22ab', // Светло-красный фон для beznal
    // Добавьте другие стили при необходимости
  },
  '& .nal-cell': {
    // backgroundColor: '#e8f5e9', // Светло-зеленый фон для nal
    // Добавьте другие стили при необходимости
  },
}));

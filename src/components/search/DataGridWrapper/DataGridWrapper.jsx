import { alpha, useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const DataGridWrapper = ({
  rows,
  columns,
  sortModel,
  setSortModel,
  customStyles,
}) => {
  const theme = useTheme();
  const ODD_OPACITY = 0.2;

  const commonRowStyles = {
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
  };

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
        }
        sx={{
          '& .Mui-even': {
            backgroundColor: theme.palette.grey[200],
            ...commonRowStyles,
          },
          '& .Mui-odd': {
            backgroundColor: theme.palette.background.default,
            ...commonRowStyles,
          },
          '& .highlightBrand': {
            backgroundColor: '#fff3cd',
          },
          '& .bestPrice': {
            backgroundColor: '#d0f0c0',
          },
          '& .bestDeadline, & .bestDeliveryDate': {
            backgroundColor: '#c0d0f0',
          },
          '& .bestProbability': {
            backgroundColor: '#f0d0f0',
          },
          '& .beznal-cell': {
            backgroundColor: '#ab22ab',
          },
          '& .nal-cell': {
            backgroundColor: '#fff',
          },
          ...customStyles,
        }}
        sortingOrder={['desc', 'asc']}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        ignoreValueFormatterDuringExport
        filterMode="client"
        disableSelectionOnClick
        autoHeight
        localeText={{ noRowsLabel: 'Тут пока ничего нет' }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              deadline: false,
            },
          },
        }}
      />
    </div>
  );
};

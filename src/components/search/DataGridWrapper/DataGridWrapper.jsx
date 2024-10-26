import { StyledDataGrid } from './StyledDataGrid';

export const DataGridWrapper = ({
  rows,
  columns,
  sortModel,
  setSortModel,
  customStyles,
}) => {
  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        sx={customStyles}
        sortingOrder={['desc', 'asc']}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        ignoreValueFormatterDuringExport
        filterMode="client"
        disableSelectionOnClick
        autoHeight
        localeText={{
          noRowsLabel: 'Тут пока ничего нет',
        }}
      />
    </div>
  );
};

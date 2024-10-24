import { DataGrid } from '@mui/x-data-grid';

export const DataGridWrapper = ({
  rows,
  columns,
  sortModel,
  setSortModel,
  customStyles,
}) => {
  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        getRowClassName={() => 'dataGridRow'}
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

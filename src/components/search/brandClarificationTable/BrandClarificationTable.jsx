import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

export const BrandClarificationTable = ({ items, onSelect }) => {
  return (
    <Paper style={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Варианты бренда</TableCell>

            <TableCell>Описание</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length > 0 &&
            items.map((item) => (
              <TableRow
                key={item.id}
                hover
                onClick={() => onSelect(item)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{item.brand}</TableCell>

                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

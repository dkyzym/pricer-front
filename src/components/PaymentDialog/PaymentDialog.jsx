// PaymentDialog.jsx

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';

export const PaymentDialog = ({ open, onClose, onSelect }) => {
  /**
   * open: boolean — отвечает за то, открыт диалог или нет
   * onClose: функция, которая закрывает диалог без выбора (если понадобится)
   * onSelect: функция, которая срабатывает, когда пользователь нажимает одну из кнопок
   *           в нее можно прокинуть любое значение, например true/false
   */

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6" textAlign="center">
          Безнал?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSelect(false)} color="primary">
          Да
        </Button>

        <Button onClick={() => onSelect(true)} color="primary" autoFocus>
          Наличный
        </Button>
      </DialogActions>
    </Dialog>
  );
};

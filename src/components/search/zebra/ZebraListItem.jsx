import { ListItem, styled } from '@mui/material';

export const ZebraListItem = styled(ListItem)(({ theme, 'data-own': own }) => ({
  backgroundColor:
    own === 'true'
      ? theme.palette.primary.light
      : theme.palette.background.paper,
  '&:nth-of-type(odd)': {
    backgroundColor:
      own === 'true' ? theme.palette.success.light : theme.palette.action.hover,
  },
}));

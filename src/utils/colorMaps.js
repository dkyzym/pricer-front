export function colorByLevel(level) {
  switch (level) {
    case 'error':
      return 'red';
    case 'warn':
      return 'orange';
    case 'info':
      return 'green';
    case 'debug':
      return 'gray';
    case 'http':
      return 'blue';
    default:
      return 'inherit';
  }
}

export function colorByUser(user) {
  switch (user) {
    case 'Den':
      return '#c2185b';
    case 'Julia':
      return '#7b1fa2';
    case 'Sergey':
      return '#0288d1';
    case '':
      return 'inherit';
    default:
      return 'inherit';
  }
}

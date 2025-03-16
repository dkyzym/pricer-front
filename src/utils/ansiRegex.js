const ansiRegex = new RegExp(
  [
    '[\\u001B\\u009B][[\\]()#;?]*',
    '(?:',
    '(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?',
    '[0-9A-ORZcf-nqry=><~]',
    ')',
  ].join(''),
  'g'
);

export function stripAnsi(str) {
  if (!str) return '';
  return str.replace(ansiRegex, '');
}

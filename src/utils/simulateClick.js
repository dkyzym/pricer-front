export const simulateClick = (element) => {
  if (!element) return;

  // mousedown
  const mouseDown = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(mouseDown);

  // mouseup
  const mouseUp = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(mouseUp);

  // click
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(clickEvent);
};

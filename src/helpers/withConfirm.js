export const withConfirm = (confirm, message, fn) => async (...args) => {
  const ok = await confirm(message);
  if (!ok) return;
  return fn(...args);
};
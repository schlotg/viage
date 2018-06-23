export function isCompatible(): boolean {
  const ua = window.navigator.userAgent;
  return (ua.indexOf('MSIE ') < 0 && ua.indexOf('Trident/') < 0);
}
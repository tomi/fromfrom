export function debounce(func: Function, wait: number, immediate = false) {
  if (immediate === void 0) {
    immediate = false;
  }
  let timeout: number | null;
  return function(this: any) {
    let context = this;
    let args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait) as any;
    if (callNow) func.apply(context, args);
  };
}

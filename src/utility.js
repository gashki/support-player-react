// Executes a function only after it has stopped being invoked
export const debounce = (fn, delay) => {
  let timeout;

  return function () {
    const fnCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(fnCall, delay);
  };
};

// Limits the execution of a function over a specified period
export const throttle = (fn, delay) => {
  let lastTime = 0;

  return function (...args) {
    const timeNow = Date.now();

    if (timeNow - lastTime < delay) return null;

    lastTime = timeNow;
    return fn(...args);
  };
};
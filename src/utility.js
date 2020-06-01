// Generates a unique ID for Firestore documents
export const generateDocId = (format) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let docId = "";

  // Appends random characters based on the given format
  for (let i = 0; i < format.length; i++) {
    let set = null;

    // Determines the current character set
    switch (format[i]) {
      case "L":
        set = letters;
        break;
      case "N":
        set = numbers;
        break;
      default:
        set = letters + numbers;
    }

    const index = Math.floor(Math.random() * set.length);
    docId += set[index];
  }

  return docId;
};

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
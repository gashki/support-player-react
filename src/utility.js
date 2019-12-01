// Generates a unique ID for Firestore documents
export const generateDocId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let docId = "";

  // Appends random characters from the given character set
  const appendChars = (set, num) => {
    for (let i = 0; i < num; i++) {
      let index = Math.floor(Math.random() * set.length);
      docId += set[index];
    }
  };

  // The character format for the document ID
  appendChars(letters, 2);
  appendChars(numbers, 3);
  appendChars(letters, 2);
  appendChars(numbers, 1);

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
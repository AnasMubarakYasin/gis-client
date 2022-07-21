import { useState } from "react";

export function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const global_store = new Map();

/**
 *
 * @param {string} key
 * @param {object} value
 * @returns {Array}
 */
export function useGlobal(key, value) {
  function read() {
    return global_store.get(key);
  }
  function write(value) {
    global_store.set(key, value);
  }
  return [read, write];
}

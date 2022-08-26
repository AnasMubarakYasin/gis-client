import { useState } from "react";

export function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const global_store = new Map();

/**
 * @param {string} key
 * @param {object} gen
 * @returns {Array}
 */
export function useGlobal(key, gen) {
  if (typeof gen == "function") {
    global_store.set(key, gen());
  }
  function read(clear) {
    const result = global_store.get(key);
    if (clear) {
      global_store.set(key, null);
    }
    return result;
  }
  function write(value) {
    global_store.set(key, value);
    return value;
  }
  return [read, write];
}

const event_sources = new Map();
function event_source_gen_mock() {
  return {
    id() {},
    data() {},
    re(url) {},
    open() {
      return Promise.resolve();
    },
    message(handler) {},
    close() {},
  };
}
function event_source_gen(url) {
  const handlers = [];
  let conn = new EventSource(url);
  let id = 0;
  let data;
  let resolver;
  let rejector;
  const promise = new Promise((res, rej) => {
    resolver = res;
    rejector = rej;
  });
  conn.addEventListener("open", onopen);
  conn.addEventListener("error", onerror);
  conn.addEventListener("message", onmessage);
  function onopen() {
    resolver();
  }
  function onerror(error) {
    rejector(error);
  }
  function onmessage(event) {
    id = event.lastEventId;
    data = JSON.parse(event.data);
    for (const handler of handlers) {
      handler(data, id);
    }
  }
  return {
    id() {
      return id;
    },
    data() {
      return data;
    },
    re(url) {
      this.close();
      setTimeout(() => {
        conn = undefined;
      }, 1000);
      return event_source_gen(url);
    },
    open() {
      return promise;
    },
    message(handler) {
      handlers.push(handler);
    },
    close() {
      conn.removeEventListener("open", onopen);
      conn.removeEventListener("error", onerror);
      conn.removeEventListener("message", onmessage);
      conn.close();
      event_sources.delete(url);
      console.log("closing event source");
    },
  };
}
/**
 * @param {string} url
 */
export function useEventSource(url, skip) {
  if (skip) {
    return event_source_gen_mock();
  }
  let instance;
  if (event_sources.has(url)) {
    instance = event_sources.get(url);
  } else {
    instance = event_source_gen(url);
    event_sources.set(url, instance);
  }
  return instance;
}

/*

# Purpose

1. `timeouted` wrapper that makes error catching possible.
2. Convert error-first callbacks for use by chrome API: `chromified`.
3. Add utils for safer coding: `mandatory`, `throwIfError`.

*/
const Utils = {

  mandatory() {

    throw new TypeError('Missing required argument. Be explicit if you swallow errors.');

  },

  throwIfError(err) {

    if (err) {
      throw err;
    }

  },

  checkChromeError() {

    // Chrome API calls your cb in a context different from the point of API
    // method invokation.
    const err = chrome.runtime.lastError || chrome.extension.lastError;
    if (!err) {
      return;
    }
    return new Error(err.message); // Add stack.

  },

  timeouted(cb = Utils.mandatory) {

    // setTimeout fixes error context, see https://crbug.com/357568
    return (...args) => setTimeout(() => cb(...args), 0);

  },

  chromified(cb = Utils.mandatory()) {

    // Take error first callback and convert it to chrome API callback.
    return function wrapper(...args) {

      const err = Utils.checkChromeError();
      Utils.timeouted(cb)(err, ...args);

    };

  },

  getOrDie(cb = Utils.mandatory()) {

    return Utils.chromified((err, ...args) => {

      if (err) {
        throw err;
      }
      cb(...args);

    });

  },

  assert(value = Utils.mandatory()) {

    if(!value) {
      throw new Error(`Assertion failed, value: ${value}`);
    }

  },

};

export default Utils;
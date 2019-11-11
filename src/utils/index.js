const debounce = function (action, idle) {
  let last;
  return (...args) => {
    clearTimeout(last);
    console.log("???", args)
    last = setTimeout(action, idle, ...args);
  };
};


const throttle = function (action, delay, ...args) {
  let last = 0;
  // 传的参数是类似requestAnimationFrame的TimeEvent
  return (event) => {
    let curr = event.timeStamp;
    if (curr - last > delay) {
      action(...args);
      last = curr;
    }
  };
};

export {
  debounce,
  throttle
}

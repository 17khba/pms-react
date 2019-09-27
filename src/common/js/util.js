/**
 * 添加新的条目至本地存储
 * @param {Str} opt 本地存储变量名
 * @param {*}   val 对应值
 */
export const setItem = (opt, val) => {
  const result = JSON.stringify(val);
  if (opt && result) {
    window.localStorage.setItem(opt, result);
    return;
  }

  console.warn(`setItem(${opt})：请检查传入的参数`);
};

/**
 * 获取本地存储对应的条目
 * @param {String} opt
 * @returns {*}
 */
export const getItem = opt => {
  let item;

  if (opt) {
    item = window.localStorage.getItem(opt);
    return item ? JSON.parse(item) : null;
  }

  console.warn(`getItem(${opt})：请检查传入的参数`);
};

export const getItemStr = opt => {
  let item;
  item = window.localStorage.getItem(opt);

  return item ? item : null;
};

/**
 * 删除本地存储对应条目
 * @param {String} opt
 */
export const removeItem = opt => {
  if (opt) {
    window.localStorage.removeItem(opt);
  }

  console.warn(`removeItem(${opt})：请检查传入的参数`);
};

// Cited and modified https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  return window.localStorage.setItem(name, content);
};

/**
    * Get localStorage
  */
export const getStore = (name) => {
  if (!name) return;
  return JSON.parse(window.localStorage.getItem(name));
};
/**
   * Clear localStorage
  */
export const removeItem = (name) => {
  if (!name) return;
  return window.localStorage.removeItem(name);
};


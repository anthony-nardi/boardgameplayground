export const isDebug = () =>
  window.localStorage && window.localStorage.getItem("DEBUG_TZAAR") === "true";

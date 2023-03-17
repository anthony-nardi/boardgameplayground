export const isDebugModeOn = () =>
  window.localStorage && window.localStorage.getItem("DEBUG_TZAAR") === "true";

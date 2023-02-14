export function hideSkipButton() {
  const skipButton = document.getElementById("skipTurnButton");

  if (skipButton) {
    skipButton.classList.add("hidden");
  }
}

export function showSkipButton() {
  const skipButton = document.getElementById("skipTurnButton");

  if (skipButton) {
    skipButton.classList.remove("hidden");
  }
}

export function showLoadingSpinner() {
  const loadingSpinnerComponent = document.getElementById("loadingSpinner");

  if (loadingSpinnerComponent) {
    loadingSpinnerComponent.classList.remove("hidden");
  }
}

export function hideLoadingSpinner() {
  const loadingSpinnerComponent = document.getElementById("loadingSpinner");

  if (loadingSpinnerComponent) {
    loadingSpinnerComponent.classList.add("hidden");
  }
}

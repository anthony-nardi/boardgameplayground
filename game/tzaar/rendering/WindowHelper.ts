type WindowHelperProps = {
  height: number;
  width: number;
};

class WindowHelper {
  width: number = 0;
  height: number = 0;
  useWindowHeight: boolean | undefined;
  devicePixelRatio: number = 1;
  setWidth() {
    this.width = window.innerWidth;
  }
  setHeight() {
    this.height = window.innerHeight;
  }
  setUseWindowHeight() {
    if (!window || !window.innerWidth) {
      throw Error("Window not available");
    }
    this.useWindowHeight = window.innerWidth > window.innerHeight;
  }
  setDevicePixelRatio() {
    if (!window || !window.devicePixelRatio) {
      throw Error("Window not available");
    }
    this.devicePixelRatio = window.devicePixelRatio;
  }
}

export default new WindowHelper();

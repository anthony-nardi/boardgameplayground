import { getBoardCoordinatesFromPixelCoordinates } from "../logic/gameBoardHelpers";

export function getPixelCoordinatesFromTouchInteraction(
  event: React.TouchEvent<HTMLCanvasElement>
) {
  const x = event.changedTouches[0].clientX;
  const y = event.changedTouches[0].clientY;
  return [x, y];
}

export function getPixelCoordinatesFromMouseInteraction(
  event: React.MouseEvent<HTMLCanvasElement>
) {
  const x = event.clientX;
  const y = event.clientY;
  return [x, y];
}

export function getPixelCoordinatesFromUserInteraction(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.TouchEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  if (
    event.type === "touchstart" ||
    event.type === "touchmove" ||
    event.type === "touchend"
  ) {
    return getPixelCoordinatesFromTouchInteraction(
      event as React.TouchEvent<HTMLCanvasElement>
    );
  }

  return getPixelCoordinatesFromMouseInteraction(
    event as React.MouseEvent<HTMLCanvasElement>
  );
}

export function getBoardCoordinatesFromUserInteraction(
  event:
    | React.MouseEvent<HTMLCanvasElement>
    | React.SyntheticEvent<HTMLCanvasElement>
) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  return getBoardCoordinatesFromPixelCoordinates(x, y);
}

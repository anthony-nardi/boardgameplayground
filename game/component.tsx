import { useRef, useEffect } from "react";
import {
  initGame,
  handleDropPiece,
  handleClickPiece,
  handleMovePiece,
} from "./gameLogic";
import WindowHelper from "./WindowHelper";
import gamePieceRenderer from "./GamePieceRenderer";
export default function () {
  const Canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    window.GAME_STATE_BOARD_CANVAS = Canvas.current;
    WindowHelper.setHeight();
    WindowHelper.setWidth();
    WindowHelper.setUseWindowHeight();
    WindowHelper.setDevicePixelRatio();
    // Canvas.current.style.width = `${WindowHelper.width}px`;
    // Canvas.current.style.height = `${WindowHelper.height}px`;
    debugger;
    gamePieceRenderer.init();
    initGame();
  }, [Canvas]);
  return (
    <>
      <canvas
        ref={Canvas}
        className="hidden"
        onMouseDown={handleClickPiece}
        onMouseMove={handleMovePiece}
        onMouseUp={handleDropPiece}
      />
    </>
  );
}

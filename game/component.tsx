import { useRef, useEffect } from "react";
import {
  initGame,
  handleDropPiece,
  handleClickPiece,
  handleMovePiece,
} from "./gameLogic";
import WindowHelper from "./WindowHelper";
import gamePieceRenderer from "./gamePieceRenderer";

export default function () {
  const Canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    window.GAME_STATE_BOARD_CANVAS = Canvas.current;
    WindowHelper.setHeight();
    WindowHelper.setWidth();
    WindowHelper.setUseWindowHeight();
    WindowHelper.setDevicePixelRatio();
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

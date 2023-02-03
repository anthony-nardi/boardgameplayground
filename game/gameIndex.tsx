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
      <div className="wrapper hidden" id="loadingSpinner">
        <div className="ajaxSpinner circles">
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
          <div className="dotWrapper">
            <div className="dot"></div>
          </div>
        </div>
      </div>
      <div className="stateContainer">
        <div id="turnDiv"></div>

        <div id="phaseDiv"></div>
      </div>
      <canvas
        ref={Canvas}
        onMouseDown={handleClickPiece}
        onMouseMove={handleMovePiece}
        onMouseUp={handleDropPiece}
      />
    </>
  );
}

import { useRef, useEffect, useState } from "react";
import {
  initGame,
  handleDropPiece,
  handleClickPiece,
  handleMovePiece,
  passTurn,
} from "./gameLogic";
import WindowHelper from "./WindowHelper";
import gamePieceRenderer from "./gamePieceRenderer";
import { Button } from "@mantine/core";


export default function () {
  const Canvas = useRef<HTMLCanvasElement | null>(null);
  const isGameInitializedRef = useRef(false)

  useEffect(() => {
    if (Canvas.current && !isGameInitializedRef.current) {

      if (window.localStorage.getItem("DEBUG_TZAAR") === "true") {
        console.log(`window.localStorage.getItem("DEBUG_TZAAR") is "true"`)
      } else {
        console.log(`window.localStorage.getItem("DEBUG_TZAAR") is "false"`)
      }

      isGameInitializedRef.current = true
      window.GAME_STATE_BOARD_CANVAS = Canvas.current;
      WindowHelper.setHeight();
      WindowHelper.setWidth();
      WindowHelper.setUseWindowHeight();
      WindowHelper.setDevicePixelRatio();
      gamePieceRenderer.init();
      initGame();
    }


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
        <Button
          color="gray"
          className="hidden"
          id="skipTurnButton"
          onClick={passTurn}
        >
          Pass
        </Button>
      </div>
      <canvas
        ref={Canvas}
        // @ts-expect-error fix
        onTouchStart={"ontouchstart" in document ? handleClickPiece : () => {}}
        // @ts-expect-error fix
        onTouchMove={"ontouchstart" in document ? handleMovePiece : () => {}}
        // @ts-expect-error fix
        onTouchEnd={"ontouchstart" in document ? handleDropPiece : () => {}}
        onMouseDown={"ontouchstart" in document ? () => {} : handleClickPiece}
        onMouseMove={"ontouchstart" in document ? () => {} : handleMovePiece}
        onMouseUp={"ontouchstart" in document ? () => {} : handleDropPiece}
      />
    </>
  );
}

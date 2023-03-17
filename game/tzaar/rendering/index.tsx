import { useRef, useEffect } from "react";
import { initGame } from "../logic/gameLogic";
import {
  handleDropPiece,
  handleClickPiece,
  handleMovePiece,
  handlePassTurn,
} from "../logic/EventHandlers";
import WindowHelper from "./WindowHelper";
import gamePieceRenderer, {promiseArray} from "./gamePieceRenderer";
import { Button } from "@mantine/core";



export default function () {
  const Canvas = useRef<HTMLCanvasElement | null>(null);
  const isGameInitializedRef = useRef(false);

  useEffect(() => {
    if (Canvas.current && !isGameInitializedRef.current) {
      if (window.localStorage.getItem("DEBUG_TZAAR") === "true") {
        console.log(`window.localStorage.getItem("DEBUG_TZAAR") is "true"`);
      } else {
        console.log(`window.localStorage.getItem("DEBUG_TZAAR") is "false"`);
      }
      Promise.all(promiseArray).then(() => {
        
        isGameInitializedRef.current = true;
        window.GAME_STATE_BOARD_CANVAS = Canvas.current;
        WindowHelper.setHeight();
        WindowHelper.setWidth();
        WindowHelper.setUseWindowHeight();
        WindowHelper.setDevicePixelRatio();
        gamePieceRenderer.init();
        initGame();
      });
    }
  }, [Canvas]);

  return (
    <>
      {/* <div className="hidden">
        <img id="blue_tott" src="blue_tott.png" width="100" height="100" />
        <img id="blue_tzaar" src="blue_tzaar.png" width="100" height="100" />
        <img id="blue_tzarra" src="blue_tzarra.png" width="100" height="100" />
        <img id="gold_tott" src="gold_tott.png" width="100" height="100" />
        <img id="gold_tzarra" src="gold_tzarra.png" width="100" height="100" />
        <img id="gold_tzaar" src="gold_tzaar.png" width="100" height="100" />
      </div> */}
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
          onClick={handlePassTurn}
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

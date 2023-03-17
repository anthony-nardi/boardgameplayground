import { useRef, useEffect, useCallback } from "react";
import { initGame } from "../logic/gameLogic";
import {
  handleDropPiece,
  handleClickPiece,
  handleMovePiece,
  handlePassTurn,
} from "../logic/EventHandlers";
import WindowHelper from "./WindowHelper";
import gamePieceRenderer, { promiseArray } from "./gamePieceRenderer";
import { Button, Badge } from "@mantine/core";

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

  const handleTouchStart = useCallback(
    (evt: React.SyntheticEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        handleClickPiece(evt);
      }
    },
    []
  );

  const handleTouchMove = useCallback(
    (evt: React.SyntheticEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        handleMovePiece(evt);
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (evt: React.SyntheticEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        handleDropPiece(evt);
      }
    },
    []
  );

  const handleMouseDown = useCallback(
    (evt: React.MouseEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        return;
      }
      handleClickPiece(evt);
    },
    []
  );

  const handleMouseUp = useCallback(
    (evt: React.MouseEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        return;
      }
      handleDropPiece(evt);
    },
    []
  );

  const handleMouseMove = useCallback(
    (evt: React.MouseEvent<HTMLCanvasElement>) => {
      if ("ontouchstart" in document) {
        return;
      }
      handleMovePiece(evt);
    },
    []
  );

  return (
    <div className="tzaar_background_color">
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
        <Badge>
          <div id="turnDiv"></div>
        </Badge>
        <Badge ml="xs">
          {" "}
          <div id="phaseDiv"></div>
        </Badge>
        <Button
          compact
          ml="xs"
          color="gray"
          className="hidden"
          id="skipTurnButton"
          onClick={handlePassTurn}
        >
          Pass turn
        </Button>
      </div>
      <canvas
        ref={Canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

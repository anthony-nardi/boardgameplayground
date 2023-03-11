import { TOTT, PLAYER_ONE, PLAYER_TWO, TZAAR, TZARRA } from "./constants";
import WindowHelper from "./WindowHelper";
import { RecordOf } from "immutable";

export const DEBUG = false;
export const NUMBER_OF_ROWS = 8;
export const NUMBER_OF_COLS = 8;

class GamePieceRenderer {
  init() {
    const extraSpace = 1;
    this.TRIANGLE_SIDE_LENGTH =
      (WindowHelper.useWindowHeight
        ? WindowHelper.height
        : WindowHelper.width) /
      (NUMBER_OF_COLS + extraSpace);
    this.TRIANGLE_HEIGHT = this.TRIANGLE_SIDE_LENGTH * (Math.sqrt(3) / 2);
    const isMobile = "ontouchstart" in document.documentElement;
    this.GAME_PIECE_RADIUS = isMobile
      ? this.TRIANGLE_HEIGHT / 1.75
      : this.TRIANGLE_HEIGHT / 2.5;

    this.CANVAS_SIDE_LENGTH =
      this.GAME_PIECE_RADIUS * WindowHelper.devicePixelRatio * 2;
    this.CANVAS_STYLE_LENGTH = `${this.GAME_PIECE_RADIUS * 2}px`;

    this.PLAYER_ONE_TOTT.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TOTT.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TOTT.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TOTT.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TZARRA.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZARRA.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZARRA.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TZARRA.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TZAAR.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZAAR.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZAAR.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TZAAR.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TZARRA.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZARRA.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZARRA.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TZARRA.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TOTT.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TOTT.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TOTT.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TOTT.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TZAAR.width = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZAAR.height = this.CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZAAR.style.width = this.CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TZAAR.style.height = this.CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TOTT.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );
    this.PLAYER_ONE_TZARRA.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );
    this.PLAYER_ONE_TZAAR.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );

    this.PLAYER_TWO_TOTT.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );
    this.PLAYER_TWO_TZARRA.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );
    this.PLAYER_TWO_TZAAR.getContext("2d")?.setTransform(
      WindowHelper.devicePixelRatio,
      0,
      0,
      WindowHelper.devicePixelRatio,
      0,
      0
    );

    const playerOneTott = {
      type: TOTT,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    };
    const playerOneTzarra = {
      type: TZARRA,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    };
    const playerOneTzaar = {
      type: TZAAR,
      ownedBy: PLAYER_ONE,
      stackSize: 1,
      isDragging: false,
    };

    const playerTwoTott = {
      type: TOTT,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    };
    const playerTwoTzarra = {
      type: TZARRA,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    };
    const playerTwoTzaar = {
      type: TZAAR,
      ownedBy: PLAYER_TWO,
      stackSize: 1,
      isDragging: false,
    };

    this.circleRadius = this.GAME_PIECE_RADIUS;
    this.smallerCircleRadius = this.GAME_PIECE_RADIUS / 2;

    this.drawGamePiece(playerOneTott, this.PLAYER_ONE_TOTT);
    this.drawGamePiece(playerOneTzarra, this.PLAYER_ONE_TZARRA);
    this.drawGamePiece(playerOneTzaar, this.PLAYER_ONE_TZAAR);
    this.drawGamePiece(playerTwoTott, this.PLAYER_TWO_TOTT);
    this.drawGamePiece(playerTwoTzarra, this.PLAYER_TWO_TZARRA);
    this.drawGamePiece(playerTwoTzaar, this.PLAYER_TWO_TZAAR);
  }
  TRIANGLE_SIDE_LENGTH: null | number = null;

  GAME_PIECE_RADIUS: null | number = null;
  TRIANGLE_HEIGHT: null | number = null;
  PLAYER_ONE_TOTT = document.createElement("canvas");
  PLAYER_ONE_TZARRA = document.createElement("canvas");
  PLAYER_ONE_TZAAR = document.createElement("canvas");
  PLAYER_TWO_TOTT = document.createElement("canvas");
  PLAYER_TWO_TZARRA = document.createElement("canvas");
  PLAYER_TWO_TZAAR = document.createElement("canvas");

  circleRadius: null | number = null;
  smallerCircleRadius: null | number = null;
  CANVAS_SIDE_LENGTH: null | number = null;
  CANVAS_STYLE_LENGTH: null | string = null;
  CENTER_COLOR = "#FDD835";
  PLAYER_ONE_COLOR_BG = "#1E88E5";
  PLAYER_TWO_COLOR_BG = "#212121";

  drawStar(
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    ctx: CanvasRenderingContext2D,
    centerColor: string
  ) {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (var i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.fillStyle = centerColor;
    ctx.fill();
  }

  drawGamePiece(gamePiece: any, canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("context not ready.");
    }

    if (!this.circleRadius || !this.smallerCircleRadius) {
      throw new Error("circle radius isnt ready");
    }

    if (gamePiece.ownedBy === PLAYER_ONE) {
      context.fillStyle = this.PLAYER_ONE_COLOR_BG;
      context.beginPath();
      context.arc(
        this.circleRadius,
        this.circleRadius,
        this.circleRadius - 2,
        0,
        2 * Math.PI
      );
      context.fill();
    } else {
      context.fillStyle = this.PLAYER_TWO_COLOR_BG;
      context.beginPath();
      context.arc(
        this.circleRadius,
        this.circleRadius,
        this.circleRadius - 2,
        0,
        2 * Math.PI
      );
      context.fill();
    }

    if (gamePiece.type === TZAAR) {
      context.fillStyle = this.CENTER_COLOR;
      context.beginPath();
      this.drawStar(
        this.circleRadius,
        this.circleRadius,
        4,
        this.circleRadius / 2,
        this.circleRadius / 4,
        context,
        this.CENTER_COLOR
      );

      context.fill();
    } else if (gamePiece.type === TZARRA) {
      context.strokeStyle = this.CENTER_COLOR;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(
        this.circleRadius,
        this.circleRadius,
        this.smallerCircleRadius,
        0,
        2 * Math.PI
      );
      context.stroke();
    }
  }
}

export default new GamePieceRenderer();

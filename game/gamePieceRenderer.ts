import {
  TRIANGLE_HEIGHT,
  TOTT,
  PLAYER_ONE,
  PLAYER_TWO,
  TZAAR,
  TZARRA,
  PIXEL_RATIO,
  GamePieceRecord
} from "./constants";

class GamePieceRenderer {
  init() {
    const isMobile = "ontouchstart" in document.documentElement;
    const GAME_PIECE_RADIUS = isMobile ? TRIANGLE_HEIGHT / 1.75 : TRIANGLE_HEIGHT / 2.5;
    const CANVAS_SIDE_LENGTH = GAME_PIECE_RADIUS * PIXEL_RATIO() * 2;
    const CANVAS_STYLE_LENGTH = `${GAME_PIECE_RADIUS * 2}px`;

    this.PLAYER_ONE_TOTT.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TOTT.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TOTT.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TOTT.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TZARRA.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZARRA.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZARRA.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TZARRA.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TZAAR.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZAAR.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_ONE_TZAAR.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_ONE_TZAAR.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TZARRA.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZARRA.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZARRA.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TZARRA.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TOTT.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TOTT.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TOTT.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TOTT.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_TWO_TZAAR.width = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZAAR.height = CANVAS_SIDE_LENGTH;
    this.PLAYER_TWO_TZAAR.style.width = CANVAS_STYLE_LENGTH;
    this.PLAYER_TWO_TZAAR.style.height = CANVAS_STYLE_LENGTH;

    this.PLAYER_ONE_TOTT.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );
    this.PLAYER_ONE_TZARRA.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );
    this.PLAYER_ONE_TZAAR.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );

    this.PLAYER_TWO_TOTT.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );
    this.PLAYER_TWO_TZARRA.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );
    this.PLAYER_TWO_TZAAR.getContext("2d").setTransform(
      PIXEL_RATIO(),
      0,
      0,
      PIXEL_RATIO(),
      0,
      0
    );

    const playerOneTott = new GamePieceRecord({
      type: TOTT,
      ownedBy: PLAYER_ONE
    });
    const playerOneTzarra = new GamePieceRecord({
      type: TZARRA,
      ownedBy: PLAYER_ONE
    });
    const playerOneTzaar = new GamePieceRecord({
      type: TZAAR,
      ownedBy: PLAYER_ONE
    });

    const playerTwoTott = new GamePieceRecord({
      type: TOTT,
      ownedBy: PLAYER_TWO
    });
    const playerTwoTzarra = new GamePieceRecord({
      type: TZARRA,
      ownedBy: PLAYER_TWO
    });
    const playerTwoTzaar = new GamePieceRecord({
      type: TZAAR,
      ownedBy: PLAYER_TWO
    });

    this.circleRadius = GAME_PIECE_RADIUS;
    this.smallerCircleRadius = GAME_PIECE_RADIUS / 2;

    this.drawGamePiece(playerOneTott, PLAYER_ONE_TOTT);
    this.drawGamePiece(playerOneTzarra, PLAYER_ONE_TZARRA);
    this.drawGamePiece(playerOneTzaar, PLAYER_ONE_TZAAR);
    this.drawGamePiece(playerTwoTott, PLAYER_TWO_TOTT);
    this.drawGamePiece(playerTwoTzarra, PLAYER_TWO_TZARRA);
    this.drawGamePiece(playerTwoTzaar, PLAYER_TWO_TZAAR);

  }


  PLAYER_ONE_TOTT = document.createElement("canvas");
  PLAYER_ONE_TZARRA = document.createElement("canvas");
  PLAYER_ONE_TZAAR = document.createElement("canvas");
  PLAYER_TWO_TOTT = document.createElement("canvas");
  PLAYER_TWO_TZARRA = document.createElement("canvas");
  PLAYER_TWO_TZAAR = document.createElement("canvas");

  circleRadius = null
  smallerCircleRadius = null;

  CENTER_COLOR = "#FDD835";
  PLAYER_ONE_COLOR_BG = "#1E88E5";
  PLAYER_TWO_COLOR_BG = "#212121";

  drawStar(cx, cy, spikes, outerRadius, innerRadius, ctx, centerColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (var i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.fillStyle = centerColor;
    ctx.fill();
  }


  drawGamePiece(gamePiece, canvas) {
    const context = canvas.getContext("2d");
    if (gamePiece.ownedBy === PLAYER_ONE) {
      context.fillStyle = this.PLAYER_ONE_COLOR_BG;
      context.beginPath();
      context.arc(circleRadius, circleRadius, circleRadius - 2, 0, 2 * Math.PI);
      context.fill();
    } else {
      context.fillStyle = PLAYER_TWO_COLOR_BG;
      context.beginPath();
      context.arc(circleRadius, circleRadius, circleRadius - 2, 0, 2 * Math.PI);
      context.fill();
    }

    if (gamePiece.type === TZAAR) {
      context.fillStyle = CENTER_COLOR;
      context.beginPath();
      drawStar(circleRadius, circleRadius, 4, circleRadius / 2, circleRadius / 4, context, CENTER_COLOR);

      context.fill();
    } else if (gamePiece.type === TZARRA) {
      context.strokeStyle = CENTER_COLOR;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(
        circleRadius,
        circleRadius,
        smallerCircleRadius,
        0,
        2 * Math.PI
      );
      context.stroke();
    }


  }


export default new GamePieceRenderer()
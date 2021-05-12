"use strict";

var BoardList = function BoardList(props) {
  // if (props.boards.length === 0) {
  if (!props.boards) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Boards yet"));
  } // console.log(pieces);


  var boardNodes = props.boards.map(function (board) {
    var canvasRef = useRef(null); // = document.createElement('canvas');

    useEffect(function () {
      function renderCanvas() {
        var canv = canvasRef.current;
        var W = document.documentElement.clientWidth / 5,
            H = W;
        canv.width = W;
        canv.height = H;
        var ctx = canv.getContext('2d');
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, W, H);
        drawBoard(W / 8, ctx); // let b = board.board[0];

        var b = JSON.parse(board.board);

        for (var j = 0; j < b.length; j++) {
          var c = b[j].color === 'white' ? 0 : 1;
          drawPiece(b[j].type, c, b[j].col - 1, b[j].row - 1, ctx, W / 8);
        }
      }

      renderCanvas();
      window.addEventListener('resize', renderCanvas);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      key: board._id,
      className: "board"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "boardName"
    }, " Name: ", board.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "boardDisplay"
    }, " ", /*#__PURE__*/React.createElement("canvas", {
      ref: canvasRef
    }), " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "boardList"
  }, boardNodes);
};

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
      boards: data.boards
    }), document.querySelector("#boards"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
    domos: []
  }), document.querySelector("#boards"));
  loadBoardsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// Get React Methods
var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    useRef = _React.useRef; // Load in pieces image for piece rendering

var pieces = new Image();
pieces.src = "/assets/img/pieces.png";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var drawBoard = function drawBoard(size, ctx) {
  // console.log("drawBoard called");
  ctx.fillStyle = "white";
  var bit = false;

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (j % 2 == bit) ctx.fillRect(size * i, size * j, size, size);
    }

    bit = !bit;
  }
}; // color -> 0 is white, 1 is black


var drawPiece = function drawPiece(type, color, x, y, context, S) {
  var imgW = pieces.width;
  var imgH = pieces.height;

  switch (type) {
    case "k":
      context.drawImage(pieces, 0, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "q":
      context.drawImage(pieces, imgW / 6 * 1, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "b":
      context.drawImage(pieces, imgW / 6 * 2, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "n":
      context.drawImage(pieces, imgW / 6 * 3, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "r":
      context.drawImage(pieces, imgW / 6 * 4, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "p":
      context.drawImage(pieces, imgW / 6 * 5, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    default:
      // Board at location is empty
      break;
  }
};

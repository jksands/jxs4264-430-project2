"use strict";

// Load images
var delImg = new Image();
delImg.src = "/assets/img/del.png";
var clearImg = new Image();
clearImg.src = "/assets/img/clear.png"; // contexts

var ctx;
var bctx; // width and height

var W;
var H; // init board

var board = new Array(8); // set default variabls

var fps = 60;
var activePiece = 'p';
var activeColor = 0; // Stores mouse info

var mouseX = 0;
var mouseY = 0; // Stores rects for the GUI

var rects; // inits the board

for (var i = 0; i < 8; i++) {
  board[i] = new Array(8).fill(' ');
}

var handleBoard = function handleBoard(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadBoardsFromServer();
  });
  return false;
};

var BoardForm = function BoardForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleBoard,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Board: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "board",
    placeholder: "Board"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Board"
  }));
};

var BoardList = function BoardList(props) {
  var canvasRef = useRef(null); // main board canvas

  var buttonCanvasRef = useRef(null); // sideways button canvas

  useEffect(function () {
    function renderCanvas() {
      // Main canvas
      var canvas = canvasRef.current; // Add Event for clicking on canvas

      canvas.addEventListener('mousedown', function (e) {
        getCursorPosition(canvas, e);
      }); // add event for moving mouse over canvas

      canvas.addEventListener('mousemove', function (e) {
        mouseX = e.x;
        mouseY = e.y;
      }); // canvas context

      ctx = canvas.getContext('2d'); // Button canvas

      var buttonsCanvas = buttonCanvasRef.current; // add events to GUI canvas

      buttonsCanvas.addEventListener('mousedown', function (e) {
        checkBoxCollisions(buttonsCanvas, e);
      });
      bctx = buttonsCanvas.getContext('2d');
      var S = W / 16;
      var O = W / 8; // Define the rectangles of the GUI

      rects = [{
        type: "k",
        x: 1 * S,
        y: 1 * S + O
      }, {
        type: "q",
        x: 2 * S + O,
        y: 1 * S + O
      }, {
        type: "r",
        x: 1 * S,
        y: S + 2 * O
      }, {
        type: "b",
        x: 2 * S + O,
        y: S + 2 * O
      }, {
        type: "n",
        x: 1 * S,
        y: S + 3 * O
      }, {
        type: "p",
        x: 2 * S + O,
        y: S + 3 * O
      }, {
        type: "0",
        x: 1 * S,
        y: S + 4 * O
      }, {
        type: "1",
        x: 2 * S + O,
        y: S + 4 * O
      }, {
        type: "d",
        x: 1 * S,
        y: S + 5 * O
      }, {
        type: "c",
        x: 2 * S + O,
        y: S + 5 * O
      }];
      W = document.documentElement.clientHeight / 1.4 < document.documentElement.clientWidth / 2 ? document.documentElement.clientHeight / 1.4 : document.documentElement.clientWidth / 2;
      H = W;
      canvas.width = W;
      canvas.height = H;
      buttonsCanvas.width = W / 2;
      buttonsCanvas.height = H; // Draw the button GUI

      drawButtons();
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, W, H);
      drawBoard(W / 8, ctx);
    }

    renderCanvas();
    window.addEventListener('resize', renderCanvas); // Draws the buttons GUI

    function drawButtons() {
      bctx.fillStyle = "lightgray";
      bctx.fillRect(0, 0, W / 2, H); // iterates through all the rects and draws them

      for (var _i = 0; _i < rects.length; _i++) {
        if (Number(rects[_i].type) >= 0) {
          bctx.fillStyle = Number(rects[_i].type) === 0 ? "white" : "black";
          bctx.fillRect(rects[_i].x, rects[_i].y, W / 8, W / 8);
        } else {
          drawSavePiece(rects[_i].type, activeColor, rects[_i].x, rects[_i].y, bctx, W / 8);
        }
      }
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    key: board._id,
    className: "saveDiv"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "saveBoard"
  }, " ", /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef
  }), " "), /*#__PURE__*/React.createElement("h3", {
    className: "saveButtons"
  }, " ", /*#__PURE__*/React.createElement("canvas", {
    ref: buttonCanvasRef
  }), " "));
  return /*#__PURE__*/React.createElement("div", {
    className: "boardList"
  }, boardNodes);
}; // color -> 0 is white, 1 is black


function drawSavePiece(type, color, x, y, context, S) {
  var imgW = pieces.width;
  var imgH = pieces.height;

  switch (type) {
    case "k":
      context.drawImage(pieces, 0, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "q":
      context.drawImage(pieces, imgW / 6 * 1, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "b":
      context.drawImage(pieces, imgW / 6 * 2, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "n":
      context.drawImage(pieces, imgW / 6 * 3, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "r":
      context.drawImage(pieces, imgW / 6 * 4, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "p":
      context.drawImage(pieces, imgW / 6 * 5, color * pieces.height / 2, imgW / 6, imgW / 6, x, y, S, S);
      break;

    case "d":
      context.drawImage(delImg, 0, 0, delImg.width, delImg.height, x, y, S, S);
      break;

    case "c":
      context.drawImage(clearImg, 0, 0, clearImg.width, clearImg.height, x, y, S, S);
      break;

    default:
      // Board at location is empty
      break;
  }
} // Checks mouse collision with GUI rects


function checkBoxCollisions(canv, event) {
  // Get mouse x and y
  var rect = canv.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top; // AABB

  for (var _i2 = 0; _i2 < rects.length; _i2++) {
    var r = rects[_i2];

    if (x > r.x && x < r.x + 100 && y > r.y && y < r.y + 100) {
      if (Number(r.type) >= 0) {
        activeColor = Number(r.type);
      } else if (r.type === 'd') {
        activePiece = ' ';
      } else if (r.type === 'c') {
        resetBoard();
      } else {
        activePiece = r.type;
      }
    }
  }
}

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
      boards: data.boards
    }), document.querySelector("#saveBoards"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
    domos: []
  }), document.querySelector("#saveBoards")); // loadBoardsFromServer();
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

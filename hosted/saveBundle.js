"use strict";

// THIS WILL HANDLE RENDERING THAT SAVING PAGE
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
  // if (props.boards.length === 0) {
  if (!props.boards) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Boards yet"));
  }

  var domoNodes = props.boards.map(function (board) {
    var canvas = React.useRef(null);
    canvas.current = document.createElement('canvas');
    var canv = canvas.current;
    console.log("TEST"); // canv.myRef = React.createRef();

    var ctx = canv.getContext('2d');
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, 100, 100);
    return /*#__PURE__*/React.createElement("div", {
      key: board._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, " Test: ", board.name, " "), /*#__PURE__*/React.createElement("canvas", {
      ref: canvas
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
}; // color -> 0 is white, 1 is black


function drawPiece(type, color, x, y, ctx) {
  switch (type) {
    case "k":
      ctx.drawImage(pieces, 0, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "q":
      ctx.drawImage(pieces, imgW / 6 * 1, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "b":
      ctx.drawImage(pieces, imgW / 6 * 2, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "n":
      ctx.drawImage(pieces, imgW / 6 * 3, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "r":
      ctx.drawImage(pieces, imgW / 6 * 4, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    case "p":
      ctx.drawImage(pieces, imgW / 6 * 5, color * pieces.height / 2, imgW / 6, imgW / 6, x * S, y * S, S, S);
      break;

    default:
      // Board at location is empty
      break;
  }
}

function drawBoard(size, ctx) {
  // console.log("drawBoard called");
  ctx.fillStyle = "white";
  var bit = false;

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (j % 2 == bit) ctx.fillRect(size * i, size * j, size, size);
    }

    bit = !bit;
  }
}

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
      boards: data.boards
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
    domos: []
  }), document.querySelector("#domos"));
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

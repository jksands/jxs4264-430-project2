"use strict";

// import {useRef} from '@babel/preset-react'
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
    return /*#__PURE__*/React.createElement("div", {
      key: board._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/chess.png",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, " Name: ", board.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, " Board: ", JSON.stringify(board.board), " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(BoardList, {
      boards: data.boards
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
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

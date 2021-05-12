// Get React Methods
let {useState,useEffect, useRef} = React;
// Load in pieces image for piece rendering
let pieces = new Image();
pieces.src =  "/assets/img/pieces.png";

const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width: 'toggle'}, 350);
};

const redirect = (response) => {
    $("domoMessage").animate({width: 'hide'}, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
const drawBoard = (size, ctx) => {
  // console.log("drawBoard called");
  ctx.fillStyle = "white";
  let bit = false;
  for (let i = 0; i < 8; i++)
  {
    for (let j = 0; j < 8; j++)
    {
      if (j % 2 == bit) ctx.fillRect(size * i, size * j, size, size);
    }
    bit = !bit;
  }
}

    // color -> 0 is white, 1 is black
const drawPiece = (type, color, x, y, context, S) => {
    let imgW = pieces.width;
    let imgH = pieces.height;
    switch (type)
    {
    case "k": 
        context.drawImage(pieces, 0, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    case "q": 
        context.drawImage(pieces, imgW/6 * 1, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    case "b": 
        context.drawImage(pieces, imgW/6 * 2, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    case "n": 
        context.drawImage(pieces, imgW/6 * 3, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    case "r": 
        context.drawImage(pieces, imgW/6 * 4, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    case "p": 
        context.drawImage(pieces, imgW/ 6 * 5, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
        break;
    default: // Board at location is empty
        break;
    }
}
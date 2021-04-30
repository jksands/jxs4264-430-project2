// THIS WILL HANDLE RENDERING THAT SAVING PAGE

const handleBoard = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadBoardsFromServer();
    });

    return false;
};

const BoardForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleBoard}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Name"/>
            <label htmlFor="age">Board: </label>
            <input id="domoAge" type="text" name="board" placeholder="Board"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Board" />
        </form>
    );
};

const BoardList = function (props) {
    
    // if (props.boards.length === 0) {
    if (!props.boards) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Boards yet</h3>
            </div>
        );
    }

    const domoNodes = props.boards.map(function(board) {
        let canvas = React.useRef(null);
        canvas.current = document.createElement('canvas');
        let canv = canvas.current;
        console.log("TEST");
        // canv.myRef = React.createRef();
        let ctx = canv.getContext('2d');
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, 100, 100);
        return (
            (<div key={board._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Test: {board.name} </h3>
        <canvas ref={canvas}></canvas>
        {/* <h3 className="domoAge"> Board: {JSON.stringify(board.board)} </h3> */}
            </div>)
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};
// color -> 0 is white, 1 is black
function drawPiece(type, color, x, y, ctx)
{
  switch (type)
  {
    case "k": 
      ctx.drawImage(pieces, 0, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    case "q": 
      ctx.drawImage(pieces, imgW/6 * 1, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    case "b": 
      ctx.drawImage(pieces, imgW/6 * 2, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    case "n": 
      ctx.drawImage(pieces, imgW/6 * 3, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    case "r": 
      ctx.drawImage(pieces, imgW/6 * 4, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    case "p": 
      ctx.drawImage(pieces, imgW/ 6 * 5, color * pieces.height / 2, imgW/6,imgW / 6, x * S, y * S,S,S);
      break;
    default: // Board at location is empty
      break;

  }
  
}
function drawBoard(size, ctx)
{
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

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <BoardForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <BoardList domos={[]} />, document.querySelector("#domos")
    );

    loadBoardsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};


$(document).ready(function() {
    getToken();
});
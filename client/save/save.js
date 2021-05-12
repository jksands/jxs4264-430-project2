// Load images
let delImg = new Image();
delImg.src = "/assets/img/del.png";
let clearImg = new Image();
clearImg.src = "/assets/img/clear.png";
// contexts
let ctx;
let bctx;

// width and height
let W; 
let H;

// init board
let board = new Array(8);

// set default variabls
let fps = 60;
let activePiece = 'p';
let activeColor = 0;
// Stores mouse info
let mouseX = 0;
let mouseY = 0;
// Stores rects for the GUI
let rects;

// inits the board
for (let i = 0; i < 8; i++) {
  board[i] = (new Array(8).fill(' '));
}

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
        let canvasRef = useRef(null); // main board canvas
        let buttonCanvasRef = useRef(null); // sideways button canvas
        useEffect(()=>{
            function renderCanvas() {
                // Main canvas
                let canvas = canvasRef.current;
                // Add Event for clicking on canvas
                canvas.addEventListener('mousedown', function (e) {
                  getCursorPosition(canvas, e);
                });
                // add event for moving mouse over canvas
                canvas.addEventListener('mousemove', function (e) {
                  mouseX = e.x;
                  mouseY = e.y;
                });
                // canvas context
                ctx = canvas.getContext('2d');

                // Button canvas
                let buttonsCanvas = buttonCanvasRef.current; 
                // add events to GUI canvas
                buttonsCanvas.addEventListener('mousedown', function (e) {
                  checkBoxCollisions(buttonsCanvas, e);
                });
          
                bctx = buttonsCanvas.getContext('2d');
                let S = W / 16;
                let O = W / 8
                // Define the rectangles of the GUI
                rects = [
                    { type: "k", x: 1 * S, y: 1 * S + O},
                    { type: "q", x: 2 * S + O, y: 1 * S + O },
                    { type: "r", x: 1 * S, y:  S + 2 * O },
                    { type: "b", x: 2 * S + O, y: S + 2 * O  },
                    { type: "n", x: 1 * S, y: S + 3 * O   },
                    { type: "p", x: 2 * S + O, y: S + 3 * O   },
                    { type: "0", x: 1 * S, y: S + 4 * O   },
                    { type: "1", x: 2 * S + O, y: S + 4 * O   },
                    { type: "d", x: 1 * S, y: S + 5 * O   },
                    { type: "c", x: 2 * S + O, y: S + 5 * O   }
                ];
                W = document.documentElement.clientHeight / 1.4 < document.documentElement.clientWidth / 2 ?
                document.documentElement.clientHeight / 1.4 : document.documentElement.clientWidth / 2;
                H = W;
                canvas.width = W;
                canvas.height = H;
                buttonsCanvas.width = W / 2;
                buttonsCanvas.height = H;
                // Draw the button GUI
                drawButtons();
                ctx.fillStyle = 'gray';
                ctx.fillRect(0,0,W,H);
                drawBoard(W / 8, ctx);
        }
        renderCanvas();
        window.addEventListener('resize', renderCanvas);

        // Draws the buttons GUI
        function drawButtons() {
            bctx.fillStyle = "lightgray";
            bctx.fillRect(0, 0, W /2, H);
            // iterates through all the rects and draws them
            for (let i = 0; i < rects.length; i++) {
                if (Number(rects[i].type) >= 0) {
                    bctx.fillStyle = ((Number(rects[i].type) === 0) ? "white" : "black");
                    bctx.fillRect(rects[i].x, rects[i].y, W/8, W/8);
                }
                else {
                    drawSavePiece(rects[i].type, activeColor, rects[i].x, rects[i].y, bctx, W/8);
                }
            }
        }

        }, []);
        return (
            (<div key={board._id} className="saveDiv">
        {/* <img src="/assets/img/chess.png" alt="domo face" className="domoFace" /> */}
        <h3 className="saveBoard"> <canvas ref={canvasRef}></canvas> </h3>
        <h3 className="saveButtons"> <canvas ref={buttonCanvasRef}></canvas> </h3>
        {/* <img src={test} alt="Pieces"/> */}
        {/* <h3 className="domoAge"> Board: {JSON.stringify(board.board)} </h3> */}
            </div>)
        );

    return (
        <div className="boardList">
            {boardNodes}
        </div>
    );
};

// color -> 0 is white, 1 is black
function drawSavePiece(type, color, x, y, context, S) {
    let imgW = pieces.width;
    let imgH = pieces.height;
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
      default: // Board at location is empty
        break;

    }

  }
  // Checks mouse collision with GUI rects
  function checkBoxCollisions(canv, event) {
    // Get mouse x and y
    const rect = canv.getBoundingClientRect();
    const x = (event.clientX - rect.left);
    const y = (event.clientY - rect.top);
    // AABB
    for (let i = 0; i < rects.length; i++) {
      let r = rects[i];
      if (x > r.x &&
        x < r.x + 100 &&
        y > r.y &&
        y < r.y + 100) {

        if (Number(r.type) >= 0) {
          activeColor = Number(r.type);
        }
        else if (r.type === 'd') {
          activePiece = ' ';
        }
        else if (r.type === 'c') {
          resetBoard();
        }
        else {
          activePiece = r.type;
        }
      }
    }
  }

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector("#saveBoards")
        );
    });
};

const setup = function(csrf) {

    ReactDOM.render(
        <BoardList domos={[]} />, document.querySelector("#saveBoards")
    );

    // loadBoardsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};


$(document).ready(function() {
    getToken();
});
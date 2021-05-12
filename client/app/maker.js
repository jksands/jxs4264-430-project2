const BoardList = function (props) {
    
    // if (props.boards.length === 0) {
    if (!props.boards) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Boards yet</h3>
            </div>
        );
    }
    // console.log(pieces);
    const boardNodes = props.boards.map(function(board) {
        let canvasRef = useRef(null); // = document.createElement('canvas');
        useEffect(()=>{
            function renderCanvas() {
            let canv = canvasRef.current; 
            let W = document.documentElement.clientWidth / 5,H = W;
            canv.width = W;
            canv.height = H;
            let ctx = canv.getContext('2d');
            ctx.fillStyle = 'gray';
            ctx.fillRect(0,0,W,H);
            drawBoard(W / 8, ctx);
            // let b = board.board[0];
            let b = JSON.parse(board.board);
            for (let j = 0; j < b.length; j++)
            {
              let c = b[j].color === 'white'? 0 :1;
              drawPiece(b[j].type, c, b[j].col - 1, b[j].row - 1, ctx, W / 8);
            }
        }
        renderCanvas();
        window.addEventListener('resize', renderCanvas);

        }, []);
        return (
            (<div key={board._id} className="board">
        {/* <img src="/assets/img/chess.png" alt="domo face" className="domoFace" /> */}
        <h3 className="boardName"> Name: {board.name} </h3>
        <h3 className="boardDisplay"> <canvas ref={canvasRef}></canvas> </h3>
        {/* <img src={test} alt="Pieces"/> */}
        {/* <h3 className="domoAge"> Board: {JSON.stringify(board.board)} </h3> */}
            </div>)
        );
    });

    return (
        <div className="boardList">
            {boardNodes}
        </div>
    );
};


const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector("#boards")
        );
    });
};

const setup = function(csrf) {

    ReactDOM.render(
        <BoardList domos={[]} />, document.querySelector("#boards")
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
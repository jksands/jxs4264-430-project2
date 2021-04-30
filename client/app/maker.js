// import {useRef} from '@babel/preset-react'

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
        return (
            (<div key={board._id} className="domo">
        <img src="/assets/img/chess.png" alt="domo face" className="domoFace" />
        <h3 className="domoName"> Name: {board.name} </h3>
        {/* <canvas ref={canvas}></canvas> */}
        <h3 className="domoAge"> Board: {JSON.stringify(board.board)} </h3>
            </div>)
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadBoardsFromServer = () => {
    sendAjax('GET', '/getBoards', null, (data) => {
        ReactDOM.render(
            <BoardList boards={data.boards} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {

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
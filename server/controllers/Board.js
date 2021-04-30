const models = require('../models');

const { Board } = models;
const makerPage = (req, res) => {
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    // CHANGE THIS TO RENDER AN ARRAY OF BOARDS!
    const result = res.render('app', { csrfToken: req.csrfToken(), boards: docs });
    return result;
  });
};

const saverPage = (req, res) => {
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    // CHANGE THIS TO RENDER AN ARRAY OF BOARDS!
    const result = res.render('save', { csrfToken: req.csrfToken(), boards: docs });
    return result;
  });
};

const makeBoard = (req, res) => {
  console.log("making board...");
  if (!req.body.name || !req.body.board) {
    return res.status(400).json({ error: 'RAWR! Both name and Board are required' });
  }

  const boardData = {
    name: req.body.name,
    // Hardcode for now
    board: req.body.board,
    owner: req.session.account._id,
  };

  const newBoard = new Board.BoardModel(boardData);

  const boardPromise = newBoard.save();

  boardPromise.then(() => res.json({ redirect: '/maker' }));

  boardPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Board already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return boardPromise;
};

const getBoards = (request, response) => {
  const req = request;
  const res = response;
  return Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ boards: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.saverPage = saverPage
module.exports.getBoards = getBoards;
module.exports.make = makeBoard;

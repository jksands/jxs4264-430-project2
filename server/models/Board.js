const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let BoardModel = {};

// mongoos.Types.ObjectID is a functtion that
// converts string ID to real ongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  board: {
    type: Array,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

BoardSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  board: doc.board,
});

BoardSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  // Search by board to0?  Was 'name age'.  Might need 'name board'
  return BoardModel.find(search).select('name board').lean().exec(callback);
};

BoardModel = mongoose.model('Board', BoardSchema);

module.exports.BoardModel = BoardModel;
module.exports.BoardSchema = BoardSchema;

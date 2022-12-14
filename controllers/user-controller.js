const { Thought, User } = require('../models');

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create new user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // update user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId }, 
      body, 
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No User found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      // this line deletes all thoughts in the deleted user's thoughts array!! 
      .then(dbUserData => Thought.remove({ _id: {$in: dbUserData.thoughts }}))
      .then(res.status(200).json('User and all associated thoughts deleted.'))
      .catch(err => res.json(err))
  },

  // add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId},
      {$addToSet: { friends: params.friendId }},
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
        .catch(err => res.json(err));
  },

  // remove friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
}

module.exports = userController;
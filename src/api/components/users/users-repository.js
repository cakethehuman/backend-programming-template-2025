const { Users } = require('../../../models');
const { Prize } = require('../../../models');
const { History } = require('../../../models');

// see history
async function getHistory() {
  return History.find({});
}

// see price list
async function getPrizes() {
  return Prize.find({});
}

// liat history user di id
async function getHistoryId(userId) {
  return History.find({ UserId: userId });
}

// untuk gacha dan check remaning quota
async function gacha() {
  return Prize.find({ remainingQuota: { $gt: 0 } });
}

// untuk remove -1 dari barang tertentu kaya misalny
// Iphone
// count -1

// kurangin quota price
async function subPrize(id) {
  return Prize.updateOne({ _id: id }, { $inc: { remainingQuota: -1 } });
}

async function subUser(id) {
  return Users.updateOne({ _id: id }, { $inc: { remainingQuotaUser: -1 } });
}

async function gachaHistory(UserId, fullName, ItemWon) {
  return History.create({ UserId, fullName, ItemWon });
}

async function getUsers() {
  return Users.find({});
}

async function getUser(id) {
  return Users.findById(id);
}

async function getUserByEmail(email) {
  return Users.findOne({ email });
}

async function createUser(
  email,
  password,
  fullName,
  remainingQuotaUser,
  lastGachaDate
) {
  return Users.create({
    email,
    password,
    fullName,
    remainingQuotaUser,
    lastGachaDate,
  });
}

async function updateUser(id, email, fullName) {
  return Users.updateOne({ _id: id }, { $set: { email, fullName } });
}

async function changePassword(id, password) {
  return Users.updateOne({ _id: id }, { $set: { password } });
}

async function deleteUser(id) {
  return Users.deleteOne({ _id: id });
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  gacha,
  subPrize,
  subUser,
  gachaHistory,
  getHistoryId,
  getPrizes,
  getHistory,
};

const usersRepository = require('./users-repository');

async function getHistory() {
  return usersRepository.getHistory()
}

async function getPrizes() {
  return usersRepository.getPrizes();
}

async function getHistoryId(userId) {
  return usersRepository.getHistoryId(userId);
}

async function gacha() {
  return usersRepository.gacha();
}

async function gachaHistory(UserId, fullName, ItemWon) {
  return usersRepository.gachaHistory(UserId, fullName, ItemWon);
}

async function subPrize(id) {
  return usersRepository.subPrize(id);
}
async function subUser(id) {
  return usersRepository.subUser(id);
}

async function getUsers() {
  return usersRepository.getUsers();
}

async function getUser(id) {
  return usersRepository.getUser(id);
}

async function emailExists(email) {
  const user = await usersRepository.getUserByEmail(email);
  return !!user; // Return true if user exists, false otherwise
}

async function createUser(
  email,
  password,
  fullName,
  remainingQuotaUser,
  lastGachaDate
) {
  return usersRepository.createUser(
    email,
    password,
    fullName,
    remainingQuotaUser,
    lastGachaDate
  );
}

async function updateUser(id, email, fullName) {
  return usersRepository.updateUser(id, email, fullName);
}

async function deleteUser(id) {
  return usersRepository.deleteUser(id);
}

module.exports = {
  getUsers,
  getUser,
  emailExists,
  createUser,
  updateUser,
  deleteUser,
  gacha,
  subPrize,
  subUser,
  gachaHistory,
  getHistoryId,
  getPrizes,
  getHistory,
};

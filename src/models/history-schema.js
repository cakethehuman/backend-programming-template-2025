module.exports = (db) =>
  db.model(
    'History',
    db.Schema({
      UserId: String,
      fullName: String,
      ItemWon: String,
    })
  );

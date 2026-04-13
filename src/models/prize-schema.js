module.exports = (db) =>
  db.model(
    'Prize',
    db.Schema({
      name: String,
      initialQuota: Number,
      remainingQuota: Number,
    })
  );

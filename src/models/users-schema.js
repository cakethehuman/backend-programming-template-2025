module.exports = (db) =>
  db.model(
    'Users',
    db.Schema({
      email: String,
      password: String,
      fullName: String,
      remainingQuotaUser: {
        type : Number,
        default : 5
      },lastGachaDate: {
        type: Date,
        default: null
      },
    })
  );

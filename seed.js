const { Prize } = require('./src/models');

async function seedPrize(next) {
  // Nge reset semua data yang ada
  await Prize.deleteMany();

  try {
    // masukin data
    console.log('dah masukin data');
    return Prize.create([
      { name: 'Emas 10 gram', remainingQuota: 1 },
      { name: 'Smartphone X', remainingQuota: 5 },
      { name: 'Smartwatch Y', remainingQuota: 10 },
      { name: 'Voucher Rp100.000', remainingQuota: 100 },
      { name: 'Pulsa Rp50.000', remainingQuota: 500 },
    ]);
  } catch (err) {
    process.exit(1);
  }
}

seedPrize();

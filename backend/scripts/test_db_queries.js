const { sequelize, Incube, User, Promotion } = require('../src/models');

async function test() {
  try {
    console.log('Testing DB connection...');
    await sequelize.authenticate();
    console.log('DB connected successfully!');

    console.log('Testing Incube.findAll...');
    const incubes = await Incube.findAll({ limit: 2 });
    console.log('Incubes count query ok, fetched:', incubes.length);

    console.log('Testing User.findAll...');
    const users = await User.findAll({ limit: 2 });
    console.log('Users query ok, fetched:', users.length);

    console.log('Testing Promotion.findAll...');
    const promos = await Promotion.findAll({ limit: 2 });
    console.log('Promotions query ok, fetched:', promos.length);

    console.log('ALL DB QUERIES SUCCEEDED!');
  } catch (err) {
    console.error('ERROR during test:', err);
  } finally {
    process.exit(0);
  }
}

test();


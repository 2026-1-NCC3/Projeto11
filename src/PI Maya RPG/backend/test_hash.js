const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('123456', 10);
  console.log('New hash for 123456:', hash);
  
  // Verify the new one works
  const match = await bcrypt.compare('123456', hash);
  console.log('New hash verify:', match);
  
  // Verify the seed hash
  const seedHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const seedMatch = await bcrypt.compare('123456', seedHash);
  console.log('Seed hash verify:', seedMatch);
}

main();

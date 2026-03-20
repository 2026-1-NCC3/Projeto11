const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('123456', 10);
  console.log('Hash for 123456:', hash);
  
  // Verify it works
  const match = await bcrypt.compare('123456', hash);
  console.log('Verify match:', match);
  
  // Also verify the seed hash
  const seedHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const seedMatch = await bcrypt.compare('123456', seedHash);
  console.log('Seed hash match:', seedMatch);
}

main();

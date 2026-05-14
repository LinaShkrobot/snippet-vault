const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(uri);
    const snippets = await mongoose.connection.db
      .collection('snippets')
      .find({})
      .toArray();

    const cleaned = snippets.map(({ _id, __v, ...rest }) => rest);

    fs.writeFileSync('seed.json', JSON.stringify(cleaned, null, 2));
    console.log(`✅ Exported ${cleaned.length} snippets to seed.json`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();

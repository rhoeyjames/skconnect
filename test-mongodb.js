const mongoose = require('mongoose');

async function testConnection() {
  const mongoUri = "mongodb+srv://jamesrowi:jamesrhoey@mernapp.zomz5.mongodb.net/sk-connect?retryWrites=true&w=majority&appName=MERNapp";
  
  console.log('🔍 Testing MongoDB connection...');
  console.log('URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test if users collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Try to count users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const userCount = await User.countDocuments();
    console.log('👥 Total users in database:', userCount);
    
    if (userCount > 0) {
      console.log('🔍 Sample user emails:');
      const sampleUsers = await User.find({}, { email: 1, firstName: 1, lastName: 1, role: 1 }).limit(5);
      sampleUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
      });
    }
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();

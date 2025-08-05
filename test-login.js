// Using built-in fetch (Node.js 18+)

const FRONTEND_URL = 'http://localhost:3000';

async function testLoginFlow() {
  console.log('🔍 Testing SKConnect login functionality...\n');

  // Test 1: Register a test user
  console.log('1️⃣ Testing user registration...');
  try {
    const registerResponse = await fetch(`${FRONTEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123',
        age: 25,
        barangay: 'Test Barangay',
        municipality: 'Test Municipality',
        province: 'Test Province',
        phoneNumber: '+63123456789',
        dateOfBirth: '1999-01-01'
      }),
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      console.log(`   User: ${registerData.user.firstName} ${registerData.user.lastName}`);
      console.log(`   Email: ${registerData.user.email}`);
      console.log(`   Role: ${registerData.user.role}`);
    } else {
      console.log('⚠️  Registration response:', registerData);
      if (registerData.message && registerData.message.includes('already exists')) {
        console.log('🔄 User already exists, proceeding with login test...');
      } else {
        console.log('❌ Registration failed:', registerData.message);
        return;
      }
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return;
  }

  console.log();

  // Test 2: Login with the test user
  console.log('2️⃣ Testing user login...');
  try {
    const loginResponse = await fetch(`${FRONTEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'password123'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log(`   Welcome: ${loginData.user.firstName} ${loginData.user.lastName}`);
      console.log(`   Role: ${loginData.user.role}`);
      console.log(`   Token provided: ${loginData.token ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Login failed:', loginData.message);
      console.log('   Full response:', loginData);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  console.log();

  // Test 3: Backend health check
  console.log('3️⃣ Testing backend connectivity...');
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Backend is healthy!');
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Message: ${healthData.message}`);
    } else {
      console.log('❌ Backend health check failed');
    }
  } catch (error) {
    console.log('❌ Backend not accessible:', error.message);
  }

  console.log('\n🎯 Test completed!');
}

testLoginFlow();

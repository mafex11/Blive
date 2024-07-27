import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req, res) {
  const { userAddress, userName, emailId, fullName } = await req.json();

  console.log('Received POST request with data:', { userAddress, userName, emailId, fullName });

  if (!userAddress || !userName || !emailId || !fullName) {
    console.error('Address, username, email, and full name are required');
    return new Response(JSON.stringify({ error: 'Address, username, email, and full name are required' }), { status: 400 });
  }

  await connectToDatabase();
  console.log('Connected to database');

  try {
    let user = await User.findOne({ address: userAddress });
    console.log('User found:', user);

    if (!user) {
      console.log('Creating new user');
      user = new User({ address: userAddress, userName, emailId, fullName });
      await user.save();
    } else {
      console.log('Updating existing user');
      user.userName = userName;
      user.emailId = emailId;
      user.fullName = fullName;
      await user.save();
    }
    console.log('User saved:', user);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error saving user:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req, res) {
  return new Response(JSON.stringify({ message: 'This API route only supports POST requests' }), { status: 405 });
}

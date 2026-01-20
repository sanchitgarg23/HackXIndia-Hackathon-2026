import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, department } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return NextResponse.json(
            { error: 'User already exists' },
            { status: 400 }
        );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Password hashing happens in User model pre-save hook
      role: 'DOCTOR', // Defaulting to Doctor for website signup
      specialization: 'General Physician',
      hospital: 'General Hospital',
      department: department || 'General Medicine'
    });

    // Generate JWT
    const token = await signToken({ 
      userId: user.id, 
      email: user.email 
    });

    // Create response with cookie and full user data (including password for demo)
    const response = NextResponse.json({ 
      success: true, 
      user,
      token,
      credentials: { email, password } // Return credentials for localStorage storage
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}

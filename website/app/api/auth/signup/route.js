import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, department } = await request.json();

    // Mock validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Mock user creation - include credentials for demo
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // Include password for demo localStorage storage
      role: 'Physician',
      department: department || 'General Medicine'
    };

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

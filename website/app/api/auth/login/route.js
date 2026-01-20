import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, storedCredentials } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo validation: check against stored credentials if they exist
    // This allows the client to send stored credentials for validation
    if (storedCredentials) {
      const validUser = storedCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (validUser) {
        // Use stored user data
        const token = await signToken({ 
          userId: validUser.id, 
          email: validUser.email 
        });

        const response = NextResponse.json({ 
          success: true, 
          user: validUser,
          token 
        });

        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        });

        return response;
      } else {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Fallback: accept any credentials if no stored users (first-time login)
    const user = {
      id: Date.now().toString(),
      email,
      password, // Include for demo
      name: 'Dr. ' + email.split('@')[0],
      role: 'Physician',
      department: 'General Medicine'
    };

    const token = await signToken({ 
      userId: user.id, 
      email: user.email 
    });

    const response = NextResponse.json({ 
      success: true, 
      user,
      token,
      credentials: { email, password }
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
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

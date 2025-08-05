import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Registration request data:', {
      ...body,
      password: '[HIDDEN]' // Don't log passwords
    })

    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log('Backend response:', {
      status: response.status,
      data: data
    })

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Registration proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

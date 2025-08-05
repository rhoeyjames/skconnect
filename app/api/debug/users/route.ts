import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/debug/users`)
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Backend not available', users: [] },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json(
      { 
        message: 'Unable to fetch users', 
        users: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    )
  }
}

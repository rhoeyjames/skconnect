import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5000'

export async function GET() {
  try {
    // Create a simple endpoint to list users for verification
    const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Unable to fetch users', users: [] },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      message: 'Users retrieved successfully',
      count: data.users?.length || 0,
      users: data.users || [],
    })
  } catch (error) {
    console.error('Users list error:', error)
    return NextResponse.json(
      { 
        message: 'Service unavailable', 
        users: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    )
  }
}

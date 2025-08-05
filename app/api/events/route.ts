import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pass through any query parameters
    const queryString = searchParams.toString()
    const url = `${BACKEND_URL}/api/events${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Events proxy error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData()
    
    const response = await fetch(`${BACKEND_URL}/api/events`, {
      method: 'POST',
      body: body,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create event proxy error:', error)
    return NextResponse.json(
      { message: 'Failed to create event' },
      { status: 500 }
    )
  }
}

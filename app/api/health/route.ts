import { NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`)
    const data = await response.json()
    
    return NextResponse.json({
      ...data,
      proxy: 'Next.js API Route',
      backend: response.ok ? 'connected' : 'disconnected'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR',
        message: 'Backend connection failed',
        proxy: 'Next.js API Route',
        backend: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}

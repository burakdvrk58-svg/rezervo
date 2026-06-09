import { type NextRequest, NextResponse } from 'next/server'

/**
 * Next.js 16 Proxy (replaces middleware)
 * Phase 1-4: Pass-through — auth logic added in Phase 5
 */
export default function proxy(_request: NextRequest) {
  return NextResponse.next()
}

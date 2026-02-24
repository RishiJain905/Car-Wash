import { NextResponse } from 'next/server'

// Pre-compiled regex for performance - avoid recompiling on every request
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Input length limits
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 2000

/**
 * Sanitize input by removing control characters
 * @param input - The string to sanitize
 * @returns Sanitized string with control characters removed
 */
function sanitizeInput(input: string): string {
  // Remove control characters (ASCII 0-31 except tabs, newlines, carriage returns)
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

interface ContactFormData {
  name: string
  email: string
  message: string
  website_url_field?: string // honeypot field
}

interface ValidationError {
  field: string
  message: string
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: ContactFormData = await request.json()

    // Validate honeypot field (should be empty)
    if (body.website_url_field && body.website_url_field.trim() !== '') {
      // Silent success for bots
      return NextResponse.json(
        { success: true, message: 'Inquiry received' },
        { status: 200 }
      )
    }

    // Validate required fields
    const errors: ValidationError[] = []

    // Sanitize inputs first
    const sanitizedName = sanitizeInput(body.name || '')
    const sanitizedEmail = sanitizeInput(body.email || '')
    const sanitizedMessage = sanitizeInput(body.message || '')

    if (!sanitizedName || sanitizedName.trim().length < 2) {
      errors.push({
        field: 'name',
        message: 'Name is required and must be at least 2 characters',
      })
    } else if (sanitizedName.trim().length > MAX_NAME_LENGTH) {
      errors.push({
        field: 'name',
        message: `Name must be less than ${MAX_NAME_LENGTH} characters`,
      })
    }

    if (!sanitizedEmail || sanitizedEmail.trim() === '') {
      errors.push({
        field: 'email',
        message: 'Email is required',
      })
    } else if (sanitizedEmail.trim().length > MAX_EMAIL_LENGTH) {
      errors.push({
        field: 'email',
        message: `Email must be less than ${MAX_EMAIL_LENGTH} characters`,
      })
    } else {
      // Email regex validation
      if (!EMAIL_REGEX.test(sanitizedEmail)) {
        errors.push({
          field: 'email',
          message: 'Please enter a valid email address',
        })
      }
    }

    if (!sanitizedMessage || sanitizedMessage.trim().length < 10) {
      errors.push({
        field: 'message',
        message: 'Message is required and must be at least 10 characters',
      })
    } else if (sanitizedMessage.trim().length > MAX_MESSAGE_LENGTH) {
      errors.push({
        field: 'message',
        message: `Message must be less than ${MAX_MESSAGE_LENGTH} characters`,
      })
    }

    // Return validation errors
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    // Log metadata only (no PII) for monitoring
    console.log('=== New Contact Form Submission ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Name length:', sanitizedName.trim().length)
    console.log('Email length:', sanitizedEmail.trim().length)
    console.log('Message length:', sanitizedMessage.trim().length)
    console.log('===================================')

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Inquiry received' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}

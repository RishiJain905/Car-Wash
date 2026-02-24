'use client'

import { useState, useCallback, FormEvent, ChangeEvent } from 'react'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Memoized validation function
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (email.trim().length > 254) {
      newErrors.email = 'Email must be less than 254 characters'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = 'Message is required'
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (message.trim().length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, email, message])

  // Memoized change handlers
  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
  }, [errors.name])

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }, [errors.email])

  const handleMessageChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    if (errors.message) {
      setErrors((prev) => ({ ...prev, message: undefined }))
    }
  }, [errors.message])

  const handleHoneypotChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setHoneypot(e.target.value)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    // Check honeypot - if filled, silently succeed (trick the bot)
    if (honeypot.trim() !== '') {
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website_url_field: honeypot,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation errors from server
        if (data.errors) {
          const serverErrors: FormErrors = {}
          data.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field as keyof FormErrors] = err.message
          })
          setErrors(serverErrors)
        } else {
          setSubmitError(data.message || 'Failed to send message')
        }
        return
      }

      // Success
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action="#" className="space-y-6" method="POST" onSubmit={handleSubmit}>
      {/* Honeypot - hidden from users, left blank */}
      <input
        type="text"
        name="website_url_field"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={handleHoneypotChange}
      />

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-sm">
          <p className="text-sm font-medium">Thank you for your inquiry! We&apos;ll get back to you soon.</p>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-sm">
          <p className="text-sm font-medium">{submitError}</p>
        </div>
      )}

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className={`w-full bg-background-light dark:bg-background-dark border rounded-sm px-4 py-3 text-gray-900 dark:text-white focus:outline-none transition-colors ${
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-white'
          }`}
          id="name"
          name="name"
          placeholder="John Doe"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={`w-full bg-background-light dark:bg-background-dark border rounded-sm px-4 py-3 text-gray-900 dark:text-white focus:outline-none transition-colors ${
            errors.email
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-white'
          }`}
          id="email"
          name="email"
          placeholder="john@example.com"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          className={`w-full bg-background-light dark:bg-background-dark border rounded-sm px-4 py-3 text-gray-900 dark:text-white focus:outline-none transition-colors resize-none ${
            errors.message
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700 focus:border-primary dark:focus:border-white'
          }`}
          id="message"
          name="message"
          placeholder="Tell us about your vehicle..."
          rows={4}
          value={message}
          onChange={handleMessageChange}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      <button
        className="w-full bg-primary text-white dark:bg-white dark:text-black py-4 font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

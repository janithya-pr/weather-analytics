import { withAuthenticationRequired } from '@auth0/auth0-react'
import type { ComponentType } from 'react'

export const withProtection = <P extends object>(
  Component: ComponentType<P>,
) => {
  return withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          aria-label="Loading"
        />
      </main>
    ),
  })
}
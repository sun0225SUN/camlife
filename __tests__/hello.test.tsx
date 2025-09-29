import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HelloPage from '../src/app/[locale]/hello/page'

describe('HelloPage', () => {
  it('renders hello message', () => {
    render(<HelloPage />)

    expect(screen.getByRole('heading').textContent).toBe('Hello, Vitest!')
    expect(screen.getByTestId('greeting')).not.toBeNull()
  })
})

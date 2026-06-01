import React from 'react'

export default function LoadingSpinner({ size = 40 }) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
}

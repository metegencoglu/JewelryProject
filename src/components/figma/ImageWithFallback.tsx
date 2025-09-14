import React, { useState } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
  [key: string]: any
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, fill, width, height, ...rest } = props

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          {fill ? (
            <Image 
              src={ERROR_IMG_SRC} 
              alt="Error loading image" 
              fill
              {...rest} 
              data-original-url={src} 
            />
          ) : (
            <Image 
              src={ERROR_IMG_SRC} 
              alt="Error loading image" 
              width={width || 88}
              height={height || 88}
              {...rest} 
              data-original-url={src} 
            />
          )}
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <Image 
        src={src} 
        alt={alt} 
        fill
        className={className} 
        style={style} 
        {...rest} 
        onError={handleError} 
      />
    )
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width || 500}
      height={height || 500}
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
}

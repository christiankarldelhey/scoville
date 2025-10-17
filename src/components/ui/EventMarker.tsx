import React from 'react'

// Componente interno: solo el ícono SVG
interface EventMarkerIconProps {
  color?: string
  rotation?: number
  className?: string
  size?: number
  glow?: boolean
}

const EventMarkerIcon: React.FC<EventMarkerIconProps> = ({ 
  color = '#000000',
  rotation = 0,
  className = '',
  size = 57,
  glow = false
}) => {
  // Convertir color hex a RGB para el glow
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(color)
  const glowStyle = glow ? {
    filter: `drop-shadow(0 0 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)) drop-shadow(0 0 16px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6))`
  } : {}

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 57.03 48.04"
      width={size}
      opacity={0.6}
      height={(size * 48.04) / 57.03}
      className={className}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
        ...glowStyle
      }}
    >
      <path 
        d="M31.35.11c28.67-2.49,35.9,39.52,8.44,46.94-15.61,4.22-22.96-5.67-32.34-15.47C6.42,30.5,0,24.48,0,23.82l.33-.69C10.13,14.87,17.39,1.32,31.35.11Z"
        fill={color}
        className="transition-colors duration-300"
      />
    </svg>
  )
}

// Componente completo: EventMarker con texto
interface EventMarkerProps {
  text: string
  position: string // e.g., '30%'
  offsetY: string // e.g., '-40%'
  textOffsetY: string // e.g., '60%'
  rotation?: number
  color?: string
  size?: number
  glow?: boolean
  onClick?: () => void
}

export const EventMarker: React.FC<EventMarkerProps> = ({ 
  text,
  position,
  offsetY,
  textOffsetY,
  rotation = 0,
  color = '#000000',
  size = 45,
  glow = false,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation() // Evita que el click se propague a la imagen
      onClick()
    }
  }

  return (
    <div 
      className={`absolute flex items-center ${
        onClick ? 'pointer-events-auto cursor-pointer hover:opacity-80' : 'pointer-events-none'
      }`}
      style={{ 
        right: position,
        top: 0,
        transform: `translateY(${offsetY})`
      }}
      onClick={handleClick}
    >
      <EventMarkerIcon rotation={rotation} color={color} size={size} glow={glow} />
      <span 
        className="absolute text-white"
        style={{ 
          left: textOffsetY,
          top: '65%',
          transform: 'translate(-50%, -50%)',
          fontSize: `${size * 0.8 * 0.42}px`,
          lineHeight: 1,
          fontFamily: '"Old Standard TT", bold',
          fontWeight: 500
        }}
      >
        {text}
      </span>
    </div>
  )
}

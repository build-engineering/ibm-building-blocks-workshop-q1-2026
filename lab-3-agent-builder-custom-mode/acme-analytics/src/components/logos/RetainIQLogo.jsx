// RetainIQ Logo - Customer retention/intelligence theme
function RetainIQLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circular retention symbol */}
      <circle cx="20" cy="20" r="14" stroke="#8a3ffc" strokeWidth="2.5" fill="none" />
      <circle cx="20" cy="20" r="10" stroke="#8a3ffc" strokeWidth="2" fill="none" opacity="0.5" />
      
      {/* Customer nodes */}
      <circle cx="20" cy="6" r="2.5" fill="#8a3ffc" />
      <circle cx="32" cy="14" r="2.5" fill="#8a3ffc" />
      <circle cx="32" cy="26" r="2.5" fill="#8a3ffc" />
      <circle cx="20" cy="34" r="2.5" fill="#8a3ffc" />
      <circle cx="8" cy="26" r="2.5" fill="#8a3ffc" />
      <circle cx="8" cy="14" r="2.5" fill="#8a3ffc" />
      
      {/* Center intelligence node */}
      <circle cx="20" cy="20" r="3" fill="#8a3ffc" />
      <circle cx="20" cy="20" r="1.5" fill="white" />
      
      {/* Connection lines */}
      <line x1="20" y1="8.5" x2="20" y2="17" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      <line x1="29.5" y1="15.5" x2="22.5" y2="18.5" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      <line x1="29.5" y1="24.5" x2="22.5" y2="21.5" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      <line x1="20" y1="31.5" x2="20" y2="23" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      <line x1="10.5" y1="24.5" x2="17.5" y2="21.5" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      <line x1="10.5" y1="15.5" x2="17.5" y2="18.5" stroke="#8a3ffc" strokeWidth="1.5" opacity="0.3" />
      
      {/* IQ indicator */}
      <path d="M 24 18 L 26 18 L 26 22 L 24 22 Z" fill="#8a3ffc" opacity="0.6" />
      <path d="M 27 16 L 29 16 L 29 22 L 27 22 Z" fill="#8a3ffc" opacity="0.8" />
      <path d="M 30 14 L 32 14 L 32 22 L 30 22 Z" fill="#8a3ffc" />
    </svg>
  );
}

export default RetainIQLogo;

// Made with Bob
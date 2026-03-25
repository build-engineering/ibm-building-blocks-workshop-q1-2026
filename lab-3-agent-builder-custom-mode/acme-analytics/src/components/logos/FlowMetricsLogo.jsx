// FlowMetrics Logo - Supply chain flow/metrics theme
function FlowMetricsLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flow path */}
      <path 
        d="M 5 20 Q 12 10, 20 20 T 35 20" 
        stroke="#1192e8" 
        strokeWidth="2.5" 
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Flow arrows */}
      <path d="M 13 16 L 16 20 L 13 24" stroke="#1192e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 27 16 L 30 20 L 27 24" stroke="#1192e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Metric nodes */}
      <circle cx="5" cy="20" r="3" fill="#1192e8" />
      <circle cx="20" cy="20" r="3" fill="#1192e8" />
      <circle cx="35" cy="20" r="3" fill="#1192e8" />
      
      {/* Metric bars */}
      <g opacity="0.7">
        <rect x="3" y="28" width="2" height="8" fill="#1192e8" />
        <rect x="6" y="30" width="2" height="6" fill="#1192e8" />
        <rect x="9" y="32" width="2" height="4" fill="#1192e8" />
        
        <rect x="18" y="26" width="2" height="10" fill="#1192e8" />
        <rect x="21" y="28" width="2" height="8" fill="#1192e8" />
        <rect x="24" y="30" width="2" height="6" fill="#1192e8" />
        
        <rect x="33" y="27" width="2" height="9" fill="#1192e8" />
        <rect x="36" y="29" width="2" height="7" fill="#1192e8" />
      </g>
      
      {/* Data points */}
      <circle cx="5" cy="12" r="1.5" fill="#1192e8" opacity="0.5" />
      <circle cx="12" cy="8" r="1.5" fill="#1192e8" opacity="0.5" />
      <circle cx="20" cy="12" r="1.5" fill="#1192e8" opacity="0.5" />
      <circle cx="28" cy="8" r="1.5" fill="#1192e8" opacity="0.5" />
      <circle cx="35" cy="12" r="1.5" fill="#1192e8" opacity="0.5" />
      
      {/* Connection lines to data points */}
      <line x1="5" y1="17" x2="5" y2="13.5" stroke="#1192e8" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
      <line x1="20" y1="17" x2="20" y2="13.5" stroke="#1192e8" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
      <line x1="35" y1="17" x2="35" y2="13.5" stroke="#1192e8" strokeWidth="1" opacity="0.3" strokeDasharray="2,2" />
    </svg>
  );
}

export default FlowMetricsLogo;

// Made with Bob
interface TextFileIconProps {
  color?: string;
  name: string;
  onClick?: () => void;
}

export default function TextFileIcon({
  color = "#ffffff",
  name,
  onClick,
}: TextFileIconProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        maxWidth: "150px",
      }}
    >
      <svg width="24" height="28" viewBox="0 0 24 28">
        <path
          d="M2 2 L18 2 L22 6 L22 26 L2 26 Z"
          fill={color}
          stroke="black"
          strokeWidth="1"
        />
        <path
          d="M18 2 L18 6 L22 6"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
        <line x1="5" y1="12" x2="19" y2="12" stroke="black" strokeWidth="0.5" />
        <line x1="5" y1="15" x2="19" y2="15" stroke="black" strokeWidth="0.5" />
        <line x1="5" y1="18" x2="15" y2="18" stroke="black" strokeWidth="0.5" />
      </svg>
      <span
        style={{
          color: "black",
          textAlign: "center",
          wordWrap: "break-word",
        }}
      >
        {name}
      </span>
    </div>
  );
}

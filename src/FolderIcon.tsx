interface FolderIconProps {
  color?: string;
  name?: string;
  onClick?: () => void;
}

function FolderIcon({ color = "#ffcc00", name, onClick }: FolderIconProps) {
  return (
    <div
      style={{
        display: "inline-block",
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <svg width="48" height="36" viewBox="0 0 48 36">
        <path
          d="M2 8 L18 8 L22 4 L46 4 L46 32 L2 32 Z"
          fill={color}
          stroke="#000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {name && <div style={{ marginTop: "2px" }}>{name}</div>}
    </div>
  );
}

export default FolderIcon;

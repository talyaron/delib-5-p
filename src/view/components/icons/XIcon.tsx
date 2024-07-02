export default function XIcon({ color = "white" }: { color?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.0002 7.99988L8.00018 23.9999"
        stroke={color}
        stroke-width="1.99832"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.00018 7.99988L24.0002 23.9999"
        stroke={color}
        stroke-width="1.99832"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
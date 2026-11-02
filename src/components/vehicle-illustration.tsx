export function VehicleIllustration({
  tone = "red",
}: {
  tone?: "red" | "silver" | "dark";
}) {
  return (
    <div className={`vehicle-illustration tone-${tone}`} aria-hidden="true">
      <div className="studio-light" />
      <span className="studio-word">ESTUDIO</span>
      <svg viewBox="0 0 900 380" fill="none">
        <ellipse cx="456" cy="298" rx="334" ry="17" fill="#000" opacity=".45" />
        <path
          d="m108 248 23-49 103-25 108-71c29-18 124-20 168-2l127 73 102 21 39 42-8 30H109Z"
          className="vehicle-body"
          stroke="#85868b"
          strokeWidth="2"
        />
        <path
          d="m278 170 77-50c28-17 109-16 143-2l86 52H278Z"
          fill="#16191d"
          stroke="#6d6e73"
          strokeWidth="2"
        />
        <path
          d="m441 110 9 62M248 183h379M179 244h111m298 0h126"
          stroke="#929397"
          opacity=".55"
          strokeWidth="2"
        />
        <path
          d="m133 211 63-11-10 17-62 7M696 207l55 13-6 14-46-7"
          className="vehicle-light"
        />
        <circle
          cx="259"
          cy="263"
          r="55"
          fill="#101113"
          stroke="#6e7075"
          strokeWidth="5"
        />
        <circle
          cx="259"
          cy="263"
          r="35"
          fill="#34363b"
          stroke="#909298"
          strokeWidth="2"
        />
        <circle cx="259" cy="263" r="9" fill="#151619" />
        <circle
          cx="649"
          cy="263"
          r="55"
          fill="#101113"
          stroke="#6e7075"
          strokeWidth="5"
        />
        <circle
          cx="649"
          cy="263"
          r="35"
          fill="#34363b"
          stroke="#909298"
          strokeWidth="2"
        />
        <circle cx="649" cy="263" r="9" fill="#151619" />
        <path
          d="m259 228 0 70m-35-35h70m355-35v70m-35-35h70"
          stroke="#85878d"
          strokeWidth="4"
        />
      </svg>
      <span className="studio-caption">
        ILUSTRACIÓN CONCEPTUAL · NO ES UNA FOTO DE INVENTARIO
      </span>
    </div>
  );
}

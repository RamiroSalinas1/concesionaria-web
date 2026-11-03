import { siteConfig } from "@/config/site";

export function TrackArtwork() {
  return (
    <div className="track-artwork" aria-hidden="true">
      <div className="track-glow" />
      <svg viewBox="0 0 700 700" fill="none" className="track-lines">
        <defs>
          <linearGradient
            id="track-edge"
            x1="100"
            y1="140"
            x2="630"
            y2="620"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="color-mix(in srgb, var(--accent) 75%, white)" />
            <stop offset=".45" stopColor="var(--accent)" />
            <stop
              offset="1"
              stopColor="color-mix(in srgb, var(--accent) 25%, var(--background))"
            />
          </linearGradient>
          <linearGradient
            id="track-fill"
            x1="280"
            y1="100"
            x2="500"
            y2="650"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--elevated)" />
            <stop offset="1" stopColor="var(--background)" />
          </linearGradient>
        </defs>
        <g transform="rotate(-26 350 350)">
          <rect
            x="160"
            y="40"
            width="390"
            height="650"
            rx="195"
            fill="url(#track-fill)"
            stroke="#34363b"
            strokeWidth="2"
          />
          <rect
            x="172"
            y="52"
            width="366"
            height="626"
            rx="183"
            stroke="url(#track-edge)"
            strokeWidth="3"
          />
          <rect
            x="198"
            y="78"
            width="314"
            height="574"
            rx="157"
            stroke="#414349"
          />
          <rect
            x="222"
            y="102"
            width="266"
            height="526"
            rx="133"
            stroke="#55575d"
            strokeDasharray="2 12"
          />
          <rect
            x="249"
            y="130"
            width="212"
            height="470"
            rx="106"
            stroke="#42444a"
          />
          <rect
            x="272"
            y="153"
            width="166"
            height="424"
            rx="83"
            fill="var(--background)"
            stroke="#35373b"
          />
          <path
            d="M172 405V235C172 134 254 52 355 52"
            stroke="color-mix(in srgb, var(--accent) 75%, white)"
            strokeWidth="5"
          />
          <path
            d="M198 455V235C198 148 268 78 355 78"
            stroke="#8c242d"
            strokeWidth="2"
          />
          <path d="M465 356H540" stroke="#f5f3ef" strokeWidth="5" />
          <path d="M465 368H540" stroke="var(--background)" strokeWidth="5" />
          <path d="M465 380H540" stroke="#f5f3ef" strokeWidth="5" />
        </g>
        <path
          d="M480 100H660M525 116H680M570 132H690M50 539H170M20 555H140"
          stroke="#55575d"
        />
        <circle cx="590" cy="585" r="36" stroke="#3c3e43" />
        <path d="m575 585 29-16-15 29-4-10-10-3Z" fill="var(--accent)" />
      </svg>
      <span className="art-coordinate art-coordinate-top">
        {siteConfig.copy.home.artEyebrow}
      </span>
      <span className="art-coordinate art-coordinate-bottom">
        {siteConfig.copy.home.artFooter} <span>↗</span>
      </span>
    </div>
  );
}

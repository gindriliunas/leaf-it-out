"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  useCardReveal,
  useGsapMarquee,
  useRevealOnScroll,
} from "./marketing/gsap-animations";

const ThreeLeafScene = dynamic(
  () =>
    import("./marketing/three-scene").then((m) => ({
      default: m.ThreeLeafScene,
    })),
  { ssr: false }
);
const ThreeDarkBg = dynamic(
  () =>
    import("./marketing/three-scene").then((m) => ({ default: m.ThreeDarkBg })),
  { ssr: false }
);

// ── Design tokens ────────────────────────────────────────────────────────────
const G = "#6BBF3E";
const FOREST = "#0a1f0a";
const FOREST_MID = "#0f2d14";
const FOREST_CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(107,191,62,0.18)";

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    title: "Driveways & Block Paving",
    tag: "Most Popular",
    desc: "Upgrade your home's kerb appeal with premium block paving, tarmac or resin bound driveways — built to last.",
    points: [
      "Permeable & drainage solutions",
      "Indian sandstone & granite setts",
      "Edging, borders & finishing",
    ],
    photo: "/photo-driveway-corner.jpg",
  },
  {
    title: "Patios & Natural Stone",
    tag: "Specialist",
    desc: "Create the perfect outdoor living space with travertine, porcelain, limestone or Indian sandstone.",
    points: [
      "Travertine & limestone",
      "Porcelain & ceramic tiles",
      "Curved & feature designs",
    ],
    photo: "/photo-patio-slate.jpg",
  },
  {
    title: "Garden Landscaping",
    tag: "Full Design",
    desc: "Complete garden transformations from concept to completion — turf, planting, water features & more.",
    points: [
      "Design consultation included",
      "Water features & garden ponds",
      "New turf, planting & borders",
    ],
    photo: "/photo-garden-complete.jpg",
  },
  {
    title: "Decking & Fencing",
    tag: "Structures",
    desc: "High-quality timber and composite decking with matching fencing to define your outdoor space beautifully.",
    points: [
      "Treated timber & composite boards",
      "Privacy & feature panels",
      "Gate & pergola installation",
    ],
    photo: "/photo-decking.jpg",
  },
];

const MARQUEE_ITEMS = [
  "Driveways",
  "Block Paving",
  "Patios",
  "Garden Landscaping",
  "Decking",
  "Fencing",
  "Natural Stone",
  "Turfing",
  "Water Features",
  "Drainage",
  "Resin Bound",
  "Porcelain Paving",
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Free Consultation",
    desc: "We visit your property, listen to your vision, and assess the site. No obligation — just honest expert advice tailored to your home.",
    icon: (
      <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <circle cx={16} cy={16} r={14} stroke={G} strokeWidth={1.5} />
        <path d="M10 16l4 4 8-8" stroke={G} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Design & Quote",
    desc: "We provide a detailed proposal with material options and fully transparent pricing. No hidden costs, ever.",
    icon: (
      <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <rect x={6} y={4} width={20} height={24} rx={3} stroke={G} strokeWidth={1.5} />
        <path d="M10 12h12M10 16h8M10 20h6" stroke={G} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Expert Installation",
    desc: "Our skilled team transforms your outdoor space to the highest standard — on time, on budget, and spotlessly clean when finished.",
    icon: (
      <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <path d="M8 26V14l8-8 8 8v12" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={12} y={18} width={8} height={8} rx={1} stroke={G} strokeWidth={1.5} />
      </svg>
    ),
  },
];

const GALLERY = [
  { photo: "/photo-garden-complete.jpg", title: "Full Garden Transformation", loc: "Kent" },
  { photo: "/photo-driveway-block.jpg", title: "Block Paving Driveway", loc: "Chatham" },
  { photo: "/photo-driveway-corner.jpg", title: "Grey Block Paving", loc: "Rochester" },
  { photo: "/photo-pond.jpg", title: "Garden Pond & Gravel Feature", loc: "Maidstone" },
  { photo: "/photo-garden-premium.jpg", title: "Premium Patio & Landscaping", loc: "Kent" },
];

const AREAS = [
  "Chatham", "Rochester", "Gillingham", "Rainham", "Sittingbourne",
  "Maidstone", "Faversham", "Canterbury", "Tonbridge", "Sevenoaks",
  "Gravesend", "Dartford", "Swanley", "Snodland", "Aylesford",
  "Strood", "Hoo", "Medway City", "West Malling", "Bearsted",
  "Surrey", "Essex",
];

const FAQ_ITEMS = [
  {
    q: "Do you offer free quotes?",
    a: "Yes — all site visits and written quotes are completely free with no obligation. We'll come to your property, discuss your requirements, and provide a detailed breakdown of costs.",
  },
  {
    q: "How long does a driveway installation take?",
    a: "Most driveways take 2–5 days depending on size and complexity. We'll give you an accurate timeline in your quote and always aim to minimise disruption to your household.",
  },
  {
    q: "Are you Checkatrade approved?",
    a: "Yes, we are fully Checkatrade approved. All our tradespeople are vetted and our customer reviews are independently verified. View our profile at checkatrade.com/trades/leafitoutlandscapes.",
  },
  {
    q: "What areas do you cover?",
    a: "We cover the whole of Medway, Kent, Surrey and Essex, including Chatham, Rochester, Gillingham, Maidstone, Sittingbourne, Canterbury and surrounding areas. If you're unsure, just give us a call.",
  },
  {
    q: "Do I need planning permission for a new driveway or patio?",
    a: "In most cases, no planning permission is required — especially for permeable surfaces or driveways under 5m². We'll advise you on any requirements during your free consultation.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CheckatradeBadge() {
  return (
    <a
      href="https://www.checkatrade.com/trades/leafitoutlandscapes"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "10px 18px",
        textDecoration: "none",
        transition: "background 0.2s",
      }}
    >
      <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <circle cx={14} cy={14} r={13} fill="#009E60" />
        <path d="M7 14l5 5 9-9" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontSize: 11, color: "rgba(232,245,227,0.6)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1 }}>
          Checkatrade
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e8f5e3", lineHeight: 1.3 }}>
          Approved & Vetted
        </div>
      </div>
    </a>
  );
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 16 16" fill="#f59e0b">
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.25l-3.71 2.3.71-4.13L2 5.5l4.15-.75z" />
        </svg>
      ))}
    </span>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);

  const links = ["Services", "Gallery", "About", "Areas", "Contact"];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,31,10,0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          <a href="/" style={{ position: "relative", width: 130, height: 46, display: "block", flexShrink: 0 }}>
            <Image
              src="/logo.webp"
              alt="Leaf It Out Landscaping Medway"
              fill
              style={{ objectFit: "contain", objectPosition: "left center" }}
              priority
            />
          </a>

          <div className="nav-desktop-links">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{
                  color: "#c8e8c0",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = G)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#c8e8c0")}
              >
                {l}
              </a>
            ))}
          </div>

          <div className="nav-desktop-phone">
            <a
              href="tel:+447871878682"
              style={{
                color: "#c8e8c0",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              07871 878682
            </a>
            <a
              href="#contact"
              style={{
                background: G,
                color: "#fff",
                padding: "10px 22px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Free Quote
            </a>
          </div>

          <button
            className="hamburger-btn"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: "#e8f5e3",
              minWidth: 44,
              minHeight: 44,
            }}
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: FOREST,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
            <div style={{ position: "relative", width: 120, height: 44 }}>
              <Image src="/logo.webp" alt="Leaf It Out" fill style={{ objectFit: "contain", objectPosition: "left" }} />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#e8f5e3", padding: 8, minWidth: 44, minHeight: 44 }}
            >
              <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                color: "#e8f5e3",
                fontSize: 28,
                fontWeight: 700,
                textDecoration: "none",
                padding: "18px 0",
                borderBottom: "1px solid rgba(107,191,62,0.12)",
              }}
            >
              {l}
            </a>
          ))}

          <a
            href="tel:+447871878682"
            style={{ color: G, fontSize: 22, fontWeight: 700, textDecoration: "none", marginTop: 40 }}
          >
            07871 878682
          </a>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            style={{
              background: G,
              color: "#fff",
              padding: "18px 32px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              marginTop: 24,
              minHeight: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Get Free Quote
          </a>
        </div>
      )}
    </>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background photo — fills entire hero */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/photo-garden-premium.jpg"
          alt="Landscaping Medway Kent — Leaf It Out"
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
          priority
        />
        {/* Gradient overlay: darker at top for nav readability, lighter mid to show photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,18,5,0.88) 0%, rgba(5,18,5,0.68) 45%, rgba(5,18,5,0.85) 100%)",
          }}
        />
      </div>

      {/* Spinning leaf scene */}
      <ThreeLeafScene accent={G} count={900} />

      {/* Centered content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 860,
          margin: "0 auto",
          padding: "120px 24px 80px",
          textAlign: "center",
        }}
      >
        <div className="hero-eyebrow float-3d" style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <CheckatradeBadge />
        </div>

        <h1
          className="hero-h1"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            marginBottom: 24,
          }}
        >
          Landscaping{" "}
          <span style={{ color: G }}>Medway</span>
          {" & Kent "}
          <span style={{ color: "#c8e8c0", fontWeight: 700 }}>Can Rely On</span>
        </h1>

        <p
          className="hero-sub"
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
            color: "#a8d4a0",
            maxWidth: 580,
            margin: "0 auto 40px",
            lineHeight: 1.75,
          }}
        >
          A family run business with{" "}
          <strong style={{ color: "#e8f5e3" }}>15+ years of experience</strong>{" "}
          transforming driveways, patios and gardens across Medway and Kent.
          Quality craftsmanship. Transparent pricing. Guaranteed results.
        </p>

        <div
          className="hero-cta"
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 56 }}
        >
          <a
            href="#contact"
            style={{
              background: G,
              color: "#fff",
              padding: "16px 36px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              minHeight: 52,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "opacity 0.2s, transform 0.2s",
              boxShadow: `0 8px 32px rgba(107,191,62,0.4)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Free Quote
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#gallery"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#e8f5e3",
              padding: "16px 32px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              minHeight: 52,
              display: "inline-flex",
              alignItems: "center",
              border: `1px solid ${BORDER}`,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            View Our Work
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="hero-stats hero-stats-bar"
          style={{
            justifyContent: "center",
            gap: 0,
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            backdropFilter: "blur(12px)",
            overflow: "hidden",
          }}
        >
          {[
            { val: "15+", label: "Years Experience" },
            { val: "500+", label: "Projects Completed" },
            { val: "5★", label: "Checkatrade Rating" },
          ].map(({ val, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "24px 16px",
                textAlign: "center",
                borderRight: i < 2 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <div style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: G, lineHeight: 1 }}>
                {val}
              </div>
              <div style={{ fontSize: 12, color: "#88b880", marginTop: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  useGsapMarquee(trackRef, 42);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      style={{
        background: G,
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div ref={trackRef} style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}>
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "0 32px",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {item}
              <svg width={5} height={5} viewBox="0 0 5 5" fill="rgba(255,255,255,0.5)">
                <circle cx={2.5} cy={2.5} r={2.5} />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  useCardReveal(".service-card", "#services");

  return (
    <section
      id="services"
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST_MID,
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <ThreeLeafScene accent={G} count={600} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(107,191,62,0.12)",
              border: `1px solid ${BORDER}`,
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: G,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            What We Do
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Our Landscaping Services in Medway
          </h2>
          <p style={{ color: "#88b880", maxWidth: 560, margin: "0 auto", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)" }}>
            From new driveways to complete garden makeovers — we do it all, to the highest standard.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map(({ title, tag, desc, points, photo }) => (
            <div
              key={title}
              className="service-card tilt-card"
              style={{
                background: FOREST_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              {/* Photo header */}
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <Image
                  src={photo}
                  alt={`${title} in Medway Kent`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:767px) 100vw, 50vw"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(10,31,10,0.75) 0%, transparent 55%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: G,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: 100,
                  }}
                >
                  {tag}
                </div>
              </div>

              <div style={{ padding: "28px 28px 32px" }}>
                <h3
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 10,
                  }}
                >
                  {title}
                </h3>
                <p style={{ color: "#88b880", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  {desc}
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {points.map((p) => (
                    <li
                      key={p}
                      style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#c8e8c0" }}
                    >
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 1 }}
                      >
                        <circle cx={8} cy={8} r={7} fill={G} fillOpacity={0.2} />
                        <path d="M5 8l2 2 4-4" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <a
            href="#contact"
            style={{
              background: G,
              color: "#fff",
              padding: "16px 40px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 52,
              boxShadow: `0 8px 32px rgba(107,191,62,0.3)`,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get a Free Quote
            <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section
      id="gallery"
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST,
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <ThreeLeafScene accent={G} count={500} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(107,191,62,0.12)",
              border: `1px solid ${BORDER}`,
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: G,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Our Work
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Recent Projects in Medway & Kent
          </h2>
        </div>

        <div className="gallery-grid">
          {/* Large spanning tile */}
          <div
            style={{
              gridRow: "1 / 3",
              position: "relative",
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${BORDER}`,
              minHeight: 300,
            }}
          >
            <Image
              src={GALLERY[0].photo}
              alt={`${GALLERY[0].title} — Leaf It Out`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width:767px) 100vw, 33vw"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,31,10,0.75) 0%, transparent 45%)",
              }}
            />
            <div style={{ position: "absolute", bottom: 18, left: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{GALLERY[0].title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{GALLERY[0].loc}</div>
            </div>
          </div>

          {/* 4 smaller tiles */}
          {GALLERY.slice(1).map(({ photo, title, loc }) => (
            <div
              key={title}
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${BORDER}`,
                minHeight: 240,
              }}
            >
              <Image
                src={photo}
                alt={`${title} — Leaf It Out landscaping`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width:767px) 100vw, 22vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,31,10,0.7) 0%, transparent 55%)",
                }}
              />
              <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{loc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <a
            href="https://www.facebook.com/leafitoutltd"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: G,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderBottom: `1px solid ${G}`,
              paddingBottom: 2,
            }}
          >
            See more on Facebook
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnScroll(sectionRef as React.RefObject<HTMLElement>);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f0f7ec",
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(107,191,62,0.12)",
              border: "1px solid rgba(107,191,62,0.3)",
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: "#3d7a28",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Our Process
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#0f2d14",
              letterSpacing: "-0.02em",
            }}
          >
            How It Works
          </h2>
        </div>

        <div className="three-col-grid">
          {HOW_STEPS.map(({ num, title, desc, icon }, i) => (
            <div
              key={num}
              className="reveal-up"
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "36px 32px",
                border: "1px solid rgba(107,191,62,0.15)",
                position: "relative",
                transitionDelay: `${i * 0.15}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 28,
                  fontSize: 48,
                  fontWeight: 900,
                  color: "rgba(107,191,62,0.08)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {num}
              </div>
              <div style={{ marginBottom: 20 }}>{icon}</div>
              <h3
                style={{
                  fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                  fontWeight: 700,
                  color: "#0f2d14",
                  marginBottom: 12,
                }}
              >
                {title}
              </h3>
              <p style={{ color: "#4a6b42", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST_MID,
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <ThreeLeafScene accent={G} count={400} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="about-grid"
      >
        {/* Photo */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 420, border: `1px solid ${BORDER}` }}>
          <Image
            src="/photo-pond.jpg"
            alt="Leaf It Out landscaping team — Medway Kent"
            fill
            style={{ objectFit: "cover" }}
            sizes="50vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(10,31,10,0.3) 0%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(10,31,10,0.9) 0%, transparent 70%)",
              padding: "24px",
            }}
          >
            <div style={{ fontSize: 13, color: G, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 4 }}>
              LEAF IT OUT LTD
            </div>
            <div style={{ fontSize: 16, color: "#fff", fontWeight: 600 }}>
              Medway & Kent Landscaping Specialists
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(107,191,62,0.12)",
              border: `1px solid ${BORDER}`,
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: G,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            About Us
          </div>

          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            15 Years Transforming Outdoor Spaces Across Kent
          </h2>

          <p style={{ color: "#88b880", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.75, marginBottom: 20 }}>
            Leaf It Out is a small, family run landscaping business based in Medway. For over 15 years we have been
            transforming gardens, driveways and outdoor spaces across Medway and Kent — building lasting relationships
            with our customers through honest advice, quality workmanship and fair prices.
          </p>

          <p style={{ color: "#88b880", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.75, marginBottom: 32 }}>
            We specialise in driveways, patios and complete garden re-landscaping. Every project is personally
            managed by our team — no subcontractors, no corners cut. Just outstanding results you can be proud of.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {[
              "Family run — no subcontractors",
              "15+ years of local expertise in Medway & Kent",
              "Checkatrade approved & fully vetted",
              "Free quotations with transparent pricing",
            ].map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx={10} cy={10} r={9} fill={G} fillOpacity={0.15} />
                  <path d="M6 10l3 3 5-5" stroke={G} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: "#c8e8c0", fontSize: 14 }}>{point}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#contact"
              style={{
                background: G,
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                minHeight: 48,
                display: "inline-flex",
                alignItems: "center",
                boxShadow: `0 6px 24px rgba(107,191,62,0.3)`,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Free Quote
            </a>
            <a
              href="tel:+447871878682"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#e8f5e3",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                border: `1px solid ${BORDER}`,
                minHeight: 48,
                display: "inline-flex",
                alignItems: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              07871 878682
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceAreas() {
  return (
    <section
      id="areas"
      style={{
        background: "#f0f7ec",
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="about-grid">
          <div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(107,191,62,0.12)",
                border: "1px solid rgba(107,191,62,0.3)",
                borderRadius: 100,
                padding: "6px 18px",
                fontSize: 12,
                fontWeight: 700,
                color: "#3d7a28",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Coverage
            </div>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#0f2d14",
                letterSpacing: "-0.02em",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Landscapers Serving Medway & Kent
            </h2>
            <p style={{ color: "#4a6b42", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.7, marginBottom: 32 }}>
              Based in Medway, we serve customers across the whole county of Kent. Whether you are in Chatham,
              Canterbury or anywhere in between — we can come to you for a free no-obligation quote.
            </p>
            <a
              href="#contact"
              style={{
                background: "#0f2d14",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 48,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Check If We Cover Your Area
            </a>
          </div>

          <div>
            <div className="area-grid">
              {AREAS.map((area) => (
                <div
                  key={area}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(107,191,62,0.15)",
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                    <circle cx={7} cy={7} r={6} fill={G} fillOpacity={0.15} />
                    <path d="M4 7l2 2 4-4" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: 14, color: "#1a3d1a", fontWeight: 500 }}>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(107,191,62,0.1)",
            border: "1px solid rgba(107,191,62,0.25)",
            borderRadius: 100,
            padding: "6px 18px",
            fontSize: 12,
            fontWeight: 700,
            color: "#3d7a28",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Reviews
        </div>
        <h2
          style={{
            fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#0f2d14",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          5-Star Landscapers in Medway & Kent
        </h2>
        <p style={{ color: "#4a6b42", maxWidth: 560, margin: "0 auto 48px", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.7 }}>
          Our reviews are independently verified by Checkatrade. Every customer review is genuine — no hiding behind a polished website.
        </p>

        {/* Review cards */}
        <div className="three-col-grid" style={{ marginBottom: 48, textAlign: "left" }}>
          {[
            {
              name: "Sarah M.",
              loc: "Chatham",
              text: "Absolutely delighted with our new driveway. The team were professional, tidy and finished the job ahead of schedule. Would highly recommend Leaf It Out to anyone in Medway.",
              service: "Block Paving Driveway",
            },
            {
              name: "David T.",
              loc: "Rochester",
              text: "Had our garden completely transformed — new patio, decking and turf. The quality of work is outstanding and the price was very fair. Five stars without question.",
              service: "Garden Landscaping",
            },
            {
              name: "Karen B.",
              loc: "Gillingham",
              text: "From the free quote to the finished patio, the whole experience was brilliant. Honest, hard-working and genuinely lovely people. Will use again for the back garden.",
              service: "Natural Stone Patio",
            },
          ].map(({ name, loc, text, service }) => (
            <div
              key={name}
              style={{
                background: "#f0f7ec",
                borderRadius: 16,
                padding: "28px",
                border: "1px solid rgba(107,191,62,0.15)",
              }}
            >
              <StarRating />
              <p style={{ color: "#1a3d1a", fontSize: 14, lineHeight: 1.7, margin: "14px 0 16px", fontStyle: "italic" }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f2d14" }}>{name}</div>
                  <div style={{ fontSize: 12, color: "#4a6b42" }}>{loc}</div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#3d7a28",
                    fontWeight: 600,
                    background: "rgba(107,191,62,0.12)",
                    padding: "4px 10px",
                    borderRadius: 100,
                  }}
                >
                  {service}
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://www.checkatrade.com/trades/leafitoutlandscapes"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "#0f2d14",
            color: "#fff",
            padding: "16px 36px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            textDecoration: "none",
            minHeight: 52,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
            <circle cx={11} cy={11} r={10} fill="#009E60" />
            <path d="M6 11l4 4 6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Read All Reviews on Checkatrade
        </a>
      </div>
    </section>
  );
}

interface PartnerAd {
  id: number;
  businessName: string;
  description: string;
  logoUrl?: string;
  visitUrl: string;
}

function Partners() {
  const [ads, setAds] = useState<PartnerAd[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetch("https://www.viv-z.com/api/ads")
      .then((response) => response.json())
      .then((data: PartnerAd[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAds(data);
        }
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => setLoaded(true));
  }, []);

  const trackClick = (id: number) => {
    try {
      fetch("https://www.viv-z.com/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id) }),
        keepalive: true,
      });
    } catch (error) {
      // ignore tracking failures
    }
  };

  const displayAds = Array.from({ length: 4 }, (_, index) => ads[index] ?? null);

  return (
    <section
      id="partners"
      style={{
        background: "#0f2d14",
        padding: "clamp(56px, 9vw, 96px) 24px",
        borderTop: `1px solid rgba(107,191,62,0.18)`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 42 }}>
          <div
            style={{
              display: "inline-block",
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: "#a8d4a0",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: `1px solid rgba(107,191,62,0.18)`,
              marginBottom: 16,
            }}
          >
            Trusted Partners
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 14,
            }}
          >
            Partners we proudly showcase
          </h2>
          <p style={{ color: "#a8d4a0", maxWidth: 700, margin: "0 auto", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.75 }}>
            We partner with local businesses who share our commitment to quality, trust and value. Explore the companies we recommend.
          </p>
        </div>

        {loaded && ads.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 28,
              color: "#c8e8c0",
              textAlign: "center",
              maxWidth: 780,
              margin: "0 auto",
            }}
          >
            <p style={{ marginBottom: 12, fontSize: 16, color: "#fff" }}>
              Partners content is on its way.
            </p>
            <p style={{ margin: 0 }}>
              The partner directory is loading from the external feed. If it doesn’t appear, the source may be blocked by your browser or network.
            </p>
          </div>
        ) : (
          <div className="four-col-grid" style={{ gap: 24 }}>
            {displayAds.map((ad, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: 26,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  minHeight: 260,
                  textAlign: "center",
                }}
              >
                {ad ? (
                  <div style={{ display: "flex", justifyContent: "center", minHeight: 100, alignItems: "center", width: "100%" }}>
                    <img
                      src={ad.logoUrl || ""}
                      alt={ad.businessName}
                      style={{ height: 84, objectFit: "contain", maxWidth: "80%" }}
                    />
                  </div>
                ) : (
                  <div style={{ minHeight: 100 }} />
                )}

                {ad ? (
                  <>
                    <p style={{ color: "#c8e8c0", fontSize: 14, lineHeight: 1.75, flex: 1 }}>{ad.description}</p>
                    <a
                      href={ad.visitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick(ad.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        borderRadius: 10,
                        background: G,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "12px 18px",
                        textDecoration: "none",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Visit ↗
                    </a>
                  </>
                ) : (
                  <div
                    style={{
                      height: 120,
                      borderRadius: 16,
                      border: "1px dashed rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9bb98e",
                      fontSize: 13,
                      textAlign: "center",
                      padding: 14,
                    }}
                  >
                    More partners will appear here when the feed is available.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: "#f0f7ec",
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div>
            <div
              style={{
                display: "inline-block",
                background: "rgba(107,191,62,0.12)",
                border: "1px solid rgba(107,191,62,0.3)",
                borderRadius: 100,
                padding: "6px 18px",
                fontSize: 12,
                fontWeight: 700,
                color: "#3d7a28",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Get In Touch
            </div>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#0f2d14",
                letterSpacing: "-0.02em",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Get Your Free Quote Today
            </h2>
            <p style={{ color: "#4a6b42", fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)", lineHeight: 1.7, marginBottom: 32 }}>
              Ready to transform your outdoor space? Get in touch for a free, no-obligation consultation.
              We cover all of Medway and Kent.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <a
                href="tel:+447871878682"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 24px",
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(107,191,62,0.2)",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,191,62,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(107,191,62,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2C6.5 21 1 15.5 1 6a2 2 0 012-2z" stroke={G} strokeWidth={1.5} strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#4a6b42", fontWeight: 600, letterSpacing: "0.04em" }}>CALL US</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f2d14" }}>07871 878682</div>
                </div>
              </a>

              <a
                href="mailto:leafitoutltd@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 24px",
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(107,191,62,0.2)",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,191,62,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(107,191,62,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                    <path d="M2 4h18v14H2V4zm0 0l9 9 9-9" stroke={G} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#4a6b42", fontWeight: 600, letterSpacing: "0.04em" }}>EMAIL US</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f2d14" }}>leafitoutltd@gmail.com</div>
                </div>
              </a>

              <a
                href="https://www.facebook.com/leafitoutltd"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 24px",
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(107,191,62,0.2)",
                  textDecoration: "none",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(107,191,62,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(107,191,62,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                    <path d="M18 2H15a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke={G} strokeWidth={1.5} strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#4a6b42", fontWeight: 600, letterSpacing: "0.04em" }}>FACEBOOK</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0f2d14" }}>Leaf It Out Ltd</div>
                </div>
              </a>
            </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST_MID,
        padding: "clamp(56px, 9vw, 96px) 24px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(107,191,62,0.12)",
              border: `1px solid ${BORDER}`,
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              color: G,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontSize: "clamp(1.7rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Common Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              style={{
                background: FOREST_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <summary
                style={{
                  padding: "20px 24px",
                  fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                  fontWeight: 600,
                  color: "#e8f5e3",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {q}
                <span className="faq-icon" style={{ color: G, flexShrink: 0 }}>
                  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div style={{ padding: "0 24px 20px", color: "#88b880", fontSize: 14, lineHeight: 1.75 }}>
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: FOREST,
        padding: "clamp(64px, 10vw, 112px) 24px",
        textAlign: "center",
      }}
    >
      <ThreeLeafScene accent={G} count={600} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <StarRating />
          <span style={{ color: "#a8d4a0", fontSize: 14, fontWeight: 600 }}>
            Checkatrade Approved · Medway & Kent
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Ready to Transform Your
          <span style={{ color: G, display: "block" }}>Outdoor Space?</span>
        </h2>

        <p style={{ color: "#88b880", fontSize: "clamp(1rem, 1.8vw, 1.2rem)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Get a free, no-obligation quote from Medway&apos;s trusted landscaping specialists.
          We&apos;ll visit your property, listen to your ideas, and provide a transparent quote — at no cost.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <a
            href="#contact"
            style={{
              background: G,
              color: "#fff",
              padding: "18px 40px",
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 800,
              textDecoration: "none",
              minHeight: 56,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 10px 40px rgba(107,191,62,0.4)`,
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Free Quote
            <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="tel:+447871878682"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "#e8f5e3",
              padding: "18px 36px",
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 700,
              textDecoration: "none",
              border: `1px solid ${BORDER}`,
              minHeight: 56,
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            07871 878682
          </a>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {["Free Site Visit", "No Obligation Quote", "15+ Years Experience", "Checkatrade Approved"].map((chip) => (
            <div
              key={chip}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#88b880" }}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <circle cx={7} cy={7} r={6} fill={G} fillOpacity={0.2} />
                <path d="M4 7l2 2 4-4" stroke={G} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {chip}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#050f05",
        padding: "48px 24px 32px",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 40,
            marginBottom: 40,
          }}
          className="three-col-grid"
        >
          <div>
            <div style={{ position: "relative", width: 120, height: 44, marginBottom: 16 }}>
              <Image src="/logo.webp" alt="Leaf It Out Landscaping Medway" fill style={{ objectFit: "contain", objectPosition: "left" }} />
            </div>
            <p style={{ color: "#4a6b42", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>
              Family run landscaping specialists serving Medway and Kent for 15+ years. Driveways, patios & garden landscaping.
            </p>
            <a
              href="tel:+447871878682"
              style={{ color: G, fontSize: 16, fontWeight: 700, textDecoration: "none", display: "block", marginTop: 16 }}
            >
              07871 878682
            </a>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              Services
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Driveways & Block Paving", "Patios & Natural Stone", "Garden Landscaping", "Decking & Fencing", "Water Features", "Drainage Solutions"].map((s) => (
                <span key={s} style={{ color: "#4a6b42", fontSize: 13 }}>{s}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              Areas We Cover
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Landscaping Chatham", "Landscaping Rochester", "Landscaping Gillingham", "Landscaping Maidstone", "Landscaping Sittingbourne", "Landscaping Kent"].map((a) => (
                <span key={a} style={{ color: "#4a6b42", fontSize: 13 }}>{a}</span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 24,
            borderTop: `1px solid rgba(107,191,62,0.1)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ color: "#2a4a2a", fontSize: 12 }}>
            © {new Date().getFullYear()} Leaf It Out Ltd · Landscaping Medway & Kent · 07871 878682
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              href="https://www.facebook.com/leafitoutltd"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4a6b42", fontSize: 12, textDecoration: "none" }}
            >
              Facebook
            </a>
            <a
              href="https://www.checkatrade.com/trades/leafitoutlandscapes"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4a6b42", fontSize: 12, textDecoration: "none" }}
            >
              Checkatrade
            </a>
            <a
              href="https://www.viv-z.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2a4a2a", fontSize: 12, textDecoration: "none" }}
            >
              Built by viv-z
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ClientPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(pageRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    // Scroll reveal for .about-grid on mobile
    const style = document.createElement("style");
    style.textContent = `
      @media (max-width: 767px) {
        .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div ref={pageRef}>
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Gallery />
      <HowItWorks />
      <About />
      <ServiceAreas />
      <Reviews />
      <Partners />
      <Contact />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

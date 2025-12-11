/**
 * PROJECT CONFIGURATION
 * =====================
 * Mounty Yarns - Mount Druitt Interactive Site Plan
 */

// ============================================================================
// PROJECT IDENTITY
// ============================================================================

export const PROJECT_CONFIG = {
  // Basic Info
  name: "Mounty Yarns",
  shortName: "Mounty",
  tagline: "Stories shaping a safer, fairer Mount Druitt",

  // SEO & Metadata
  seo: {
    title: "Mounty Yarns - Interactive Site Plan",
    description: "Mounty Yarns amplifies lived-experience stories and collective solutions shared by Aboriginal young people to create a safer, fairer future for Mount Druitt.",
    keywords: [
      "Mounty Yarns",
      "Mount Druitt",
      "Aboriginal youth",
      "community development",
      "Darug Country",
      "Just Reinvest",
      "interactive map"
    ],
  },

  // Organization
  organization: {
    name: "Just Reinvest NSW",
    abbreviation: "JRNSW",
    website: "https://mounty-yarns.vercel.app",
    email: "mtdruittinfo@justreinvest.org.au",
  },

  // Partners (displayed in footer/about)
  partners: [
    { name: "Just Reinvest NSW", url: "https://justreinvest.org.au" },
    { name: "Mounty Yarns", url: "https://mounty-yarns.vercel.app" },
  ],

  // Support partner (provides energy, hands over control)
  supportedBy: {
    name: "A Curious Tractor",
    url: "https://act.place",
    tagline: "Helping communities get moving",
  },

  // Admin Settings
  admin: {
    password: "mounty2025", // CHANGE THIS FOR PRODUCTION!
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },

  // Local Storage Keys (prefix with project short name)
  storageKeys: {
    aboutModalDismissed: "mounty-about-modal-dismissed",
    adminSession: "mounty-admin-session",
  },

  // Deployment
  deployment: {
    region: "syd1", // Vercel region
    domain: "", // Your custom domain (optional)
  },
} as const;

// ============================================================================
// IMAGE REQUIREMENTS
// ============================================================================

/**
 * REQUIRED IMAGES (must be replaced for new projects):
 *
 * 1. MAP LAYERS (all must be same aspect ratio, WebP format):
 *    - public/images/Photo.webp           → Current state photo (drone/aerial) - "Before"
 *    - public/images/Drawing Colour.webp  → Architectural/concept drawing - "Vision"
 *    - public/images/Sketch.webp          → Hand-drawn sketch layer (optional)
 *    - public/images/Photo-after.webp     → Future vision photo (optional)
 *
 * 2. BRANDING:
 *    - public/images/logo.png             → Your organization logo
 *    - public/images/logo-transparent.png → Logo with transparent background
 *
 * 3. LOCATION IMAGES:
 *    - public/images/locations/[location-id]/ → Folder for each location
 *    - Use the admin panel to upload images after setup
 *
 * IMAGE PROCESSING:
 *    Run `npm run optimize-images` to convert PNG/JPG to optimized WebP
 */

export const MAP_LAYERS = {
  drawing: {
    path: "/images/site-plan.webp",
    label: "Vision",
    description: "Future site development plan",
  },
  sketch: {
    path: "/images/sketch-reference.webp",
    label: "Sketch",
    description: "Design sketch",
  },
  photoBefore: {
    path: "/images/old-site.webp",
    label: "Before",
    description: "Original site photo",
  },
  photoAfter: {
    path: "/images/current-site.webp",
    label: "Current",
    description: "Current site state",
  },
} as const;

export const BRANDING = {
  logo: "/images/logo-transparent.png",
  logoAlt: "/images/logo.png",
  favicon: "/favicon.ico",
} as const;

// ============================================================================
// MAP SETTINGS
// ============================================================================

export const MAP_SETTINGS = {
  // Base dimensions (all map images must match this aspect ratio)
  width: 1920,
  height: 1440,
  aspectRatio: 1920 / 1440, // 4:3

  // Default view
  defaultLayer: 2, // 0=Drawing, 1=Sketch, 2=Photo Before, 3=Photo After - Start with current photo

  // Pin styling
  pins: {
    defaultSize: 32, // pixels
    hoverScale: 1.2,
    colors: {
      building: "bg-blue-500",
      nature: "bg-green-500",
      utility: "bg-orange-500",
      infrastructure: "bg-purple-500",
    },
  },
} as const;

// ============================================================================
// LOCATION TYPES
// ============================================================================

/**
 * Define the types of locations for your project.
 * Each type gets a different colored pin on the map.
 */
export const LOCATION_TYPES = [
  { id: "building", label: "Structures", color: "blue" },
  { id: "nature", label: "Natural Features", color: "green" },
  { id: "utility", label: "Community Spaces", color: "orange" },
  { id: "infrastructure", label: "Infrastructure", color: "purple" },
] as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  // Enable/disable features for your project
  showGalleryPage: true,
  showReportPage: true,
  showWikiPage: true,
  showGrantsPage: false, // Disable for now
  showMediaPage: true,

  // Map features
  showBeforeAfterSlider: true,
  showCompletionTracking: true,
  showTaskLists: true,
  showNotes: true,
  showVideos: true,

  // Admin features
  allowImageUpload: true,
  allowLocationCreate: true,
  allowLocationDelete: true,

  // First-visit modal
  showAboutModal: true,
} as const;

// ============================================================================
// THEME CUSTOMIZATION
// ============================================================================

export const THEME = {
  // Primary colors (Tailwind classes)
  primary: "blue",
  secondary: "slate",
  accent: "emerald",

  // Background
  background: "bg-slate-900",
  surface: "bg-slate-800",

  // Text
  textPrimary: "text-white",
  textSecondary: "text-slate-300",
  textMuted: "text-slate-500",
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ProjectConfig = typeof PROJECT_CONFIG;
export type MapLayer = keyof typeof MAP_LAYERS;
export type LocationType = typeof LOCATION_TYPES[number]["id"];

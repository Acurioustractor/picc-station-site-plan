/**
 * SITE DATA TEMPLATE
 * ==================
 * Copy this file to siteData.ts and customize for your project.
 *
 * INSTRUCTIONS:
 * 1. Update the 'about' section with your project information
 * 2. Replace the example locations with your actual locations
 * 3. Set x,y coordinates to 50,50 initially, then use /admin/pins to position
 * 4. Add images via the admin panel after initial setup
 */

import type { SiteContent } from '@/types';

export const siteData: SiteContent = {
  // =========================================================================
  // ABOUT SECTION
  // =========================================================================
  // This content appears in the About modal on first visit
  // All fields support Markdown formatting

  about: {
    title: "Your Project Title",

    context: `
## Background

Describe the background and context of your project here.

- Key historical point 1
- Key historical point 2
- Why this project matters
    `.trim(),

    site: `
## The Site

Describe the physical location:

- Where it is located
- Size and boundaries
- Key features
- Current condition
    `.trim(),

    project: `
## The Project

What you're building/developing:

- Main objectives
- Key deliverables
- Timeline overview
- Expected outcomes
    `.trim(),

    partnership: `
## Partners & Stakeholders

Who's involved:

- **Lead Organization**: Description
- **Partner 1**: Their role
- **Partner 2**: Their role
- **Community**: How they're engaged
    `.trim(),

    impact: `
## Expected Impact

What success looks like:

1. **Impact Area 1**: Description
2. **Impact Area 2**: Description
3. **Impact Area 3**: Description
    `.trim(),
  },

  // =========================================================================
  // LOCATIONS
  // =========================================================================
  // Each location appears as a pin on the map
  // The 'id' must be URL-safe and match the folder name in public/images/locations/

  locations: [
    // -----------------------------------------------------------------------
    // EXAMPLE LOCATION 1 - Building
    // -----------------------------------------------------------------------
    {
      id: "main-building",
      x: 50,  // Position as percentage (0-100) from left
      y: 50,  // Position as percentage (0-100) from top
      title: "Main Building",
      type: "building",
      description: "The primary structure on the site",

      overview: `
### Current State

Describe what exists now:
- Current condition
- Size/dimensions
- Current use
      `.trim(),

      futureScope: `
### Future Plans

What's planned:
- Renovations
- New uses
- Timeline
      `.trim(),

      // Images are typically added via admin panel, but you can pre-populate:
      images: [],

      // Video embeds (YouTube or Vimeo)
      videos: [],

      // Completion tracking (0-100)
      completionPercentage: 0,

      // Task list for this location
      tasks: [
        {
          id: "task-1",
          title: "Example task",
          description: "Description of what needs to be done",
          status: "not-started", // not-started, in-progress, completed
          order: 1,
        },
      ],

      // Notes (categorized)
      notes: [],
    },

    // -----------------------------------------------------------------------
    // EXAMPLE LOCATION 2 - Natural Feature
    // -----------------------------------------------------------------------
    {
      id: "garden-area",
      x: 30,
      y: 70,
      title: "Garden Area",
      type: "nature",
      description: "Community garden and green space",
      overview: "Current landscaping description...",
      futureScope: "Plans for the garden...",
      images: [],
      videos: [],
      completionPercentage: 0,
      tasks: [],
      notes: [],
    },

    // -----------------------------------------------------------------------
    // EXAMPLE LOCATION 3 - Infrastructure
    // -----------------------------------------------------------------------
    {
      id: "main-entry",
      x: 80,
      y: 40,
      title: "Main Entry",
      type: "infrastructure",
      description: "Primary site access point",
      overview: "Current entry description...",
      futureScope: "Plans for the entry...",
      images: [],
      videos: [],
      completionPercentage: 0,
      tasks: [],
      notes: [],
    },

    // -----------------------------------------------------------------------
    // ADD MORE LOCATIONS HERE
    // -----------------------------------------------------------------------
    // Copy the template above and customize for each location on your site
  ],
};

// =========================================================================
// TYPE REFERENCE
// =========================================================================
// Location types determine pin colors:
//   - building:       Blue pin
//   - nature:         Green pin
//   - utility:        Orange pin
//   - infrastructure: Purple pin
//
// Task statuses:
//   - not-started: Not yet begun
//   - in-progress: Currently being worked on
//   - completed:   Done
//
// Note categories:
//   - update:     Progress updates
//   - challenge:  Issues/blockers
//   - contact:    People/contacts
//   - resource:   Links/resources
//   - idea:       Future ideas
//   - other:      Miscellaneous

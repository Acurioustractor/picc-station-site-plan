import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { siteDataSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const { locations } = await request.json();

    // Validate the data with Zod
    try {
      siteDataSchema.parse({ locations });
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable structure
        const formattedErrors = error.issues?.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })) || [];

        console.error('Validation errors:', formattedErrors);

        return NextResponse.json(
          {
            error: 'Validation failed',
            details: formattedErrors,
            message: `Found ${formattedErrors.length} validation error(s). Please check your data.`
          },
          { status: 400 }
        );
      }
      throw error; // Re-throw if it's not a ZodError
    }

    // Generate the TypeScript file content
    const content = `import { SiteContent } from '@/types';

export const siteData: SiteContent = {
  about: {
    title: "Palm Island–Townsville Circular Economy & Youth Pathways Precinct",
    context: \`The **PICC Station Precinct** is a site in Townsville held under a new **30-year lease** by the **Palm Island Community Company (PICC)**.

For decades, this land has had many lives—first as a youth services facility, then privately managed and lived on for 30 years, and now returned to community hands. The site currently sits "fallow"—overgrown and in need of deep cleaning—but the "bones" of the property are strong, waiting to be cultivated into something regenerative.\`,

    site: \`The physical site is a mix of potential and challenge. It requires significant "weeding" (clean-up and security) before the new crop can be planted.

**Key Infrastructure:**

- **The Structures:** Includes a commercial **kitchen block** (ripe for reactivation), **two liveable houses**, large **work sheds**, and a series of historical **train carriages** (some damaged by mould, others potentially salvageable for storytelling).
- **The Land:** Features a **creek and lagoon system** that was once a pumped water feature with an orchard—a system that can be revived to bring water and life back to the landscape.
- **Current State:** It is currently unsecured with issues of hoarding and overgrowth. Immediate actions involve securing the gate, establishing a caretaker, and bringing in a bobcat/slasher to clear the scrub.\`,

    project: \`The vision is to transform this neglected site into a thriving **regional hub** that acts as a bridge between Townsville and Palm Island. It is designed not just as a facility, but as an ecosystem of training, industry, and culture.

**Core Pillars of the Master Plan:**

1. **Goods Manufacturing & Circular Economy:**
    - A dedicated **Goods Workshop** to manufacture recycled-plastic bed bases and refurbish washing machines.
    - Creating a closed-loop system where waste is diverted from landfill and turned into essential items for the region.
2. **Youth Justice & Pathways:**
    - A safe, transformative space for young people, particularly from Palm Island.
    - Focus on diversionary programs (partnering with Diagrama) and real-world skills training (construction, manufacturing).
    - **"Learning by Doing":** Young people will help build the site itself—constructing modular tiny homes and repairing infrastructure.
3. **Accommodation & Hospitality:**
    - Revitalising the kitchen for catering and hospitality training.
    - Providing short-stay accommodation for visiting trainees and mentors.\`,

    partnership: \`**PICC (Palm Island Community Company)** is the lead steward (leaseholder and applicant), but the approach is deeply collaborative—working *with* community rather than just *for* them.

- **The Stewards:** PICC, leading with a focus on Indigenous health, wellbeing, and youth justice.
- **The Partners:** A coalition including the Palm Island Aboriginal Shire Council (PIASC), Townsville City Council, Traditional Owners (Manbarra), and **A Curious Tractor** (helping with program design and delivery).
- **The Goal:** To secure funding through the federal **regional Precincts and Partnerships Program (rPPP)** (Stream Two), aiming for investment-ready status by March 2027.\`,

    impact: \`This project is designed to ensure value flows *back* to the community.

- **Social:** Reducing youth re-offending through meaningful pathways and connection to Country.
- **Economic:** Creating local jobs and micro-enterprises (repairers, makers).
- **Environmental:** Diverting waste and demonstrating sustainable building practices (solar, water reuse).

The soil is tough right now, but the roots of this project are finding their way down. It's a move from "maintenance" to **regeneration**—building a place where young people and the land can grow strong together.\`
  },

  locations: ${JSON.stringify(locations, null, 4)}
};
`;

    // Write to siteData.ts
    const filepath = path.join(process.cwd(), 'lib', 'siteData.ts');
    await writeFile(filepath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

// Static default report - this is the canonical version that appears for all visitors
export interface ReportSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'quote' | 'stats' | 'hero' | 'divider' | 'map-link' | 'image-gallery';
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  author?: string;
  locationId?: string;
  layout?: 'full' | 'center' | 'left' | 'right';
  stats?: { label: string; value: string }[];
  images?: string[];
  imagePosition?: number; // 0-100 percentage for vertical position (0=top, 50=center, 100=bottom)
}

export interface Report {
  title: string;
  subtitle: string;
  heroImage?: string;
  heroImagePosition?: number; // 0-100 percentage for vertical position (0=top, 50=center, 100=bottom)
  sections: ReportSection[];
}

export const defaultReport: Report = {
  title: 'The Centre - Site Activation Report',
  subtitle: 'From Neglect to Activation: A Story of Community-Led Transformation',
  heroImage: '/images/locations/media-library/1764888823805-DJI-0409.jpg',
  sections: [
    // ===== SECTION 1: OPENING CONTEXT =====
    {
      id: 'section-1',
      type: 'text',
      content: `# The Vision

**The Centre** is a site in Townsville held under a new **30-year lease** by the **Palm Island Community Company (PICC)**.

For decades, this land has had many lives—first as a youth services facility, then privately managed and lived on for 30 years, and now returned to community hands. The site currently sits "fallow"—overgrown and in need of deep cleaning—but the "bones" of the property are strong, waiting to be cultivated into something regenerative.

The vision is to transform this neglected site into a thriving **regional hub** that acts as a bridge between Townsville and Palm Island. It is designed not just as a facility, but as an ecosystem of training, industry, and culture.

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
    - Providing short-stay accommodation for visiting trainees and mentors.`,
      layout: 'center'
    },
    {
      id: 'section-2',
      type: 'stats',
      stats: [
        { label: 'Locations Documented', value: '17' },
        { label: 'Areas Fully Complete', value: '4' },
        { label: 'Tasks Completed', value: '24/42' },
        { label: 'Photos & Videos', value: '165' }
      ],
      layout: 'center'
    },
    {
      id: 'section-3',
      type: 'video',
      videoUrl: 'https://share.descript.com/view/naU3OENJuxx',
      caption: 'Shaun on Palm - Shaun Cristis-David discusses the opportunity at Palm Island',
      layout: 'full'
    },
    {
      id: 'section-4',
      type: 'quote',
      content: "You wouldn't dare pick that up before - so much junk you couldn't start. Now you can. It's a pleasure to walk around now.",
      layout: 'center'
    },

    // ===== SECTION 2: THE TRANSFORMATION BEGINS =====
    {
      id: 'section-5',
      type: 'divider',
      content: 'The Transformation',
      layout: 'center'
    },
    {
      id: 'section-6',
      type: 'text',
      content: `In December 2024, a remarkable transformation began at The Centre. What started as an overgrown, neglected property became a beacon of possibility through the dedicated work of young people from Palm Island, guided by Rachel Atkinson (PICC CEO) and the team from A Curious Tractor.

**Key Achievements:**
- 6 trailer loads + 3 skips of rubbish removed
- Two houses cleaned and made liveable
- All buildings secured with new locks
- New underground power and switchboards installed
- Young people engaged and enthusiastic to return
- Site transformed from overgrown/unsafe to accessible`,
      layout: 'center'
    },
    {
      id: 'section-7',
      type: 'text',
      content: `### Take a Walk Through The Centre

This 3-minute video tour shows the complete transformation. Walk through every area of the site - from the secured entrance to the restored houses, commercial kitchen, work sheds, and community spaces. Scrub through to explore at your own pace.`,
      layout: 'center'
    },
    {
      id: 'section-8',
      type: 'video',
      videoUrl: 'https://share.descript.com/view/5MFpRpqsESd',
      caption: 'Full site walkthrough - December 2024',
      layout: 'full'
    },
    {
      id: 'section-9',
      type: 'hero',
      imageUrl: '/images/locations/main-entry/1764819393583-1E5A7965.jpg',
      caption: 'Main Entry & Gate - Security Now Established',
      layout: 'full'
    },
    {
      id: 'section-10',
      type: 'text',
      content: `## Site Security Transformation

Before: The gate was an absolute shambles—open for years, overgrown, and unsecured. People had been trespassing regularly.

After: New underground power installed. Switchboards in both houses have been replaced. The entire site now has secure power supply. Gate area cleared and secured with new locks on all buildings.`,
      layout: 'center'
    },

    // ===== SECTION 3: COMPLETED AREAS =====
    {
      id: 'section-11',
      type: 'divider',
      content: 'Completed Areas',
      layout: 'center'
    },
    {
      id: 'section-12',
      type: 'image-gallery',
      images: [
        '/images/locations/house-2/1764819062153-1E5A8000.jpg',
        '/images/locations/house-2/1764819062155-1E5A8003.jpg',
        '/images/locations/house-2/1764819062156-1E5A7999.jpg',
        '/images/locations/house-2/1764819062157-1E5A8001.jpg',
        '/images/locations/house-2/1764975045619-IMG-3878.jpg',
        '/images/locations/house-2/1764975053933-IMG-3872.jpg'
      ],
      caption: 'House 2 - Training Facility Ready (100% Complete)',
      layout: 'full'
    },
    {
      id: 'section-13',
      type: 'text',
      content: `## House 2: Training Facility Ready

Fully cleaned and restored. Deep clean completed, all rubbish removed, floors mopped, windows cleaned. Ready for furnishing as a training accommodation facility. New power connected with replaced switchboard.

**Completed Work:**
- Deep cleaning and furniture removal
- Floors mopped and windows cleaned
- New locks installed
- Power connection and switchboard replacement

This house is ready for the next phase: furnishing and activation as accommodation for visiting trainees.`,
      layout: 'center'
    },
    {
      id: 'section-14',
      type: 'map-link',
      content: 'View House 2 on the interactive map with all progress details.',
      locationId: 'house-2',
      layout: 'center'
    },
    {
      id: 'section-15',
      type: 'hero',
      imageUrl: '/images/locations/yarning-circle/1764821643741-1E5A7944.jpg',
      caption: 'Yarning Circle - From Dump to Community Space (100% Complete)',
      layout: 'full'
    },
    {
      id: 'section-16',
      type: 'text',
      content: `## Yarning Circle: A Transformation Story

Was completely covered in rubbish/dump. Now fully restored by young people - all rubbish cleared, raking completed, trees removed, broken fence removed, new stairs installed. Significant transformation from dump to usable community space.

This represents one of the most dramatic transformations on site. The young people led this restoration, demonstrating what's possible when given the opportunity.

**This space now stands ready as a cultural gathering point for yarning, connection, and community programs.**`,
      layout: 'center'
    },
    {
      id: 'section-17',
      type: 'image-gallery',
      images: [
        '/images/locations/kitchen-block/1764818371215-1E5A7950.jpg',
        '/images/locations/kitchen-block/1764974694019-1E5A7500.jpg',
        '/images/locations/kitchen-block/1764974710808-1E5A8075.jpg',
        '/images/locations/kitchen-block/1764974765640-1E5A8032.jpg',
        '/images/locations/kitchen-block/1764974885759-20250929-R0005478.jpg',
        '/images/locations/kitchen-block/1764975035548-IMG-3904.jpg'
      ],
      caption: 'Commercial Kitchen Block - Deep Cleaned and Ready',
      layout: 'full'
    },
    {
      id: 'section-18',
      type: 'quote',
      content: 'This is a huge opportunity for Shaun Cristis-David and Crabba\'s catering/hospitality training programs. Need to bring Shaun through for full assessment of equipment needs.',
      author: 'Rachel Atkinson',
      layout: 'center'
    },
    {
      id: 'section-19',
      type: 'text',
      content: `## The Kitchen: Heart of Community Enterprise

The kitchen block represents a key opportunity for youth hospitality training. Currently unused but structurally sound, this facility can become the heart of catering operations and food service training programs.

**Partnership Opportunity:** Partnership exploration underway with Shaun Cristis-David for catering/hospitality training integration.

Plans include full kitchen equipment installation, commercial certification, and integration with accommodation services to provide real-world hospitality training experiences.`,
      layout: 'center'
    },
    {
      id: 'section-20',
      type: 'image',
      imageUrl: '/images/locations/garage-and-caged-area/1764821599639-1E5A7985.jpg',
      caption: 'Garage & Caged Area - Secured and Ready for Storage',
      layout: 'center'
    },

    // ===== SECTION 4: IN PROGRESS AREAS =====
    {
      id: 'section-21',
      type: 'divider',
      content: 'In Progress',
      layout: 'center'
    },
    {
      id: 'section-22',
      type: 'video',
      videoUrl: 'https://share.descript.com/view/2vpxeiOPcLe',
      caption: 'Walking through The Centre - seeing the progress firsthand',
      layout: 'full'
    },
    {
      id: 'section-23',
      type: 'image-gallery',
      images: [
        '/images/locations/house-1/1764818696712-1E5A7949.jpg',
        '/images/locations/house-1/1764818719411-1E5A8015.jpg',
        '/images/locations/house-1/1764974803259-1E5A8013.jpg',
        '/images/locations/house-1/1764975121099-20250929-R0005474.jpg'
      ],
      caption: 'House 1 - Caretaker Residence (80% Complete)',
      layout: 'full'
    },
    {
      id: 'section-24',
      type: 'quote',
      content: 'Tyrone (Rachel\'s brother) is the planned caretaker. His presence will provide ongoing security and site management. Rachel suggests keeping one house for caretaker, one for training accommodation.',
      author: 'Rachel Atkinson',
      layout: 'center'
    },
    {
      id: 'section-25',
      type: 'text',
      content: `## House 1: A Home for the Caretaker

Second house on site, intended for caretaker residence. Most cleaning done, needs final touches. Has been more recently lived in than House 2. Power connected with new switchboard.

Tyrone (Rachel's brother) identified as potential caretaker - would provide ongoing security and site management.

**Remaining Work:**
- Final deep clean
- Paint interior
- Furnish for caretaker residence`,
      layout: 'center'
    },
    {
      id: 'section-26',
      type: 'map-link',
      content: 'See the detailed progress on House 1.',
      locationId: 'house-1',
      layout: 'center'
    },
    {
      id: 'section-27',
      type: 'image-gallery',
      images: [
        '/images/locations/work-sheds/1764819216434-1E5A7995.jpg',
        '/images/locations/work-sheds/1764819216437-1E5A7993.jpg',
        '/images/locations/work-sheds/1764819216438-1E5A7992.jpg',
        '/images/locations/work-sheds/1764975096054-IMG-2464.jpg'
      ],
      caption: 'Work Sheds - Future Manufacturing Hub (60% Complete)',
      layout: 'full'
    },
    {
      id: 'section-28',
      type: 'quote',
      content: 'Incredible find: still-working Tonka trucks found during cleanup. Perfect toys for kids, emblematic of the hidden value in the "rubbish".',
      layout: 'center'
    },
    {
      id: 'section-29',
      type: 'text',
      content: `## Work Sheds: Manufacturing & Circular Economy

Large work sheds with significant potential for manufacturing operations. Contains some old equipment and stored items. Key infrastructure for the circular economy programs - recycled plastic bed bases, washing machine refurbishment.

Initial sorting done, more clearing needed to assess full potential. Structure sound and ready for workshop fit-out.

Future manufacturing hub for recycled-plastic bed bases, washing machine refurbishment, and youth skills training in construction and repair.`,
      layout: 'center'
    },

    // ===== SECTION 5: FUTURE OPPORTUNITIES =====
    {
      id: 'section-30',
      type: 'divider',
      content: 'Future Opportunities',
      layout: 'center'
    },
    {
      id: 'section-31',
      type: 'image-gallery',
      images: [
        '/images/locations/train-carriages/1764819243393-1E5A7971.jpg',
        '/images/locations/train-carriages/1764819243396-1E5A7970.jpg',
        '/images/locations/train-carriages/1764819243397-1E5A7968.jpg',
        '/images/locations/train-carriages/1764819243431-1E5A7974.jpg',
        '/images/locations/train-carriages/1764819243432-1E5A7972.jpg',
        '/images/locations/train-carriages/1764819243435-1E5A7973.jpg'
      ],
      caption: 'Historic Train Carriages - Heritage & Learning Opportunity',
      layout: 'full'
    },
    {
      id: 'section-32',
      type: 'quote',
      content: 'Renovate, knock down, or build new? Strong argument for keeping due to history and character. Terry has stories about how they got here.',
      layout: 'center'
    },
    {
      id: 'section-33',
      type: 'text',
      content: `## Train Carriages: Heritage Decisions Ahead

Historic train carriages that have been on site for decades. Previously used as accommodation/offices. One carriage has severe mould damage (back section), others are more salvageable. Strong historical significance and community memory.

A decision looms: renovate, remove, or build new? There's a strong argument for keeping them due to their history and character.

Potential for unique accommodation or creative spaces, but requires careful assessment of structural integrity and restoration costs.`,
      layout: 'center'
    },
    {
      id: 'section-34',
      type: 'hero',
      imageUrl: '/images/locations/theatre--studio/1764821381171-1E5A7981.jpg',
      caption: 'Theatre/Studio - Untapped Creative Potential',
      layout: 'full'
    },
    {
      id: 'section-35',
      type: 'text',
      content: `## Theatre/Studio: Creative Potential Awaits

Amazing space currently untouched. Covered items preserved with donated laundromat sheets (10 years old, still good). Great character with historic significance.

Historic laundromat sheet covers preserved (10 years old, still good). Terry's old sewing room sign still present. Great character and community memory.

Multi-purpose community space for training workshops, movie theatre, performance space, and creative programs.`,
      layout: 'center'
    },
    {
      id: 'section-36',
      type: 'image',
      imageUrl: '/images/locations/pool/1764821198783-1E5A8025.jpg',
      caption: 'Pool - Next Priority Recreation Project',
      layout: 'left'
    },
    {
      id: 'section-37',
      type: 'image',
      imageUrl: '/images/locations/creek-lagoon/1764819371471-1E5A7996.jpg',
      caption: 'Dam - Environmental Education & Horticulture',
      layout: 'right'
    },
    {
      id: 'section-38',
      type: 'text',
      content: `## Recreation & Environmental Assets

**Pool:** In-ground pool that will be a priority restoration project. Provides recreation and potential water safety training. Needs assessment and likely significant restoration work.

**Dam & Water System:** Dam/lagoon that was once fed by a pumped water system from the creek. Previously supported an orchard. System can be revived for horticultural education and food production.

These areas represent significant opportunities for youth engagement, environmental education, and community recreation.`,
      layout: 'center'
    },
    {
      id: 'section-39',
      type: 'image-gallery',
      images: [
        '/images/locations/adventure-park/1764821243957-1E5A7954.jpg',
        '/images/locations/adventure-park/1764821244094-1E5A7956.jpg',
        '/images/locations/adventure-park/1764821244128-1E5A7955.jpg',
        '/images/locations/adventure-park/1764821245120-1E5A7957.jpg'
      ],
      caption: 'Adventure Park - Waiting to be Uncovered',
      layout: 'full'
    },
    {
      id: 'section-40',
      type: 'text',
      content: `## Adventure Park: Youth-Led Restoration

Overgrown adventure playground area. Equipment buried under vegetation - needs slashing and assessment. Once cleared, could provide recreation for youth programs.

Potentially significant equipment hidden under growth including possible flying fox, play equipment.

Like the Yarning Circle, this represents another opportunity for young people to lead restoration work.`,
      layout: 'center'
    },

    // ===== SECTION 6: YOUNG PEOPLE =====
    {
      id: 'section-41',
      type: 'divider',
      content: 'Young People Leading Change',
      layout: 'center'
    },
    {
      id: 'section-42',
      type: 'quote',
      content: 'They were pumped. They want to come back. They did amazing work.',
      layout: 'center'
    },
    {
      id: 'section-43',
      type: 'text',
      content: `## The Real Success: Young People Leading Change

The young people from Palm Island weren't just participants - they were the driving force. They completed the cleanup work on the same day as the site visit, demonstrating incredible dedication and capability.

They learned skills in:
- Property maintenance and cleaning
- Basic construction (stairs, fencing)
- Teamwork and project coordination
- Pride in meaningful work

**Most importantly: they want to come back.**

This engagement proves the model works. When given the opportunity, young people rise to the challenge and create real, lasting change.`,
      layout: 'center'
    },

    // ===== SECTION 7: PARTNERSHIP =====
    {
      id: 'section-44',
      type: 'divider',
      content: 'Partnership & Impact',
      layout: 'center'
    },
    {
      id: 'section-45',
      type: 'text',
      content: `## Partnership Model

**PICC (Palm Island Community Company)** is the lead steward (leaseholder and applicant), but the approach is deeply collaborative—working *with* community rather than just *for* them.

- **The Stewards:** PICC, leading with a focus on Indigenous health, wellbeing, and youth justice.
- **The Partners:** A coalition including the Palm Island Aboriginal Shire Council (PIASC), Townsville City Council, Traditional Owners (Manbarra), and **A Curious Tractor** (helping with program design and delivery).
- **The Goal:** To secure funding through the federal **regional Precincts and Partnerships Program (rPPP)** (Stream Two), aiming for investment-ready status by March 2027.`,
      layout: 'center'
    },
    {
      id: 'section-46',
      type: 'text',
      content: `## Expected Impact

This project is designed to ensure value flows *back* to the community.

- **Social:** Reducing youth re-offending through meaningful pathways and connection to Country.
- **Economic:** Creating local jobs and micro-enterprises (repairers, makers).
- **Environmental:** Diverting waste and demonstrating sustainable building practices (solar, water reuse).

The soil is tough right now, but the roots of this project are finding their way down. It's a move from "maintenance" to **regeneration**—building a place where young people and the land can grow strong together.`,
      layout: 'center'
    },

    // ===== SECTION 8: LOOKING FORWARD =====
    {
      id: 'section-47',
      type: 'divider',
      content: 'Looking Forward',
      layout: 'center'
    },
    {
      id: 'section-48',
      type: 'text',
      content: `## Roadmap to Investment-Ready (March 2027)

**Immediate Priorities (1-3 months)**
- Finalise caretaker arrangement with Tyrone
- Furnish both houses for accommodation
- Kitchen equipment assessment with Shaun Cristis-David
- Paint houses
- Theatre/studio initial cleanup

**Medium Term (3-6 months)**
- Train carriage assessment and decision
- Commercial kitchen fit-out planning
- Workshop equipment planning
- Adventure park restoration
- First youth training programs

**Long Term (6-12 months)**
- Full hospitality training program (kitchen)
- Manufacturing/circular economy workshops
- Accommodation for visiting trainees
- Pool restoration
- Horticultural programs (dam/orchard revival)

The goal: **investment-ready status by March 2027** through the regional Precincts and Partnerships Program (rPPP) Stream Two.`,
      layout: 'center'
    },
    {
      id: 'section-49',
      type: 'quote',
      content: "The young people's engagement and pride in the transformation. They want to return, they're capable, and they're ready for the next phase.",
      layout: 'center'
    },
    {
      id: 'section-50',
      type: 'video',
      videoUrl: 'https://share.descript.com/view/SGQt6jIZPOv',
      caption: 'Aerial view of The Centre - the transformation from above',
      layout: 'full'
    },
    {
      id: 'section-51',
      type: 'text',
      content: `## The Journey Continues

From neglected to activated. From impossible to accessible. From "you wouldn't dare pick that up" to "it's a pleasure to walk around."

This is just the beginning. The Centre now stands ready - secure, clean, and waiting - for the next chapter in its remarkable story of regeneration, connection, and community-led transformation.

---

*Report prepared by A Curious Tractor in partnership with Palm Island Community Company (PICC)*`,
      layout: 'center'
    }
  ]
};

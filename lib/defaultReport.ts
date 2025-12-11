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
  title: 'Mounty Yarns - Site Development',
  subtitle: 'A Safe Place Where Young People Can Just Be Kids',
  heroImage: '/images/old-site.webp',
  sections: [
    // ===== SECTION 1: INTRODUCTION =====
    {
      id: 'section-1',
      type: 'text',
      content: `# What is Mounty Yarns?

**Home.** It brings everyone together. We're all from different places, but close. Mount Druitt is home for a lot of us—non-Indigenous people and Indigenous people. It's really diverse, got a lot of nationalities.

Before we had this space, a lot of young people didn't really have somewhere to go. We just needed a **safe place where young Black lives can hang around** and not be seen as consorting, like criminals or up to no good all the time.

We just wanted to hang around sometimes—play football, just kick back with each other. It was like a family thing.`,
      layout: 'center'
    },
    {
      id: 'section-2',
      type: 'quote',
      content: "It's almost like a second home. Even a first home for some kids. They can actually come here and just be themselves, express their feelings, or they can just come in and be kids.",
      author: "Mounty Yarns Team Member",
      layout: 'center'
    },
    {
      id: 'section-3',
      type: 'stats',
      stats: [
        { label: 'Team Size', value: '20+' },
        { label: 'Programs Running', value: '10+' },
        { label: 'Years Growing', value: '3' },
        { label: 'Status', value: 'Building' }
      ],
      layout: 'center'
    },

    // ===== SECTION 2: HOW IT STARTED =====
    {
      id: 'section-4',
      type: 'divider',
      content: 'How It Started',
      layout: 'center'
    },
    {
      id: 'section-5',
      type: 'text',
      content: `## Youth Ambassadors Leading Change

It started with youth ambassadors who spoke to funders and politicians and got their story out—about how policies and procedures affected them.

We had a lot of people behind us... Daniel, Nick, De, Sarah, Jess and Julie. People who **believed in us**.

Funders and politicians were blown away by the young people saying something that had never been said before. That perspective being available to them made a lot of people get behind this—having young people leading it.

**From one person to a team of 20 in three years.**`,
      layout: 'center'
    },

    // ===== SECTION 3: THE DIFFERENCE =====
    {
      id: 'section-6',
      type: 'divider',
      content: 'The Difference',
      layout: 'center'
    },
    {
      id: 'section-7',
      type: 'text',
      content: `## Why This Works

If you gave kids the option between a case meeting and here, they'll come here. They feel a lot more safer. Their voice is actually heard.

If you go to a case officer at DCJ, it's just them telling the kid what to do—that authority thing. Sometimes you get a caseworker who doesn't care, just wants a paycheck. They don't have that kid's best interest at heart.

But here? **We make sure the kid's heard.** People here hold systems to account. They're really for young people.

In a lot of systems you have to fit into a very neat category—have a charge, be over 12 years old. Here, **we want to help when help is needed.**`,
      layout: 'center'
    },
    {
      id: 'section-8',
      type: 'quote',
      content: "Any young person that comes through the door, someone will try and help, even if it's not their job or we're not funded for it. We just try to help. It's just what Mounty was like for us growing up. You just pay it forward as you get older.",
      author: "Mounty Yarns Team Member",
      layout: 'center'
    },

    // ===== SECTION 4: PROGRAMS =====
    {
      id: 'section-9',
      type: 'divider',
      content: 'What We Do',
      layout: 'center'
    },
    {
      id: 'section-10',
      type: 'text',
      content: `## Programs & Training

**Weekly Programs:**
- Youth on Track
- Cultural Days
- Boxing Fridays
- Girls Program Wednesdays
- Cooking Programs
- Digital Art
- Gym Program
- Driver Licensing

**Sports & Community:**
- AAG Football
- Men's Knockout Team
- Arts in Schools
- Under 16 Girls Team

**Enterprise & Training:**
- Mounty Arms training
- Barista training
- Garden produce cooking
- Bike repair workshop

The kids love us going into the schools. We're good role models. Most of us didn't have positive role models growing up, but now when we step into schools, kids really look up to us and listen.`,
      layout: 'center'
    },

    // ===== SECTION 5: THE SPACE =====
    {
      id: 'section-11',
      type: 'divider',
      content: 'The Space',
      layout: 'center'
    },
    {
      id: 'section-12',
      type: 'text',
      content: `## What We're Building

The site sat empty for so long, but now the first bit has been dug up. We can't wait.

**What Success Looks Like:**
I just want to be able to see the kids look at it and say "they done that—they helped do that." A good spot where it gets utilised. Kids in there playing. Kids saying "I helped with this garden" or "we chose this" or "we done this artwork."

**Something the youth can be proud of. And then we can be proud to say—look, we helped put this here for our community.**

**Planned Elements:**
- **Yarning Circle** — "That's where everyone comes together"
- **Half Court** — Basketball for the kids
- **Garden** — Use what they grow to cook and feed the community
- **Container Spaces** — For programs and just being together
- **Fire Pit** — For gathering and connection
- **Mesh Screening** — Privacy so kids feel safe`,
      layout: 'center'
    },
    {
      id: 'section-13',
      type: 'map-link',
      content: 'Explore the interactive map to see all planned locations.',
      locationId: 'yarning-circle',
      layout: 'center'
    },

    // ===== SECTION 6: THE BIGGER VISION =====
    {
      id: 'section-14',
      type: 'divider',
      content: 'The Bigger Vision',
      layout: 'center'
    },
    {
      id: 'section-15',
      type: 'text',
      content: `## More Spaces, More Kids Being Kids

The more of these spaces pop up around Australia, the better. You'll get kids coming back being kids again. Instead of having to be a "fully grown gangster" by 15 or 16, kids can just be kids.

There's places like Moree, Alice Springs, Dubbo that need something like this. The best thing about those places is they're still connected with Country. We hunt Woolies over here—but those kids can go out hunting, fishing, connecting.

**If we can work out how to do this, we'd be keen to help others build their own spaces.**`,
      layout: 'center'
    },
    {
      id: 'section-16',
      type: 'quote',
      content: "The more of these pop up, the better. Hopefully things keep getting better. Kids being kids again.",
      author: "Mounty Yarns Team Member",
      layout: 'center'
    },
    {
      id: 'section-17',
      type: 'text',
      content: `## Partnership

**Just Reinvest NSW** leads the Mounty Yarns initiative, working alongside Aboriginal young people and community partners.

**Partners include:**
- IAG (driver licensing funding)
- Local art galleries
- Schools across Mount Druitt
- Community Elders

**Getting Things Moving:**
[A Curious Tractor](https://act.place) provides support to help communities build spaces like this—energy when it's needed, then stepping back so you can take the wheel. Like a PTO: power on tap, control always yours.

---

*Mounty Yarns acknowledges the Darug people and the many Nations who call Mount Druitt home.*

*Contact: mtdruittinfo@justreinvest.org.au*`,
      layout: 'center'
    }
  ]
};

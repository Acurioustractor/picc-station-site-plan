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
  title: 'Backyard Activation Report',
  subtitle: 'Dec 9–10, 2024 — What happened, what it means, and how it strengthens the case for support',
  heroImage: '/images/old-site.webp',
  sections: [
    // ===== OVERVIEW =====
    {
      id: 'section-overview',
      type: 'text',
      content: `# Infrastructure for Belonging

The "day in the yard" was not a tidy construction milestone. It was an act of **community governance, youth ownership, and visible proof** that Mounty is building a *real place* where young people can lead, learn, and host others on their own terms.

The backyard activation is not "an improvement project." It is **infrastructure for belonging**, functioning as both:

- an **operational base** (tools, storage, shade, safer workflows, a space that works in heat), and
- a **narrative engine** (where stories get told, filmed, taught, and shared back to funders and decision-makers).

That dual function is exactly what makes this investment powerful: the site is a lever for both **immediate impact** and **long-term scalability**.`,
      layout: 'center'
    },
    {
      id: 'section-stats',
      type: 'stats',
      stats: [
        { label: 'Years in the Making', value: '3' },
        { label: 'Team Size', value: '20+' },
        { label: 'Programs Running', value: '10+' },
        { label: 'Status', value: 'Building' }
      ],
      layout: 'center'
    },

    // ===== WHAT THE DAY WAS =====
    {
      id: 'section-divider-1',
      type: 'divider',
      content: 'What the Day Actually Was',
      layout: 'center'
    },
    {
      id: 'section-day',
      type: 'text',
      content: `## Three Things Happening at Once

Across the interviews, people described the day as:

**1. A Practical Build Day**
Painting, landscaping, framing, planning the layout. Young people and mentors working side by side in the heat.

**2. A Youth-Led Cultural Moment**
Flag-making, gathering, mentoring, learning by doing. The Aboriginal flag was painted on the container and laid out in mulch on the ground—ownership markers that tell visitors: *this is a place with cultural governance and pride*.

**3. A Transition Point**
From "we've talked about this for ages" to "we've started." Three years of planning finally turning into visible action.`,
      layout: 'center'
    },
    {
      id: 'section-quote-isaiah',
      type: 'quote',
      content: "This space has been in the make in the works for about three years now… but today, finally kicking it off.",
      author: "Isaiah",
      layout: 'center'
    },
    {
      id: 'section-quote-taj',
      type: 'quote',
      content: "Safe place for young kids in the Mount Druitt area.",
      author: "Taj",
      layout: 'center'
    },

    // ===== YOUTH OWNERSHIP =====
    {
      id: 'section-divider-2',
      type: 'divider',
      content: 'Youth Ownership is the Mechanism',
      layout: 'center'
    },
    {
      id: 'section-ownership',
      type: 'text',
      content: `## Not Participants — Builders

A repeated theme is that the space only works if young people are not treated as participants in someone else's plan. They must be *builders, decision-makers, and authors*.

Youth ownership is built through effort and contribution, not gifting. Funders are not just paying for outputs—they are paying for **a place young people can claim**, which then becomes the platform for all future programming, hosting, inquiry participation, and advisory work.`,
      layout: 'center'
    },
    {
      id: 'section-quote-isaiah-input',
      type: 'quote',
      content: "This is for the kids… without the input, we didn't know what they want.",
      author: "Isaiah",
      layout: 'center'
    },
    {
      id: 'section-quote-archie-effort',
      type: 'quote',
      content: "They're showing them that sometimes you can't get everything handed to you… realistically, you're gonna have to do it yourself.",
      author: "Archie",
      layout: 'center'
    },

    // ===== WHAT MOUNTY FEELS LIKE =====
    {
      id: 'section-divider-3',
      type: 'divider',
      content: 'What Mounty Feels Like',
      layout: 'center'
    },
    {
      id: 'section-feel',
      type: 'text',
      content: `## Safety, No Judgement, Being Yourself

In the interviews, you can feel the social safety that Mounty provides—especially contrasted against the pressure cooker of postcode wars, violence, and street boredom.

This matters for the backyard, because a built environment can either strengthen that feeling or undermine it. The backyard activation, done right, becomes a **physical expression of "no judgement, safe, youth-led"** rather than just a functional yard.`,
      layout: 'center'
    },
    {
      id: 'section-quote-polly',
      type: 'quote',
      content: "I can express myself, I can be myself around these people… You just don't need to feel judged by anyone.",
      author: "Polly",
      layout: 'center'
    },
    {
      id: 'section-quote-isabella',
      type: 'quote',
      content: "The mentors… they're easy to talk to… there's no pressure… and you don't feel judged.",
      author: "Isabella",
      layout: 'center'
    },
    {
      id: 'section-quote-home',
      type: 'quote',
      content: "It's almost like a second home. Even a first home for some kids. They can actually come here and just be themselves, express their feelings, or they can just come in and be kids.",
      author: "Mounty Yarns Team",
      layout: 'center'
    },

    // ===== WHAT WAS BUILT =====
    {
      id: 'section-divider-4',
      type: 'divider',
      content: 'What the Day Produced',
      layout: 'center'
    },
    {
      id: 'section-built',
      type: 'text',
      content: `## Concrete Actions + Cultural Signals

### The Aboriginal Flag
Painted on the container and laid out in mulch on the ground. These are not decorative details—they are **ownership markers**. They tell young people and visitors: *this is a place with cultural governance and pride, not a borrowed warehouse.*

### Yarning Circle & Fire Pit
The centre of gravity for the whole space. *"The main thing, the yarning circle and the fire pit"* — a deliberate separation between making and gathering.

### Physical Layout Planning
Rich on-the-ground design thinking: how to balance privacy from the street, safe access, garden placement, and youth comfort.

### Privacy Infrastructure
Mesh screening and trees/hedges to protect youth who don't want to be watched. *"Some of the kids don't like doing anything in front of everyone… that's why we tucked it away in the back."*

### Secure Storage
A lockable container to protect valuables and tools—because youth need *their own tools*, and a secure place to keep them.`,
      layout: 'center'
    },
    {
      id: 'section-quote-flag',
      type: 'quote',
      content: "They painted the aboriginal flag on the container and we're making an aboriginal flag outta mulch.",
      author: "Archie",
      layout: 'center'
    },
    {
      id: 'section-quote-yarning',
      type: 'quote',
      content: "I reckon [the yarning circle] would probably be the main one 'cause that's where everyone come together.",
      author: "Group Yarn",
      layout: 'center'
    },
    {
      id: 'section-map-link',
      type: 'map-link',
      content: 'Explore the interactive map to see all planned locations.',
      locationId: 'yarning-circle',
      layout: 'center'
    },

    // ===== PAYING YOUNG PEOPLE =====
    {
      id: 'section-divider-5',
      type: 'divider',
      content: 'Dignity & Workforce Pathway',
      layout: 'center'
    },
    {
      id: 'section-paid',
      type: 'text',
      content: `## Paying Young People

The day included paid work—not as charity, but as dignity and realism.

This aligns with the wider ambition of youth as experts, not recipients. Mounty is building a **credible pathway** from "turn up" to "work-ready" to "paid leadership."

We are not paying "participants." We are paying stewards, hosts, builders, and emerging leaders.`,
      layout: 'center'
    },
    {
      id: 'section-quote-paid',
      type: 'quote',
      content: "Unfortunately that's just a part of life… reward 'em… 'cause when you're out there in the workforce, obviously you get paid for doing it.",
      author: "Archie",
      layout: 'center'
    },

    // ===== WHAT SUCCESS LOOKS LIKE =====
    {
      id: 'section-divider-6',
      type: 'divider',
      content: 'What Success Looks Like',
      layout: 'center'
    },
    {
      id: 'section-success',
      type: 'text',
      content: `## Pride, Use, Belonging

The most funder-ready "outcome line" describes:
- the **mechanism** (kids build it)
- the **outcome** (pride, use, belonging)
- the **evidence** (you can point to the thing and say "they did that")

This is exactly the sort of proof a site-based investment is meant to create.`,
      layout: 'center'
    },
    {
      id: 'section-quote-success',
      type: 'quote',
      content: "I just want to be able to see the kids look at it and say 'they done that—they helped do that.' A good spot where it gets utilised. Kids in there playing. Kids saying 'I helped with this garden' or 'we chose this' or 'we done this artwork.'",
      author: "Group Yarn",
      layout: 'center'
    },
    {
      id: 'section-quote-proud',
      type: 'quote',
      content: "Something the youth can be proud of. And then we can be proud to say—look, we helped put this here for our community.",
      author: "Mounty Yarns Team",
      layout: 'center'
    },

    // ===== THE BIGGER VISION =====
    {
      id: 'section-divider-7',
      type: 'divider',
      content: 'The Bigger Vision',
      layout: 'center'
    },
    {
      id: 'section-vision',
      type: 'text',
      content: `## More Spaces, More Kids Being Kids

The more of these spaces pop up around Australia, the better. You'll get kids coming back being kids again. Instead of having to be a "fully grown gangster" by 15 or 16, kids can just be kids.

There's places like Moree, Alice Springs, Dubbo that need something like this. The best thing about those places is they're still connected with Country.

**If we can work out how to do this, we'd be keen to help others build their own spaces.**`,
      layout: 'center'
    },
    {
      id: 'section-quote-vision',
      type: 'quote',
      content: "The more of these pop up, the better. Hopefully things keep getting better. Kids being kids again.",
      author: "Mounty Yarns Team",
      layout: 'center'
    },

    // ===== HOW TO SUPPORT =====
    {
      id: 'section-divider-8',
      type: 'divider',
      content: 'How to Support',
      layout: 'center'
    },
    {
      id: 'section-support',
      type: 'text',
      content: `## What the Conversations Suggest

### 1. Invest in the Yard as a System
Because the yard is meant to be used daily, support should prioritise: secure storage for tools and assets, shade and heat resilience, basic amenities that make it safe and welcoming.

### 2. Fund Paid Youth Roles as Core Infrastructure
Paying young people is both practical (how the world works) and dignity-building (reward, responsibility, pathway).

### 3. Support the Story Engine
Documentation as power. The build is being turned into a documentary-style story and a shareable page that explains the vibe and the why. That is a strategic asset in its own right.

### 4. Protect Youth Privacy Through Design
Visibility can be violence if done wrong. The yard must be designed so young people can be present without feeling watched.`,
      layout: 'center'
    },

    // ===== PARTNERSHIP =====
    {
      id: 'section-divider-9',
      type: 'divider',
      content: 'Partnership',
      layout: 'center'
    },
    {
      id: 'section-partnership',
      type: 'text',
      content: `## Who's Behind This

**Just Reinvest NSW** leads the Mounty Yarns initiative, working alongside Aboriginal young people and community partners.

**Partners include:**
- IAG (driver licensing funding)
- Local art galleries
- Schools across Mount Druitt
- Community Elders

**Getting Things Moving:**
[A Curious Tractor](https://act.place) provides support to help communities build spaces like this—energy when it's needed, then stepping back so you can take the wheel.

---

*Mounty Yarns acknowledges the Darug people and the many Nations who call Mount Druitt home.*

*Contact: mtdruittinfo@justreinvest.org.au*`,
      layout: 'center'
    }
  ]
};

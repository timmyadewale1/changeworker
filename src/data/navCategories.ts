export type NavCategoryGroup = {
  title: string
  shortTitle?: string
  items: string[]
}

export function getCategoryDisplayTitle(
  category: NavCategoryGroup,
  variant: "default" | "nav" = "default"
) {
  if (variant === "nav") return category.shortTitle || category.title
  return category.title
}

export const hireCategories: NavCategoryGroup[] = [
  {
    title: "Administrative and Operations",
    shortTitle: "Admin and Operations",
    items: [
      "Data entry",
      "Virtual assistance",
      "Executive assistant",
      "Report writing",
    ],
  },
  {
    title: "Programs",
    items: [
      "M&E",
      "Proposal/grant writing",
      "Project reporting",
      "Data collection and analysis",
    ],
  },
  {
    title: "Communications",
    items: [
      "Content writing",
      "Social media management",
      "Newsletter/email writing",
      "Impact storytellers",
      "Brand influencing",
      "Advocacy",
    ],
  },
  {
    title: "Training and Facilitation",
    items: [
      "Workshop facilitation",
      "Curriculum development",
      "Training material design",
    ],
  },
  {
    title: "Finance",
    items: [
      "Bookkeeping",
      "Budget tracking",
      "Financial reporting",
      "Auditing",
    ],
  },
  {
    title: "Design",
    items: [
      "Graphic design",
      "Presentation design",
      "UI/UX design",
      "Pitch deck design",
    ],
  },
  {
    title: "Translation and Language",
    items: [
      "Yoruba content translation",
      "Igbo content translation",
      "Hausa content translation",
      "Transcription",
      "Subtitling",
    ],
  },
  {
    title: "Research",
    items: [
      "Stakeholder mapping",
      "Survey design",
      "Fact-checking",
      "Impact assessments",
    ],
  },
  {
    title: "Photography and Media",
    items: [
      "Event photography",
      "Short video editing",
      "Documentary support",
      "Podcast editing",
    ],
  },
  {
    title: "Digital",
    items: [
      "Basic web updates",
      "WhatsApp/email campaign management",
      "CRM data entry",
    ],
  },
]

export const findWorkCategories = hireCategories

export const whyUsLinks = [
  {
    title: "Success Stories",
    description: "See how impact teams scale with purpose-driven talent.",
  },
  {
    title: "How to Hire",
    description: "Learn flexible ways to build impact teams.",
  },
  {
    title: "Reviews",
    description: "What changemakers say about working here.",
  },
  {
    title: "How to Find Work",
    description: "Grow your mission-driven freelance career.",
  },
  {
    title: "Featured Resources",
    description: "Guides, playbooks, and impact insights.",
  },
]

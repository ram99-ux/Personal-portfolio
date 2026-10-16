export const profile = {
  name: "Ram Kumar",
  wordmark: "RAM",
  role: "Full Stack Developer",
  location: "Tamil Nadu, India",
  intro:
    "From the first idea to the final interaction. I build thoughtful digital experiences with React, Next.js, and the MERN stack.",
  shortIntro:
    "Thoughtful interfaces. Dependable foundations. Bringing your next idea to life, one detail at a time.",
  email: "",
  bookingUrl: "",
  githubUrl: "https://github.com/ram99-ux",
  linkedinUrl: "https://www.linkedin.com/in/ram-kumar04",
  siteUrl: "https://example.com",
  isDemo: true,
  portrait: "/images/portrait-v2.png",
  portraitMobile: "/images/portrait-mobile.png",
  headline: ["Full stack,", "Thoughtfully", "Built."],
  qualities: ["Curious", "Dependable", "Thoughtful", "Creative", "Hands-on"],
};

export const navigation = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About me", icon: "about" },
  { id: "projects", label: "Projects", icon: "work" },
  { id: "capabilities", label: "What you get", icon: "layers" },
  { id: "skills", label: "Skills", icon: "code" },
  { id: "services", label: "Services", icon: "bolt" },
  { id: "faq", label: "FAQ", icon: "help" },
] as const;

export const journeyItems = [
  {
    year: "2021",
    title: "A little curiosity. A lot of code.",
    description:
      "An empty editor, a simple idea, and the first website that finally worked.",
    detail:
      "This sample chapter starts with HTML, CSS, and JavaScript. Small experiments turned into a habit: build something, understand why it works, and try a better approach. Replace this chapter with your own starting point.",
    tag: "the beginning",
    icon: "code",
    image: "/images/journey-code.svg",
  },
  {
    year: "2022",
    title: "Finding the missing pieces.",
    description:
      "Learning how interfaces, servers, and databases become one useful product.",
    detail:
      "A sample milestone about moving beyond static pages. React made interfaces more expressive, while Node.js and MongoDB introduced a whole new set of problems to solve. Add your real learning milestones here.",
    tag: "MERN stack",
    icon: "layers",
    image: "/images/journey-stack.svg",
  },
  {
    year: "2023",
    title: "Making things feel right.",
    description:
      "The small details started to matter: the rhythm, the feedback, the motion.",
    detail:
      "This illustrative chapter explores accessible interactions, responsive layouts, and animations that help people understand an interface. Replace this with a project or discovery that shaped your approach.",
    tag: "interaction",
    icon: "spark",
    image: "/images/journey-motion.svg",
  },
  {
    year: "2024",
    title: "Thinking beyond the screen.",
    description:
      "Better architecture. Clearer decisions. Products built with the whole experience in mind.",
    detail:
      "A fictional portfolio milestone about connecting great interfaces to reliable systems. API design, loading states, and thoughtful error handling all belong in the same conversation. Add your own experience here.",
    tag: "building better",
    icon: "globe",
    image: "/images/journey-stack.svg",
  },
  {
    year: "2025",
    title: "Room to experiment.",
    description:
      "Exploring new patterns and turning side-project ideas into working prototypes.",
    detail:
      "A sample chapter for the experiments that do not fit a traditional résumé. This could become a story about open source, a hackathon, a collaboration, or a personal project.",
    tag: "exploration",
    icon: "heart",
    image: "/images/journey-motion.svg",
  },
  {
    year: "2026",
    title: "Still asking, “what if?”",
    description:
      "New tools, fresh ideas, and the same curiosity that started it all.",
    detail:
      "The final sample chapter is yours to write. Share what you are learning now, the kind of work you want to do next, and the problems that keep you curious.",
    tag: "what comes next",
    icon: "arrow",
    image: "/images/journey-code.svg",
  },
];

export const projects = [
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    category: "Portfolio Website",
    year: "2025",
    tags: ["Next.js", "React", "JavaScript", "CSS", "Responsive Design"],
    color: "#214638",
    image: "/images/project-personal-portfolio.svg",
    description:
      "A modern portfolio showcasing development skills and projects.",
    detail:
      "A responsive developer portfolio highlighting technical expertise, professional experience, featured projects, and contact information.",
    features: [
      "Responsive layouts across devices",
      "Interactive project showcase",
      "Professional skills and experience sections",
    ],
  },
  {
    slug: "ai-eternity-tourist-guide",
    title: "AI Eternity Tourist Guide",
    category: "AI-Powered Travel Application",
    year: "2025",
    tags: ["React", "Node.js", "Express.js", "Gemini API", "REST API"],
    color: "#4938A8",
    image: "/images/project-ai-eternity-tourist-guide.svg",
    description:
      "An AI-powered travel guide for discovering destinations and planning trips.",
    detail:
      "An intelligent tourism application designed to help travelers explore destinations, discover attractions, and receive personalized travel recommendations using AI.",
    features: [
      "AI-powered travel recommendations",
      "Tourist destination and attraction discovery",
      "Personalized trip planning assistance",
    ],
  },
  {
    slug: "instagram-clone",
    title: "Instagram Clone",
    category: "Social Media Application",
    year: "2025",
    tags: ["React", "JavaScript", "CSS", "REST API", "Responsive Design"],
    color: "#A83265",
    image: "/images/project-instagram-clone.svg",
    description:
      "A social media interface inspired by Instagram's core experience.",
    detail:
      "A React-based social media project recreating Instagram-inspired layouts and interactions with a responsive interface and reusable components.",
    features: [
      "Social media-style feed interface",
      "Reusable React components",
      "Responsive mobile-first layout",
    ],
  },
  {
    slug: "student-information-management",
    title: "Student Information Management System",
    category: "Full-Stack Web Application",
    year: "2025",
    tags: ["React", "Node.js", "Express.js", "MySQL", "JWT"],
    color: "#176B87",
    image: "/images/project-student-information-management.svg",
    description:
      "A full-stack system for managing student records and access.",
    detail:
      "A full-stack management application using React, Node.js, Express, and MySQL with JWT-based authentication and role-based access control.",
    features: [
      "Student record management",
      "JWT authentication and role-based access",
      "REST API with MySQL integration",
    ],
  },
  {
    slug: "whatsapp-work-update-automation",
    title: "WhatsApp Work Update Automation",
    category: "Workflow Automation",
    year: "2026",
    tags: ["Python", "Playwright", "OpenRouter API", "Google Sheets", "Automation"],
    color: "#16866B",
    image: "/images/project-whatsapp-work-update-automation.svg",
    description:
      "Automates daily work updates from WhatsApp into Google Sheets.",
    detail:
      "An automation workflow that processes WhatsApp work updates using Python and AI, extracts structured information, and records results in Google Sheets.",
    features: [
      "WhatsApp Web automation with Playwright",
      "AI-powered message parsing",
      "Automated Google Sheets updates",
    ],
  },
  {
    slug: "cms-website-integration",
    title: "CMS and Website Integration",
    category: "Full-Stack Development",
    year: "2026",
    tags: ["Next.js", "React", "Node.js", "REST API", "MongoDB", "MySQL"],
    color: "#344B80",
    image: "/images/project-cms-website-integration.svg",
    description:
      "Connects website interfaces with centralized content management.",
    detail:
      "A web integration project connecting CMS interfaces and frontend websites through APIs for centralized data access and dynamic content delivery.",
    features: [
      "API-driven content integration",
      "Centralized database connectivity",
      "Dynamic frontend data rendering",
    ],
  },
  {
    slug: "organic-heritage-store",
    title: "Organic Heritage Store",
    category: "E-Commerce Website",
    year: "2026",
    tags: ["Next.js", "React", "JavaScript", "CSS", "E-Commerce"],
    color: "#526B36",
    image: "/images/project-organic-heritage-store.svg",
    description:
      "An organic storefront for natural grains and cosmetic products.",
    detail:
      "A responsive e-commerce website showcasing organic grains, natural products, and cosmetics with a clean interface and product-focused presentation.",
    features: [
      "Organic product catalog",
      "Responsive shopping experience",
      "Product-focused page layouts",
    ],
  },
  {
    slug: "vision-infinite",
    title: "Vision Infinite",
    category: "Corporate Website",
    year: "2026",
    tags: ["Next.js", "React", "JavaScript", "CSS", "SEO"],
    color: "#9A652D",
    image: "/images/project-vision-infinite.svg",
    description:
      "A corporate website showcasing branding and event management services.",
    detail:
      "A responsive corporate website presenting experiential branding, event management, outdoor advertising, and creative solutions with SEO-friendly page structures.",
    features: [
      "Service and portfolio sections",
      "Responsive corporate design",
      "SEO-friendly page structure",
    ],
  },
  {
    slug: "rewild-greens-spices",
    title: "Rewild Greens & Spices",
    category: "Shopify E-Commerce",
    year: "2026",
    tags: ["Shopify", "Liquid", "HTML", "CSS", "JavaScript", "E-Commerce"],
    color: "#47613C",
    image: "/images/project-rewild-greens-spices.svg",
    description:
      "A nature-inspired Shopify store for greens, spices, and organics.",
    detail:
      "A customized Shopify storefront featuring an earthy visual identity, organized product collections, responsive layouts, and a streamlined shopping experience.",
    features: [
      "Shopify theme customization",
      "Organized product collections",
      "Responsive storefront design",
    ],
  },
  {
    slug: "biometric-attendance-automation",
    title: "Biometric Attendance Automation",
    category: "Attendance Management System",
    year: "2026",
    tags: ["Python", "Google Sheets API", "Automation", "REST API"],
    color: "#315A75",
    image: "/images/project-biometric-attendance-automation.svg",
    description:
      "Automates biometric attendance tracking and Google Sheets updates.",
    detail:
      "A Python-based attendance automation system that retrieves biometric punch records, processes daily IN and OUT statuses, and synchronizes attendance data with Google Sheets.",
    features: [
      "Biometric punch record synchronization",
      "Automated daily attendance calculations",
      "Google Sheets integration",
    ],
  },
];

export type Project = (typeof projects)[number];

export const capabilities = [
  {
    title: "Full stack development",
    text: "Connected frontends and backends with React, Next.js, Node.js, and MongoDB.",
    icon: "code",
  },
  {
    title: "Thoughtful integrations",
    text: "APIs, content systems, and external tools connected around the way your product works.",
    icon: "plug",
  },
  {
    title: "Search-ready structure",
    text: "Semantic pages, useful metadata, and a strong technical foundation for discoverability.",
    icon: "search",
  },
  {
    title: "Motion with purpose",
    text: "Responsive animation and subtle feedback that make the next step feel natural.",
    icon: "spark",
  },
  {
    title: "Performance in the details",
    text: "Careful loading, optimized images, and lightweight interactions across devices.",
    icon: "gauge",
  },
];

export const skills = [
  {
    title: "Frontend Development",
    icon: "code",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "React.js",
      "Next.js",
      "Bootstrap",
      "Responsive Web Design",
      "UI Implementation",
    ],
  },
  {
    title: "Backend Development",
    icon: "layers",
    items: [
      "Node.js",
      "Express.js",
      "REST API Development",
      "API Integration",
      "JWT Authentication",
      "Role-Based Access Control",
      "Input Validation",
    ],
  },
  {
    title: "Databases",
    icon: "grid",
    items: [
      "MongoDB",
      "Mongoose",
      "MySQL",
      "SQL",
      "Database Design and Integration",
    ],
  },
  {
    title: "AI & Automation",
    icon: "spark",
    items: [
      "Google Gemini API",
      "OpenRouter API",
      "AI Chatbot Integration",
      "Python Automation",
      "Playwright",
      "WhatsApp Web Automation",
      "Google Sheets API Integration",
      "AI-Powered Workflow Automation",
    ],
  },
  {
    title: "DevOps & Deployment",
    icon: "gauge",
    items: [
      "Linux (AlmaLinux)",
      "Nginx",
      "PM2",
      "Git",
      "GitHub",
      "GitHub Actions",
      "CI/CD",
      "SSH",
      "SSL Configuration",
      "Server Deployment and Troubleshooting",
      "Webmin",
    ],
  },
  {
    title: "E-Commerce & CMS",
    icon: "work",
    items: [
      "Shopify",
      "Shopify Theme Customization",
      "Liquid",
      "WordPress",
      "CMS Integration",
      "E-Commerce Website Development",
    ],
  },
  {
    title: "Development Tools",
    icon: "plug",
    items: [
      "VS Code",
      "Postman",
      "Thunder Client",
      "Vite",
      "GitHub Copilot",
      "Google Gemini",
    ],
  },
  {
    title: "Additional Skills",
    icon: "globe",
    items: [
      "SEO Implementation",
      "Website Performance Optimization",
      "Cross-Browser Compatibility",
      "Debugging and Troubleshooting",
      "Full-Stack Web Development",
    ],
  },
];

export const services = [
  {
    title: "Keep growing",
    value: "Monthly",
    caption: "Flexible support",
    icon: "grid",
    description:
      "A steady development partner for the next feature, the small fixes, and everything in between.",
    features: [
      "New sections and features",
      "Content and interface updates",
      "Bug fixes and maintenance",
      "Performance improvements",
      "A shared list of priorities",
    ],
    fit: "For websites that keep evolving.",
    cta: "Discuss ongoing support",
  },
  {
    title: "Start something",
    value: "From an idea",
    caption: "A focused first build",
    icon: "bolt",
    description:
      "A considered starting point for a new website or product, with the essentials in the right place.",
    features: [
      "Responsive page development",
      "Reusable interface components",
      "Content integration",
      "Search and accessibility basics",
      "Launch guidance and handoff",
    ],
    fit: "For a new presence with room to grow.",
    cta: "Plan a starter build",
  },
  {
    title: "Go further",
    value: "Let’s talk",
    caption: "A tailored project",
    icon: "spark",
    description:
      "Something more ambitious. We shape the scope around your users, your ideas, and your technical needs.",
    features: [
      "Custom application architecture",
      "Advanced motion and interactions",
      "API and database integration",
      "Complex reusable components",
      "A clear delivery and launch plan",
    ],
    fit: "For ideas that need their own approach.",
    cta: "Explore a custom project",
  },
];

export const faqs = [
  {
    question: "Why build with React and Next.js?",
    answer:
      "They offer a flexible foundation for everything from a focused portfolio to a larger application. Reusable components, server rendering, and a broad ecosystem help keep the experience fast and the code maintainable.",
  },
  {
    question: "Can an existing website be improved?",
    answer:
      "Yes. A useful starting point is a review of the current experience: what works, what gets in the way, and what needs attention first. Improvements can then be scoped around the existing foundation.",
  },
  {
    question: "What does a project process look like?",
    answer:
      "Define the goal, agree on a scope, build in small reviewable stages, and test before launch. Regular previews keep feedback practical and make the final handoff easier.",
  },
  {
    question: "Can a project stay confidential?",
    answer:
      "Confidentiality requirements can be discussed before work begins. Share the restrictions and any agreement that needs review when planning the project.",
  },
  {
    question: "Do I need a finished design first?",
    answer:
      "A finished design helps, but a clear direction can also be a starting point. The scope can include refining layouts and interactions, or collaborating with your existing design team.",
  },
  {
    question: "What can ongoing support include?",
    answer:
      "Support can cover new features, interface refinements, content changes, bug fixes, and performance work. The exact priorities and availability should be agreed for each engagement.",
  },
  {
    question: "How is feedback handled?",
    answer:
      "Share feedback on regular previews while changes are still easy to make. Keeping it in one place helps connect each revision to the original goal and agreed scope.",
  },
  {
    question: "How can I discuss my idea?",
    answer:
      "Use “Let’s talk” to prepare a project brief. This demonstration lets you save the brief locally. Once real contact details are configured, you can also open it in your email app or use the booking link.",
  },
];

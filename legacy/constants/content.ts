import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ServiceItem,
  SkillGroup,
  StatItem,
} from '@/types';

export const hero = {
  eyebrow: 'Chennai, India — Available for work',
  name: ['RAM', 'KUMAR'],
  title: 'Full Stack Developer',
  intro:
    'I design and ship production web applications end to end — from the first client conversation to the live server humming at 2 a.m.',
} as const;

export const about = {
  eyebrow: 'About',
  heading: 'Built for the whole stack, not just the pretty half.',
  paragraphs: [
    'I am a Full Stack Developer working across the MERN stack and Next.js, with production experience taking web applications from a blank requirements doc to a running Linux VPS.',
    'My day looks like React components in the morning, Express routes and MongoDB queries by afternoon, and an Nginx config or a PM2 restart when a deployment needs it. That range is deliberate — I would rather own the whole path than hand off at the API boundary.',
    'What I care about most is the part users actually feel: fast first paint, honest loading states, auth that does not leak, and interfaces that hold up on a mid-range phone as well as a 27-inch monitor.',
  ],
  signature: 'Currently building at Push Digital.',
} as const;

export const stats: readonly StatItem[] = [
  { value: '12', suffix: '+', label: 'Production apps shipped' },
  { value: '60', suffix: '%', label: 'Load time reduction' },
  { value: '30', suffix: '+', label: 'Secured API routes' },
  { value: '3', suffix: '', label: 'Projects owned end to end' },
];

export const skillGroups: readonly SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['React.js', 'Next.js', 'Redux', 'JavaScript', 'HTML5', 'CSS3', 'Material UI', 'Bootstrap 5', 'Responsive Design'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'MVC Architecture', 'JSON', 'OOP'],
  },
  {
    title: 'Data',
    items: ['MongoDB', 'MySQL', 'SQL', 'Schema Design', 'Query Optimization'],
  },
  {
    title: 'Auth & Security',
    items: ['JWT', 'OAuth 2.0', 'bcrypt', 'RBAC', 'Route Protection'],
  },
  {
    title: 'Cloud & Deployment',
    items: ['AWS', 'Linux VPS', 'Nginx', 'PM2', 'Webmin', 'Zero-downtime Deploys'],
  },
  {
    title: 'Tooling & Process',
    items: ['Git', 'GitHub', 'Postman', 'Thunder Client', 'VS Code', 'Agile', 'Scrum', 'SDLC'],
  },
];

export const marqueeSkills: readonly string[] = [
  'Next.js',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'MySQL',
  'TypeScript-ready',
  'REST APIs',
  'JWT',
  'OAuth 2.0',
  'Nginx',
  'PM2',
  'AWS',
  'Linux VPS',
];

export const experience: readonly ExperienceItem[] = [
  {
    company: 'Push Digital',
    role: 'Full Stack Developer',
    period: 'Mar 2026 — Present',
    location: 'Chennai, India',
    summary:
      'Building and maintaining a portfolio of client web applications, and owning the infrastructure they run on.',
    highlights: [
      'Develop and maintain 12 production web applications on Next.js, React and Express, wired to MongoDB and MySQL data layers through REST APIs.',
      'Cut page load time from 5s to 2s — a 60% reduction — through server-side rendering, route-level code splitting and asset optimisation.',
      'Deploy to Linux VPS infrastructure with Nginx as reverse proxy, PM2 for zero-downtime process management and Webmin for server administration.',
      'Enforce JWT and OAuth 2.0 authentication with role-based access control across 30+ protected API routes.',
      'Resolve production incidents within a 4-hour turnaround and integrate transactional email for automated client communication.',
      'Work directly with clients on requirements and scope, delivering 3 projects to deadline in an Agile workflow.',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'Nginx', 'PM2', 'AWS'],
  },
  {
    company: 'Besant Technologies',
    role: 'Full-Stack Development Intern',
    period: 'Feb 2025 — Dec 2025',
    location: 'Anna Nagar, Chennai',
    summary:
      'A full year of hands-on stack work — the internship where API design stopped being theory.',
    highlights: [
      'Built full-stack applications on React, Node, Express, MySQL and MongoDB following MVC architecture and RESTful design principles.',
      'Designed and tested 30+ CRUD endpoints with Postman and Thunder Client, debugging request/response cycles to close integration defects.',
      'Practised Agile and Scrum with Git and GitHub version control, and took part in peer code reviews.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Postman', 'Git'],
  },
  {
    company: 'Ladybird Web Solutions Pvt. Ltd.',
    role: 'Web Development Intern',
    period: 'Aug 2024 — Sep 2024',
    location: 'Dharmapuri, India',
    summary: 'First professional brief: turn a design spec into a responsive storefront.',
    highlights: [
      'Developed a responsive e-commerce website from design specifications using semantic HTML5, CSS3 and vanilla JavaScript.',
      'Engineered mobile-first layouts that render consistently across major browsers and screen sizes.',
      'Restructured page markup and static assets to reduce render-blocking resources and improve load performance.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
  },
];

export const projects: readonly ProjectItem[] = [
  {
    slug: 'client-web-applications',
    title: 'Client Web Applications',
    category: 'Production · Full Stack + Infrastructure',
    year: '2026',
    summary:
      'A rolling portfolio of twelve client applications — three of which I carried alone from the first requirements call through development, deployment and post-launch support.',
    highlights: [
      'Provisioned and configured Linux VPS environments with Nginx reverse proxy and PM2 for zero-downtime restarts.',
      'Administered live servers through Webmin, handling domain routing, server configuration and routine maintenance.',
      'Integrated transactional email services to automate client-to-user communication.',
      'Tuned front-end performance until page load dropped from 5s to 2s across the estate.',
    ],
    stack: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'Nginx', 'PM2', 'Webmin'],
    metric: { value: '12', label: 'Apps in production' },
  },
  {
    slug: 'student-information-system',
    title: 'Student Information Management System',
    category: 'Full Stack · Auth & RBAC',
    year: '2025',
    summary:
      'A centralised, searchable student records platform that replaced paper-based record-keeping — with three permission tiers that never see each other’s data.',
    highlights: [
      'Implemented role-based access control across Student, HOD and Management tiers using JWT, scoping every read and write to the caller’s role.',
      'Hashed credentials with bcrypt and gated every private route behind token-verification middleware.',
      'Designed RESTful CRUD APIs for student, department and user records, validating each endpoint with Thunder Client.',
      'Replaced manual lookups with indexed search, turning a filing-cabinet workflow into a query.',
    ],
    stack: ['Node.js', 'Express.js', 'MySQL', 'JWT', 'bcrypt', 'HTML5', 'CSS3', 'JavaScript'],
    repo: 'https://github.com/ram99-ux',
    metric: { value: '3', label: 'Permission tiers' },
  },
  {
    slug: 'ai-tourist-guide',
    title: 'AI Tourist Guide & Itinerary Planner',
    category: 'Full Stack · LLM Integration',
    year: '2025',
    summary:
      'One sentence in, a costed day-by-day itinerary out. The interesting part was making an unpredictable model behave like a dependable API.',
    highlights: [
      'Integrated OpenRouter LLM APIs into a Node.js backend with structured prompts enforcing hard rules on budget, pacing and geography.',
      'Applied JSON schema validation to every model response, rejecting malformed output before it could reach the renderer.',
      'Built a responsive React front end with dynamic itinerary rendering and graceful API error handling.',
      'Generated day-wise plans complete with cost estimates from a single user request.',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'OpenRouter AI', 'Bootstrap', 'JSON Schema'],
    repo: 'https://github.com/ram99-ux',
    metric: { value: '0', label: 'Malformed renders' },
  },
];

export const services: readonly ServiceItem[] = [
  {
    index: '01',
    title: 'Full Stack Development',
    description:
      'One person, one thread of accountability — React front end, Express API, database schema and the deployment that ties them together.',
    deliverables: ['MERN & Next.js builds', 'MVC architecture', 'Database design', 'End-to-end delivery'],
  },
  {
    index: '02',
    title: 'Frontend Engineering',
    description:
      'Interfaces that feel considered on every breakpoint, built with React and Next.js and animated only where it earns its keep.',
    deliverables: ['React / Next.js', 'Responsive UI', 'State management', 'Design-to-code'],
  },
  {
    index: '03',
    title: 'API Development',
    description:
      'RESTful services designed around real access patterns, documented, and tested endpoint by endpoint before anyone consumes them.',
    deliverables: ['REST API design', 'CRUD endpoints', 'Postman collections', 'Integration support'],
  },
  {
    index: '04',
    title: 'Auth & Security',
    description:
      'Login flows that hold up under scrutiny — hashed credentials, signed tokens and roles enforced on the server, not the button.',
    deliverables: ['JWT & OAuth 2.0', 'bcrypt hashing', 'Role-based access', 'Route protection'],
  },
  {
    index: '05',
    title: 'Deployment & DevOps',
    description:
      'Getting it live and keeping it live: VPS provisioning, reverse proxy, process management and the boring maintenance nobody advertises.',
    deliverables: ['Linux VPS setup', 'Nginx reverse proxy', 'PM2 process management', 'Webmin administration'],
  },
  {
    index: '06',
    title: 'Performance Optimisation',
    description:
      'Finding the seconds hiding in your bundle. Rendering strategy, code splitting and asset weight, measured before and after.',
    deliverables: ['SSR & code splitting', 'Asset optimisation', 'Core Web Vitals', 'Load time audits'],
  },
];

export const education: readonly EducationItem[] = [
  {
    institution: 'Jayam College of Engineering and Technology',
    qualification: 'B.E. Computer Science & Engineering',
    period: '2025',
    location: 'Dharmapuri, Tamil Nadu',
    result: 'CGPA 7.29 / 10.0',
  },
  {
    institution: 'Govt. Hr. Sec. School',
    qualification: 'Higher Secondary (HSC)',
    period: '2021',
    location: 'Dharmapuri, Tamil Nadu',
    result: '84.5%',
  },
];

export const certifications: readonly CertificationItem[] = [
  { title: 'Full-Stack Development', issuer: 'Besant Technologies', date: 'Oct 2025' },
  { title: 'The Complete Web Development Bootcamp', issuer: 'Udemy — Dr. Angela Yu', date: 'Jan 2025' },
  { title: 'SQL (Advanced)', issuer: 'HackerRank', date: 'Mar 2025' },
];

export const contact = {
  eyebrow: 'Contact',
  heading: 'Let’s build something that ships.',
  body:
    'I am open to full-time roles and freelance builds. If you have a product that needs an owner across the whole stack — or an existing one that has quietly gotten slow — send me the details.',
  cta: 'Start a conversation',
} as const;

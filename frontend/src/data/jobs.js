// Demo job data (Phase 1 & Phase 2 foundation)
export const categories = [
  "Software Development",
  "Data & Analytics",
  "Design & UI/UX",
  "Product & QA",
  "Marketing & Content",
  "Operations & Support"
];

export const jobTypes = ["Internship", "Full-time", "Part-time"];
export const locations = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Remote"];

export const jobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Pixelwave Labs",
    color: "#4f46e5",
    category: "Software Development",
    location: "Bengaluru",
    type: "Internship",
    pay: "₹15,000 / month",
    posted: "2 days ago",
    featured: true,
    summary: "Build user-friendly web pages with React alongside our product team.",
    about: "Pixelwave Labs makes learning apps used by thousands of school students. You will work with two senior developers and ship real features during your internship.",
    responsibilities: [
      "Build and test responsive React components",
      "Fix UI bugs reported by users and improve user experience",
      "Join weekly design and code reviews with the core team"
    ],
    requirements: [
      "Familiarity with HTML, CSS, JavaScript, and React",
      "Currently enrolled in B.E./B.Tech/BCA/MCA or related field",
      "A small project or GitHub repository to showcase"
    ],
    skills: ["React", "JavaScript", "CSS", "Git"]
  },
  {
    id: 2,
    title: "Data Analyst Trainee",
    company: "Northbridge Analytics",
    color: "#0f766e",
    category: "Data & Analytics",
    location: "Hyderabad",
    type: "Full-time",
    pay: "₹4.2 LPA",
    posted: "3 days ago",
    featured: true,
    summary: "Turn raw sales data into clear dashboards and weekly reports.",
    about: "Northbridge helps retail brands understand their customers. This trainee role includes three months of paid training with a dedicated mentor.",
    responsibilities: [
      "Clean, transform, and organise enterprise datasets",
      "Create interactive charts and weekly performance summaries",
      "Collaborate with business analysts to answer data requests"
    ],
    requirements: [
      "Comfortable with Excel or Google Sheets (pivot tables, vlookup)",
      "Basic understanding of SQL queries",
      "Good communication and attention to detail"
    ],
    skills: ["Excel", "SQL", "Python", "Reporting"]
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Studio Marigold",
    color: "#be185d",
    category: "Design & UI/UX",
    location: "Remote",
    type: "Internship",
    pay: "₹12,000 / month",
    posted: "1 week ago",
    featured: true,
    summary: "Design clean app screens and test them with real users.",
    about: "Studio Marigold is a boutique design studio working with venture-backed startups. Interns present design concepts directly to clients from week four.",
    responsibilities: [
      "Sketch wireframes and modern app interfaces in Figma",
      "Prepare interactive clickable prototypes for mobile and web",
      "Help conduct user usability testing sessions"
    ],
    requirements: [
      "Design portfolio with 2 or more projects (Figma/Behance)",
      "Understanding of design systems and typography",
      "Clear communication and willingness to accept design feedback"
    ],
    skills: ["Figma", "Wireframing", "Prototyping", "UI Design"]
  },
  {
    id: 4,
    title: "Backend Developer Intern",
    company: "CloudNest Systems",
    color: "#1d4ed8",
    category: "Software Development",
    location: "Pune",
    type: "Internship",
    pay: "₹18,000 / month",
    posted: "4 days ago",
    featured: false,
    summary: "Create and test REST APIs using Node.js and Express.",
    about: "CloudNest builds high-performance cloud software for logistics companies. You will join the API team and learn how production backends scale.",
    responsibilities: [
      "Develop and test REST API endpoints using Node.js & Express",
      "Test endpoints thoroughly with Postman or Thunder Client",
      "Document API contracts and schemas for frontend integration"
    ],
    requirements: [
      "Basics of Node.js or any modern backend runtime",
      "Understanding of HTTP methods, JSON, and REST architecture",
      "Basic Git commands and version control"
    ],
    skills: ["Node.js", "Express", "REST APIs", "Git"]
  },
  {
    id: 5,
    title: "Junior Software Engineer",
    company: "Brightforge Technologies",
    color: "#7c3aed",
    category: "Software Development",
    location: "Bengaluru",
    type: "Full-time",
    pay: "₹6 LPA",
    posted: "5 days ago",
    featured: false,
    summary: "Join a friendly engineering team building a customer support platform.",
    about: "Brightforge is a growing product company with a 40-person engineering team and an outstanding culture of continuous mentorship.",
    responsibilities: [
      "Develop full-stack features from specifications to deployment",
      "Write clean, maintainable, and well-tested code",
      "Participate actively in code reviews and architecture discussions"
    ],
    requirements: [
      "Strong computer science and programming fundamentals",
      "Practical experience with JavaScript/TypeScript and one framework",
      "Final-year college students and recent graduates welcome"
    ],
    skills: ["JavaScript", "React", "Node.js", "SQL"]
  },
  {
    id: 6,
    title: "Digital Marketing Intern",
    company: "GrowthLeaf Media",
    color: "#c2410c",
    category: "Marketing & Content",
    location: "Chennai",
    type: "Internship",
    pay: "₹8,000 / month",
    posted: "6 days ago",
    featured: false,
    summary: "Plan social media posts and track how each campaign performs.",
    about: "GrowthLeaf Media runs digital campaigns for local food, lifestyle, and fashion brands. Interns get real, hands-on campaign management experience.",
    responsibilities: [
      "Draft catchy social media captions and maintain content calendars",
      "Monitor engagement metrics: reach, impressions, and conversions",
      "Brainstorm creative visual campaign ideas with the design team"
    ],
    requirements: [
      "Active presence on social platforms (LinkedIn, Instagram)",
      "Strong written English communication",
      "Familiarity with Canva or basic graphic editing"
    ],
    skills: ["Social Media", "Canva", "Copywriting", "Analytics"]
  },
  {
    id: 7,
    title: "Customer Support Associate",
    company: "HelpDesk Hub",
    color: "#0369a1",
    category: "Operations & Support",
    location: "Hyderabad",
    type: "Part-time",
    pay: "₹10,000 / month",
    posted: "1 week ago",
    featured: false,
    summary: "Help users by chat and email for 4 hours a day, ideal alongside college.",
    about: "HelpDesk Hub offers flexible 4-hour shifts designed for college students to gain corporate experience and earn while studying.",
    responsibilities: [
      "Respond helpfully to user inquiries via email and live chat",
      "Log common product feedback and bug reports in shared tracking sheets",
      "Escalate complex technical queries to senior engineering teams"
    ],
    requirements: [
      "Fluent verbal and written English communication",
      "Available for 4 flexible hours per day",
      "Empathetic, calm, and solution-oriented attitude"
    ],
    skills: ["Communication", "Problem Solving", "Customer Support"]
  },
  {
    id: 8,
    title: "Machine Learning Intern",
    company: "Neuronest AI",
    color: "#4338ca",
    category: "Data & Analytics",
    location: "Remote",
    type: "Internship",
    pay: "₹20,000 / month",
    posted: "3 days ago",
    featured: false,
    summary: "Train and evaluate small models on real datasets with a mentor.",
    about: "Neuronest AI is an AI research and developer tooling startup. Interns work alongside PhD researchers and present working demos.",
    responsibilities: [
      "Preprocess, clean, and validate tabular and text datasets",
      "Experiment with regression, classification, and clustering models",
      "Benchmark model accuracy and document experimental findings"
    ],
    requirements: [
      "Strong Python programming skills",
      "Understanding of fundamental probability, linear algebra, and statistics",
      "Hands-on exposure to Pandas, NumPy, or scikit-learn"
    ],
    skills: ["Python", "Pandas", "scikit-learn", "Machine Learning"]
  },
  {
    id: 9,
    title: "QA Testing Intern",
    company: "Pixelwave Labs",
    color: "#4f46e5",
    category: "Product & QA",
    location: "Bengaluru",
    type: "Internship",
    pay: "₹10,000 / month",
    posted: "2 weeks ago",
    featured: false,
    summary: "Find bugs before users do by testing new app releases.",
    about: "The QA team verifies every release of our student learning apps. You will learn manual testing workflows and introductory automated testing.",
    responsibilities: [
      "Execute manual test cases across web and mobile browsers",
      "Report detailed defect tickets with reproducible steps and screenshots",
      "Verify bug fixes alongside the frontend development team"
    ],
    requirements: [
      "Sharp eye for detail and systematic problem-solving approach",
      "Basic understanding of how web applications function",
      "Open to students from any academic branch or discipline"
    ],
    skills: ["Manual Testing", "Bug Reporting", "Quality Assurance"]
  },
  {
    id: 10,
    title: "Content Writer",
    company: "GrowthLeaf Media",
    color: "#c2410c",
    category: "Marketing & Content",
    location: "Remote",
    type: "Part-time",
    pay: "₹9,000 / month",
    posted: "1 week ago",
    featured: false,
    summary: "Write blog posts and short guides for student-focused brands.",
    about: "Write engaging articles about career development, tech trends, and college survival tips for an audience of over 50,000 readers.",
    responsibilities: [
      "Write two well-researched blog posts or guides per week",
      "Apply on-page SEO basics and optimize keyword placement",
      "Revise and polish drafts based on editorial feedback"
    ],
    requirements: [
      "Excellent written English and narrative storytelling ability",
      "Ability to submit 1-2 writing samples",
      "Reliability in meeting agreed weekly deadlines"
    ],
    skills: ["Content Writing", "SEO", "Research", "Editing"]
  },
  {
    id: 11,
    title: "Mobile App Developer Intern",
    company: "AppVenture Studios",
    color: "#059669",
    category: "Software Development",
    location: "Pune",
    type: "Internship",
    pay: "₹16,000 / month",
    posted: "1 day ago",
    featured: true,
    summary: "Build cross-platform mobile apps for Android and iOS using Flutter.",
    about: "AppVenture Studios creates mobile experiences for health and fitness startups. Interns ship real app features to Google Play Store.",
    responsibilities: [
      "Implement smooth Flutter UI layouts based on Figma designs",
      "Integrate RESTful backend APIs with state management",
      "Assist in testing app performance on different screen sizes"
    ],
    requirements: [
      "Familiarity with Dart and Flutter basics",
      "Understanding of mobile layouts and state management",
      "Completed at least one demo Flutter app"
    ],
    skills: ["Flutter", "Dart", "Mobile Dev", "REST APIs"]
  },
  {
    id: 12,
    title: "Associate Product Manager Intern",
    company: "InnovateSphere",
    color: "#d97706",
    category: "Product & QA",
    location: "Bengaluru",
    type: "Internship",
    pay: "₹20,000 / month",
    posted: "2 days ago",
    featured: true,
    summary: "Work with engineering and design to define product features and roadmaps.",
    about: "InnovateSphere is an edtech platform supporting 200,000 active students. As an APM intern, you will own a feature from idea to launch.",
    responsibilities: [
      "Gather user feedback and synthesize key feature requests",
      "Write concise product requirement documents (PRDs)",
      "Coordinate sprints with design and engineering teams"
    ],
    requirements: [
      "High curiosity about technology and user psychology",
      "Structured thinking and strong presentation skills",
      "Prior campus leadership or project management experience is a plus"
    ],
    skills: ["Product Management", "Roadmapping", "Wireframing", "User Research"]
  }
];

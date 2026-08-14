const PORTFOLIO = {

  // ── Personal info ──────────────────────────────────────────
  name:     "Aiden Lowery",
  tagline:  "CS Student · Builder · Competitive Programmer",
  location: "Austin, Texas",
  email:    "aiden.m.lowery@gmail.com",
  github:   "https://github.com/amlelephant",
  linkedin: "https://www.linkedin.com/in/aiden-lowery",
  leetcode: "https://leetcode.com/u/amlelephant/",

  //
  bio: "Hi! I'm an undergraduate Computer Science student at UT Austin. Coding is the " +
       "medium through which I can fully express my creativity, and I make projects in " +
       "fields I genuinely enjoy. I regularly compete in the LeetCode weekly " +
       "competitions in C++, where I am mastering complex data structures and " +
       "algorithms. I am interested in going into embedded software and low level " +
       "systems. I am currently searching for internship opportunities where I can " +
       "learn fast and contribute meaningfully from day one.",



  github_username: "amlelephant",
  

  github_exclude: [
    //"amlelephant.github.io",   // portfolio repo itself
    //"some-private-fork",        // anything else you want hidden
    "amlelephant",                // profile-config repo, nothing to show
    "afternoon",                  // unfinished; also being made private
  ],

  // Projects listed here appear first, in this exact order. Everything
  // else follows, most recently pushed first.
  //
  // KEEP THIS IN SYNC WITH YOUR PINNED REPOS on github.com/amlelephant.
  // The REST API does not expose pins (only the authenticated GraphQL API
  // does), so a static site cannot read them — this list is the stand-in.
  // Whenever you re-pin on GitHub, mirror the new order here.
  //
  // Last synced to pins: 2026-08-14
  github_featured: [
    "Cube-Solver",
    "amlelephant.github.io",
    "Financial-Trading-Platform-algos",
    "Drone",
    "journal",
    "piPicoFishTankFiller",
  ],

  // ── Education ──────────────────────────────────────────────
  education: [
  {
    school: "University of Texas at Austin",
    degree: "B.S. Computer Science",
    dates:  "2026 – Expected May 2029",
    gpa:    "Starting this Fall",
    // Upcoming courses are labelled as such on purpose — never list a class
    // you have not taken as though it were completed.
    details: "Coursework: Data Structures & Algorithms, Discrete Math for CS Majors, " +
             "Multivariable Calculus. Spring 2027: Computer Architecture. " +
             "Entered with sophomore standing from AP credits — on track to graduate in three years.",
  },
  {
    school:  "Friendswood High School",
    degree:  "High School Diploma",
    dates:   "2022 – 2026",
    gpa:     "4.0",       
    details: "Graduated ranked 10/475 in my class",
  },
  ],



  

  // ── Skills ─────────────────────────────────────────────────
  // Mirrors the tech stack on the GitHub profile README, in the same order.
  // Keep these two in sync when either changes.
  skills: [
    // Languages
    "Python", "C++", "Java", "MicroPython", "HTML5", "CSS",
    // Machine Learning & Data
    "PyTorch", "OpenCV", "YOLO", "CUDA", "Pandas", "NumPy",
    // Web & Frameworks
    "Django", "REST APIs",
    // Tools & Platforms
    "Git", "GitHub", "Linux", "Claude Code", "GitHub Copilot",
    // Hardware
    "Raspberry Pi", "Raspberry Pi Pico",
  ],

  // ── Projects ───────────────────────────────────────────────
  projects: [
    {
      name: "Portfolio Website",
      year: "2026",
      description: "This site! I am very passionate about the visual design of older software and I wanted this to show through in my portfolio website.",
      tech: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/amlelephant/amlelephant.github.io",
      live: "https://amlelephant.github.io",
    },
    
  ],

  // ── Work Experience ────────────────────────────────────────
  // Mirrors the "Leadership & Work" section of resume.pdf. This used to be
  // empty, which rendered a blank Experience heading on the Resume window.
  experience: [
    {
      role:    "Team Member",
      company: "Walgreens — Friendswood, TX",
      dates:   "Summer 2026",
      bullets: [
        "Built customer relationships and handled transactions and photo printing.",
        "Troubleshot point-of-sale and printing errors as they came up.",
      ],
    },
    {
      role:    "Team Captain, Varsity Cross Country & Track",
      company: "Friendswood High School",
      dates:   "2022 – 2026",
      bullets: [
        "Led and mentored 40+ teammates.",
        "NHSTCA Cross Country All-American (2025) and Texas All-State.",
      ],
    },
  ],

  // ── Honors ─────────────────────────────────────────────────
  honors: [
    "National Merit Commended Scholar",
    "AP Scholar with Distinction",
    "UT CS Academy for All: Machine Learning (merit, 2024)",
  ],

  // ── Resume PDF link (URL)
  resume_pdf: "resume.pdf",

  // ── Contact message ────────────────────────────────────────
  contact_message: "I'm always open to interesting conversations, collaborations, " +
                   "or internship opportunities. Don't hesitate to reach out!",
};

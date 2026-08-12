// ═══════════════════════════════════════════════════════════════
//  GITHUB PROJECTS FETCHER
//  Pulls public repos from the GitHub API and caches them for
//  the session so both the XP and CRT themes share one fetch.
// ═══════════════════════════════════════════════════════════════

// Cache so we only hit the API once per page load
let _reposCache = null;

const TOPIC_LABELS = {
  "cplusplus":        "C++",
  "c":                "C",
  "csharp":           "C#",
  "dotnet":           ".NET",
  "nodejs":           "Node.js",
  "reactjs":          "React",
  "vuejs":            "Vue.js",
  "typescript":       "TypeScript",
  "javascript":       "JavaScript",
  "python":           "Python",
  "machine-learning": "Machine Learning",
  "deep-learning":    "Deep Learning",
  "artificial-intelligence": "AI",
  "rest-api":         "REST API",
  "html5":            "HTML",
  "css3":             "CSS",
  "html":             "HTML",
  "css":              "CSS",
  "cad":              "CAD",

  // Topics in use that previously fell through and rendered as raw
  // lowercase slugs (e.g. "statistical-arbitrage") on the project cards.
  "ai":                     "AI",
  "alpaca-api":             "Alpaca API",
  "quantitative-finance":   "Quantitative Finance",
  "statistical-arbitrage":  "Statistical Arbitrage",
  "raspberry-pi":           "Raspberry Pi",
  "encryption-decryption":  "Cryptography",
  "windows-desktop":        "Windows Desktop",
  "computervision":         "Computer Vision",
  "fullstack":              "Full Stack",
  "physics":                "Physics",
  "django":                 "Django",
  "flask":                  "Flask",
  "pygame":                 "Pygame",
  "game-development":       "Game Development",
  "collision-detection":    "Collision Detection",
  "opencv":                 "OpenCV",
  "aes":                    "AES",
  "cryptography":           "Cryptography",
  "embedded":               "Embedded",
  "micropython":            "MicroPython",
  "pytorch":                "PyTorch",
  "yolov8":                 "YOLOv8",
};

// Language → readable label map (extend as needed)
const LANG_LABELS = {
  JavaScript: "JavaScript", TypeScript: "TypeScript",
  Python: "Python", Java: "Java", "C++": "C++", "C#": "C#",
  C: "C", Go: "Go", Rust: "Rust", Ruby: "Ruby",
  Swift: "Swift", Kotlin: "Kotlin", PHP: "PHP",
  HTML: "HTML", CSS: "CSS", Shell: "Shell",
  Jupyter_Notebook: "Jupyter", null: "—",
};

/**
 * Order projects for display.
 *
 * Anything named in PORTFOLIO.github_featured comes first, in that exact
 * order; everything else follows, most recently pushed first.
 *
 * Sorting on the creation year alone (as this used to) put ten repos into
 * a single 2025 bucket -- they were all created on the same day -- so the
 * order within that bucket was whatever the API happened to return.
 */
function orderProjects(a, b) {
  const featured = PORTFOLIO.github_featured || [];
  const ra = featured.indexOf(a.name);
  const rb = featured.indexOf(b.name);
  if (ra !== -1 && rb !== -1) return ra - rb;   // both pinned: listed order
  if (ra !== -1) return -1;                     // pinned beats unpinned
  if (rb !== -1) return 1;
  return b.pushed - a.pushed;                   // rest: most recent first
}

/**
 * Fetch all public repos for PORTFOLIO.github_username,
 * filter out excluded ones, order via orderProjects, return array of:
 * { name, description, tech, github, live, year, pushed, stars, forks }
 */
async function fetchGitHubProjects() {
  if (_reposCache) return _reposCache;

  const username = PORTFOLIO.github_username;
  const exclude  = new Set(PORTFOLIO.github_exclude || []);

  try {
    // GitHub allows up to 100 per page; most portfolios won't exceed this
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = await res.json();

    _reposCache = repos
      .filter(r => !r.fork)                        // skip forks
      .filter(r => !r.archived)                    // skip archived
      .filter(r => !exclude.has(r.name))           // skip excluded
      .map(r => ({
        name:        r.name,
        description: r.description || "No description provided.",
        tech: r.topics && r.topics.length > 0
            ? r.topics.map(t => TOPIC_LABELS[t] || t)
            : r.language ? [LANG_LABELS[r.language] || r.language] : [],
        github:      r.html_url,
        live:        r.homepage && r.homepage !== "" ? r.homepage : "#",
        year:        new Date(r.created_at).getFullYear().toString(),
        pushed:      new Date(r.pushed_at).getTime(),
        stars:       r.stargazers_count,
        forks:       r.forks_count,
      }))
      .sort(orderProjects);

    return _reposCache;

  } catch (err) {
    console.warn("GitHub fetch failed:", err.message);
    return [];
  }
}
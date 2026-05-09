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
 * Fetch all public repos for PORTFOLIO.github_username,
 * filter out excluded ones, sort by last pushed, return array of:
 * { name, description, tech, github, live, year, stars, forks }
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
        stars:       r.stargazers_count,
        forks:       r.forks_count,
      }))
      .sort((a,b) => b.year - a.year);

    return _reposCache;

  } catch (err) {
    console.warn("GitHub fetch failed:", err.message);
    return [];
  }
}
export const profile = {
  name: 'Hubert Xu',
  hostname: 'hubert-xu.com',
  role: 'Software engineer · University of Toronto',
  experience: 'Developer @ Amazon, SWE @ MedMe, Prez @ UofTHacks',
  school: 'University of Toronto',
  hobbies: ['Basketball', 'building', 'dilly-dallying'],
  skills: [
    'Python',
    'C',
    'C++',
    'Rust',
    'JavaScript',
    'TypeScript',
    'Java',
    'SQL',
    'Node.js',
    'FastAPI',
    'Express.js',
    'Spring',
    'Next.js',
    'CUDA',
    'PyTorch',
    'Triton',
    'NumPy',
    'OpenCV',
    'OpenClaw',
    'MCP',
    'Docker',
    'K8s',
    'NGINX',
    'AWS',
    'GCP',
    'Azure',
    'Cloudflare',
    'Linux',
    'Terraform',
    'Kafka',
  ],
  companies: [
    { logo: '/logos/amazon.png', name: 'Amazon', role: 'Software Developer' },
    { logo: '/logos/medme.png', name: 'MedMe', role: 'Software Engineer' },
    { logo: '/logos/uofthacks.svg', name: 'UofTHacks', role: 'President' },
  ],
  links: {
    github: 'https://github.com/isolumi',
    linkedin: 'https://www.linkedin.com/in/~hx/',
    email: 'hubertx98@gmail.com',
  },
  projects: [
    {
      name: 'npm (Open Source Contributor)',
      description: 'Fixed a critical prerelease vulnerability resolution bug in metavuln-calculator used by npm audit',
      url: 'https://github.com/npm/metavuln-calculator/pull/166',
    },
    {
      name: 'MiniLLM',
      description: 'LLM serving engine with paged KV caching, speculative decoding, and Triton FlashAttention kernels',
      url: 'https://github.com/Isolumi/MiniLLM',
    },
  ],
  bio: `Hello! I'm Hubert. I'm a CS student at the University of Toronto. I've worked at Amazon and MedMe Health, and I'm currently the president of UofTHacks! I spend most of my time building or playing basketball :3`,
  resumeHighlights: {
    experience: [
      'Amazon — Software Developer (May 2026 – Jul 2026): Built an internal CMS; cut feature rollout time by 77% and page creation time by 26%; resolved 20+ on-call tickets and cut average triage time by 20%',
      'MedMe Health (YC W21) — Software Engineer (May 2025 – Dec 2025): Built a production computer use agent for healthcare data sync, enabling a 7-figure contract pipeline; improved happy-path workflows by 43%, reduced costs by 72%, and cut SEV response time by 300%',
      'UofTHacks — President (May 2024 – Present): Managed infrastructure for 4,000+ total users and 700+ concurrent users; increased traffic by 184% year over year; led 60+ executives',
    ],
    education: 'University of Toronto — Bachelor\'s of Computer Science (Sep 2022 – Jun 2027), Dean\'s List 2023',
  },
  certifications: ['Microsoft Certified: Azure Fundamentals (AZ-900)'],
  systemPrompt: '',
}

profile.systemPrompt = `You are a terminal AI assistant on Hubert Xu's personal website (hubert-xu.com).
Answer questions about Hubert concisely and accurately based on the following information:

Name: ${profile.name}
Role: ${profile.role}
Experience: ${profile.experience}
School: ${profile.school}
Hobbies: ${profile.hobbies.join(', ')}
Skills: ${profile.skills.join(', ')}
GitHub: ${profile.links.github}
LinkedIn: ${profile.links.linkedin}
Email: ${profile.links.email}
Bio: ${profile.bio}
Experience: ${profile.resumeHighlights.experience.join('; ')}
Education: ${profile.resumeHighlights.education}
Projects: ${profile.projects.map(p => `${p.name} — ${p.description}`).join('; ')}
Certifications: ${profile.certifications.join(', ')}

Keep responses brief (2-4 sentences unless detail is requested). Use terminal-friendly formatting (no markdown headers, use plain text or simple lists with -).`

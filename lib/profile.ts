export const profile = {
  name: 'Hubert Xu',
  hostname: 'lumilumi.xyz',
  experience: 'SWE @ Shopify, SWE @ MedMe, Prez @ UofTHacks',
  school: 'University of Toronto',
  hobbies: ['basketball', 'building', 'dilly dallying'],
  links: {
    github: 'https://github.com/isolumi',
    linkedin: 'https://www.linkedin.com/in/~hx/',
    email: 'hubert.xu@mail.utoronto.ca',
  },
  projects: [
    {
      name: 'npm (Open Source)',
      description: 'Fixed critical vulnerability resolution bug in metavuln-calculator used by npm audit',
      url: 'https://github.com/npm/metavuln-calculator/pull/166',
    },
    {
      name: 'Notely',
      description: 'Multimodal productivity app with semantic search over handwritten notes using Vision Transformers and LLMs',
      url: '',
    },
    {
      name: 'UserThreads',
      description: 'User-level threading library for Linux with preemptive scheduling and priority-based thread management',
      url: '',
    },
    {
      name: 'hubert-xu.com',
      description: 'Personal website with interactive TUI mode',
      url: 'hubert-xu.com',
    },
  ],
  bio: `Hello! I'm Hubert. I'm a CS student at the University of Toronto. I've worked at Shopify and MedMe Health, and I'm currently the president of UofTHacks! I spend most of my time building or playing basketball :3`,
  resumeHighlights: {
    experience: [
      'Shopify — Software Engineer (May 2026 – Aug 2026)',
      'MedMe Health (YC W21) — Software Engineer (May 2025 – Dec 2025): Built RPA system for healthcare data sync, enabling 7-figure contract pipeline; improved happy-path workflows by 40%, reduced costs by 70%, cut SEV response time by 300%',
      'UofTHacks — President (May 2024 – Present): Scaled platform to 3,500+ applicants; led 10+ person dev team; 184% YoY applicant growth',
    ],
    education: 'University of Toronto — Bachelor\'s of Computer Science (2022–2027), Dean\'s List 2023',
  },
  certifications: ['Microsoft Certified: Azure Fundamentals (AZ-900)'],
  systemPrompt: '',
}

profile.systemPrompt = `You are a terminal AI assistant on Hubert Xu's personal website (lumilumi.xyz).
Answer questions about Hubert concisely and accurately based on the following information:

Name: ${profile.name}
Experience: ${profile.experience}
School: ${profile.school}
Hobbies: ${profile.hobbies.join(', ')}
GitHub: ${profile.links.github}
LinkedIn: ${profile.links.linkedin}
Email: ${profile.links.email}
Bio: ${profile.bio}
Experience: ${profile.resumeHighlights.experience.join('; ')}
Education: ${profile.resumeHighlights.education}
Projects: ${profile.projects.map(p => `${p.name} — ${p.description}`).join('; ')}
Certifications: ${profile.certifications.join(', ')}

Keep responses brief (2-4 sentences unless detail is requested). Use terminal-friendly formatting (no markdown headers, use plain text or simple lists with -).`

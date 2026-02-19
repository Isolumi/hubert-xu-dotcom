export const profile = {
  name: 'Hubert Xu',
  hostname: 'lumilumi.xyz',
  role: 'Software Engineer / Student',
  school: 'University of Waterloo',
  skills: ['TypeScript', 'React', 'Next.js', 'Python', 'Go', 'PostgreSQL'],
  links: {
    github: 'https://github.com/isolumi',
    linkedin: 'https://linkedin.com/in/hubertxu',
    email: 'hubert@lumilumi.xyz',
  },
  projects: [
    {
      name: 'lumilumi.xyz',
      description: 'Personal website with interactive TUI mode',
      url: 'https://lumilumi.xyz',
    },
  ],
  bio: `Hi, I'm Hubert. I build software and study at UWaterloo. I'm interested in developer tools, distributed systems, and creative interfaces.`,
  resumeHighlights: {
    experience: [] as string[],
    education: 'University of Waterloo — Computer Science',
  },
  systemPrompt: '',
}

profile.systemPrompt = `You are a terminal AI assistant on Hubert Xu's personal website (lumilumi.xyz).
Answer questions about Hubert concisely and accurately based on the following information:

Name: ${profile.name}
Role: ${profile.role}
School: ${profile.school}
Skills: ${profile.skills.join(', ')}
GitHub: ${profile.links.github}
LinkedIn: ${profile.links.linkedin}
Email: ${profile.links.email}
Bio: ${profile.bio}
Projects: ${profile.projects.map(p => `${p.name} — ${p.description}`).join('; ')}

Keep responses brief (2-4 sentences unless detail is requested). Use terminal-friendly formatting (no markdown headers, use plain text or simple lists with -).\``

import { profile } from './profile'

export type CommandOutput = {
  type: 'text' | 'list' | 'clear'
  content?: string
  items?: { label: string; value: string; url?: string }[]
}

export type Command = {
  name: string
  description: string
  handler: () => CommandOutput
}

export const ALL_COMMANDS: Command[] = [
  {
    name: 'about',
    description: "Who is Hubert?",
    handler: () => ({
      type: 'text',
      content: profile.bio,
    }),
  },
  {
    name: 'projects',
    description: "Projects I've built",
    handler: () => ({
      type: 'list',
      items: profile.projects.map(p => ({
        label: p.name,
        value: p.description,
        url: p.url,
      })),
    }),
  },
  {
    name: 'resume',
    description: 'Education, experience, and skills',
    handler: () => ({
      type: 'list',
      items: [
        { label: 'Education', value: profile.resumeHighlights.education },
        { label: 'Skills', value: profile.skills.join(', ') },
        ...profile.resumeHighlights.experience.map(e => ({
          label: 'Experience',
          value: String(e),
        })),
      ],
    }),
  },
  {
    name: 'contact',
    description: 'How to reach me',
    handler: () => ({
      type: 'list',
      items: [
        { label: 'Email', value: profile.links.email, url: `mailto:${profile.links.email}` },
        { label: 'GitHub', value: profile.links.github, url: profile.links.github },
        { label: 'LinkedIn', value: profile.links.linkedin, url: profile.links.linkedin },
      ],
    }),
  },
  {
    name: 'help',
    description: 'List all commands',
    handler: () => ({
      type: 'list',
      items: ALL_COMMANDS.map(cmd => ({
        label: `/${cmd.name}`,
        value: cmd.description,
      })),
    }),
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    handler: () => ({ type: 'clear' }),
  },
]

export function getCommand(name: string): Command | undefined {
  return ALL_COMMANDS.find(cmd => cmd.name === name)
}

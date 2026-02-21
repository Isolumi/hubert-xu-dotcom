import fs from 'fs'
import path from 'path'
import HomeClient from '@/components/HomeClient'

export default function Home() {
  const asciiArt = fs.readFileSync(path.join(process.cwd(), 'public/ascii-art.txt'), 'utf-8')

  return <HomeClient asciiArt={asciiArt} />
}

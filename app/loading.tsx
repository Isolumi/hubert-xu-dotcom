export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-mono flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <pre className="text-[#8b87ff] text-xs leading-tight select-none">{`  ██╗     ██╗   ██╗███╗   ███╗██╗
  ██║     ██║   ██║████╗ ████║██║
  ██║     ██║   ██║██╔████╔██║██║
  ██║     ██║   ██║██║╚██╔╝██║██║
  ███████╗╚██████╔╝██║ ╚═╝ ██║██║
  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝`}</pre>
        <span className="text-[#555] text-sm animate-pulse">initializing...</span>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050605] text-[#e8ece9] font-mono flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <pre className="text-[#87b9ff] text-xs leading-tight select-none">{`  ██╗     ██╗   ██╗███╗   ███╗██╗
  ██║     ██║   ██║████╗ ████║██║
  ██║     ██║   ██║██╔████╔██║██║
  ██║     ██║   ██║██║╚██╔╝██║██║
  ███████╗╚██████╔╝██║ ╚═╝ ██║██║
  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝`}</pre>
        <span className="text-[#68716c] text-sm animate-pulse">initializing...</span>
      </div>
    </div>
  )
}

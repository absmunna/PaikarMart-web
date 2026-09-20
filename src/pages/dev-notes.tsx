import { devNotes } from "@/data/devNotes";
import { GlassCard } from "@/components/ui/GlassCard";

export default function DevNotes() {
  return (
    <div className="flex flex-col gap-8 p-4 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold text-white">Developer Notes</h1>
        <p className="text-white/60 mt-1">System architecture and AI instructions.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 sticky top-24">
          <h3 className="font-semibold text-white mb-2 px-3">Contents</h3>
          {devNotes.map((note, i) => (
            <a 
              key={i} 
              href={`#section-${i}`}
              className="px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {note.title}
            </a>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-8">
          {devNotes.map((note, i) => (
            <div key={i} id={`section-${i}`} className="scroll-mt-24">
              <GlassCard className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/10">{note.title}</h2>
                <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVideoUnlock } from "@/features/digital-content/VideoUnlockContext";

interface VideoPlayerProps {
  videoId: string;
  previewUrl: string;
  fullUrl: string;
  previewSeconds: number;
  thumbnail?: string;
  price: number;
  currency: string;
  /** Called when the user clicks "Unlock". Should kick off purchase flow. */
  onPurchase?: () => void;
  className?: string;
}

export function VideoPlayer({
  videoId, previewUrl, fullUrl, previewSeconds, thumbnail, price, currency,
  onPurchase, className,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { hasVideoUnlocked } = useVideoUnlock();
  const unlocked = hasVideoUnlocked(videoId);
  const [previewEnded, setPreviewEnded] = useState(false);

  useEffect(() => {
    setPreviewEnded(false);
    const v = ref.current;
    if (!v) return;
    const handler = () => {
      if (!unlocked && v.currentTime >= previewSeconds) {
        v.pause();
        v.currentTime = previewSeconds;
        setPreviewEnded(true);
      }
    };
    v.addEventListener("timeupdate", handler);
    return () => v.removeEventListener("timeupdate", handler);
  }, [previewSeconds, unlocked, videoId]);

  const src = unlocked ? fullUrl : previewUrl;

  return (
    <div className={cn("relative rounded-xl overflow-hidden bg-black border border-white/10", className)}>
      <video
        ref={ref}
        src={src}
        poster={thumbnail}
        controls
        playsInline
        className="w-full aspect-video"
      />
      {!unlocked && (
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs text-white">
          <Play className="h-3.5 w-3.5" /> Free preview · {Math.floor(previewSeconds / 60)}m
        </div>
      )}
      {!unlocked && previewEnded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center">
          <Lock className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold text-white">Preview ended</h3>
          <p className="text-sm text-white/70">Unlock the full video to keep watching.</p>
          <Button size="lg" onClick={onPurchase}>
            Unlock for {currency} {price.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Video URL Parser for YouTube, Facebook & Direct Videos
 * Converts raw URLs into seamless iframe embeds or direct video sources
 */

export interface ParsedVideoInfo {
  isExternalLink: boolean;
  externalSource: 'youtube' | 'facebook' | 'direct';
  embedUrl: string;
  youtubeId?: string;
}

export function parseVideoUrl(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl) {
    return {
      isExternalLink: false,
      externalSource: 'direct',
      embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    };
  }

  const url = rawUrl.trim();

  // 1. YouTube Video URL Parsing (Standard, Shorts, Mobile, Short links)
  // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // e.g. https://youtu.be/dQw4w9WgXcQ
  // e.g. https://www.youtube.com/shorts/3P838q6w_kU
  const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(youtubeRegExp);

  if (ytMatch && ytMatch[2].length === 11) {
    const youtubeId = ytMatch[2];
    return {
      isExternalLink: true,
      externalSource: 'youtube',
      youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`
    };
  }

  // 2. Facebook Video / Reels URL Parsing
  // e.g. https://www.facebook.com/watch/?v=123456789
  // e.g. https://fb.watch/abcd1234/
  // e.g. https://www.facebook.com/reel/123456789
  // e.g. https://www.facebook.com/user/videos/123456789
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    const encodedFbUrl = encodeURIComponent(url);
    return {
      isExternalLink: true,
      externalSource: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedFbUrl}&show_text=false&autoplay=true`
    };
  }

  // 3. Direct HTML5 Video File URL (.mp4, .webm, blob URL, etc)
  return {
    isExternalLink: false,
    externalSource: 'direct',
    embedUrl: url
  };
}

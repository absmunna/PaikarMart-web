import { VideoCategoryType } from '../types';

export interface VideoValidationResult {
  isValid: boolean;
  durationSeconds: number;
  formattedDuration: string;
  videoWidth?: number;
  videoHeight?: number;
  aspectRatio: '1:1' | '16:9' | '9:16';
  isAspectRatioSquare: boolean;
  isExternalLink: boolean;
  externalSource?: 'youtube' | 'facebook' | 'direct';
  error?: string;
  warning?: string;
}

/**
 * Format seconds to M:SS or MM:SS
 */
export function formatVideoDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Validates video duration against 3 Category constraints:
 * - 'creator': Max 3 minutes (180 seconds)
 * - 'seller_product': 30 to 60 seconds
 * - 'vlog_premium': 3 to 10 minutes (180 to 600 seconds)
 */
export function validateVideoDuration(
  durationSeconds: number,
  categoryType: VideoCategoryType
): { isValid: boolean; error?: string; formattedDuration: string } {
  const formattedDuration = formatVideoDuration(durationSeconds);

  if (categoryType === 'creator') {
    if (durationSeconds > 180) {
      return {
        isValid: false,
        error: `কনটেন্ট ক্রিয়েটর ভিডিওর সময়সীমা সর্বোচ্চ ৩ মিনিট (১৮০ সেকেন্ড)। আপনার ফাইলটি ${formattedDuration} মিনিট।`,
        formattedDuration
      };
    }
  } else if (categoryType === 'seller_product') {
    if (durationSeconds < 30) {
      return {
        isValid: false,
        error: `প্রোডাক্ট সেলিং ভিডিওর সময়সীমা সর্বনিম্ন ৩০ সেকেন্ড হতে হবে। আপনার ফাইলটি ${formattedDuration} মিনিট।`,
        formattedDuration
      };
    }
    if (durationSeconds > 60) {
      return {
        isValid: false,
        error: `প্রোডাক্ট সেলিং ভিডিওর সময়সীমা সর্বোচ্চ ৬০ সেকেন্ড (১ মিনিট)। আপনার ফাইলটি ${formattedDuration} মিনিট।`,
        formattedDuration
      };
    }
  } else if (categoryType === 'vlog_premium') {
    if (durationSeconds < 180) {
      return {
        isValid: false,
        error: `পার্সোনাল ব্লগ ভিডিওর সময়সীমা সর্বনিম্ন ৩ মিনিট (১৮০ সেকেন্ড) হতে হবে। আপনার ফাইলটি ${formattedDuration} মিনিট।`,
        formattedDuration
      };
    }
    if (durationSeconds > 600) {
      return {
        isValid: false,
        error: `পার্সোনাল ব্লগ ভিডিওর সময়সীমা সর্বোচ্চ ১০ মিনিট হতে হবে। আপনার ফাইলটি ${formattedDuration} মিনিট।`,
        formattedDuration
      };
    }
  }

  return { isValid: true, formattedDuration };
}

/**
 * Asynchronously inspects an HTML5 video File object to validate duration and 1:1 aspect ratio
 */
export function validateVideoFile(
  file: File,
  categoryType: VideoCategoryType
): Promise<VideoValidationResult> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('video/')) {
      resolve({
        isValid: false,
        durationSeconds: 0,
        formattedDuration: '0:00',
        aspectRatio: '1:1',
        isAspectRatioSquare: true,
        isExternalLink: false,
        externalSource: 'direct',
        error: 'একটি সঠিক ভিডিও ফাইল নির্বাচন করুন (MP4, WebM, MOV)'
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const durationSeconds = tempVideo.duration;
      const videoWidth = tempVideo.videoWidth;
      const videoHeight = tempVideo.videoHeight;

      // Check aspect ratio (width vs height)
      const ratio = videoWidth / (videoHeight || 1);
      const isAspectRatioSquare = Math.abs(ratio - 1.0) < 0.05; // close to 1.0 ratio
      
      let detectedRatio: '1:1' | '16:9' | '9:16' = '1:1';
      if (ratio > 1.3) detectedRatio = '16:9';
      else if (ratio < 0.8) detectedRatio = '9:16';

      // Duration constraint check
      const durationCheck = validateVideoDuration(durationSeconds, categoryType);

      let warning: string | undefined;
      if (!isAspectRatioSquare) {
        warning = `সরাসরি ফাইল আপলোডের ক্ষেত্রে ১:১ (Square) রেশিও প্রযোজ্য। অ্যাপে প্রদর্শনের সময় ভিডিওটি ১:১ স্কয়ার স্ক্রিনে ক্রপ করা হবে।`;
      }

      if (!durationCheck.isValid) {
        resolve({
          isValid: false,
          durationSeconds,
          formattedDuration: durationCheck.formattedDuration,
          videoWidth,
          videoHeight,
          aspectRatio: '1:1', // Enforced 1:1 for direct uploads
          isAspectRatioSquare,
          isExternalLink: false,
          externalSource: 'direct',
          error: durationCheck.error,
          warning
        });
        return;
      }

      resolve({
        isValid: true,
        durationSeconds,
        formattedDuration: durationCheck.formattedDuration,
        videoWidth,
        videoHeight,
        aspectRatio: '1:1', // Enforced 1:1 for direct uploads
        isAspectRatioSquare,
        isExternalLink: false,
        externalSource: 'direct',
        warning
      });
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        isValid: false,
        durationSeconds: 0,
        formattedDuration: '0:00',
        aspectRatio: '1:1',
        isAspectRatioSquare: true,
        isExternalLink: false,
        externalSource: 'direct',
        error: 'ভিডিও ফাইলের মেটাডেটা পড়া সম্ভব হয়নি।'
      });
    };
  });
}

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Video, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type PostType = 'product' | 'service' | 'bid' | 'video';

const FIELD_MAP: Record<PostType, string[]> = {
  product: ['title', 'description', 'price', 'category', 'subcategory', 'stock', 'images'],
  service: ['title', 'description', 'category', 'subcategory', 'pricingTiers', 'availability', 'images'],
  bid: ['title', 'description', 'category', 'budgetRange', 'deadline', 'attachments'],
  video: ['title', 'description', 'category', 'file', 'thumbnail', 'duration', 'monetization'],
};

const CATEGORIES = [
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'services', name: 'Services' },
  { id: 'home', name: 'Home & Lifestyle' },
];

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().optional(),
  stock: z.string().optional(),
  images: z.string().optional(),
  budgetRange: z.string().optional(),
  videoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof postSchema>;

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<PostType>('product');
  const fields = useMemo(() => FIELD_MAP[postType], [postType]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      stock: '',
      images: '',
      budgetRange: '',
      videoUrl: '',
    },
  });

  const imagesValue = watch('images') || '';
  const previewImages = useMemo(() => {
    return imagesValue
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [imagesValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Submitting post type:', postType, 'Data:', data);
      toast.success(`Successfully published new ${postType}!`);
      navigate(-1);
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pt-safe pb-24 md:pb-8 px-4 mt-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-white/70 hover:text-white w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
        <p className="text-white/60">Choose a post type to update the form fields dynamically.</p>
      </div>

      <div className="w-full">
        <label className="text-sm font-medium text-white mb-2 block">Post Type</label>
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value as PostType)}
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:border-primary transition-colors"
        >
          <option value="product" className="bg-[#0f172a]">Product</option>
          <option value="service" className="bg-[#0f172a]">Service</option>
          <option value="bid" className="bg-[#0f172a]">Demand / Bid</option>
          <option value="video" className="bg-[#0f172a]">Video</option>
        </select>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <GlassCard className="p-6 flex flex-col gap-5">
          {fields.includes('title') && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Title</label>
              <Input
                {...register('title')}
                placeholder="Name or Title"
                className="bg-white/5 border-white/10 text-white"
              />
              {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
            </div>
          )}

          {fields.includes('description') && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Description</label>
              <Textarea
                {...register('description')}
                placeholder="Detailed description..."
                className="bg-white/5 border-white/10 text-white min-h-[120px]"
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.includes('price') && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Price (BDT)</label>
                <Input
                  {...register('price')}
                  type="number"
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            )}

            {fields.includes('budgetRange') && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Budget Range (BDT)</label>
                <Input
                  {...register('budgetRange')}
                  placeholder="e.g. 1000 - 5000"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            )}

            {fields.includes('stock') && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Stock / Quantity</label>
                <Input
                  {...register('stock')}
                  type="number"
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            )}

            {fields.includes('category') && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white">Category</label>
                <select className="w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-sm text-white h-10">
                  <option value="" disabled className="bg-[#0f172a]">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0f172a]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </GlassCard>

        {(fields.includes('images') || fields.includes('attachments')) && (
          <GlassCard className="p-6 flex flex-col gap-5">
            <div>
              <div className="text-sm font-medium text-white mb-2">Media & Attachments</div>
              <p className="text-xs text-white/50 mb-3">
                Paste image URLs separated by commas for preview.
              </p>
              <div className="flex flex-wrap gap-3 mb-3">
                {previewImages.length === 0 ? (
                  <div className="h-24 w-24 rounded-lg bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-white/50">
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">Preview</span>
                  </div>
                ) : (
                  previewImages.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border border-white/10"
                    />
                  ))
                )}
              </div>
              <Textarea
                {...register('images')}
                placeholder="https://image1.jpg, https://image2.jpg"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </GlassCard>
        )}

        {fields.includes('file') && (
          <GlassCard className="p-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Video URL</label>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <Input
                  {...register('videoUrl')}
                  placeholder="https://video.mp4"
                  className="bg-white/5 border-white/10 text-white flex-1 h-10"
                />
              </div>
            </div>
          </GlassCard>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 min-w-24"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 min-w-32 active:scale-95 transition-transform"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
}

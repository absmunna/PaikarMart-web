import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit3, Image as ImageIcon } from 'lucide-react';
import { useSellerDashboardStore, SellerProduct } from '@/modules/seller/sellerDashboardStore';
import { toast } from 'sonner';

const productSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Invalid price'),
  originalPrice: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Invalid stock'),
  category: z.string().optional(),
  portal: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: SellerProduct | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct } = useSellerDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '10',
      category: 'Fashion',
      portal: 'b2c',
      image: '',
    },
  });

  useEffect(() => {
    if (isEditing && product) {
      form.reset({
        title: product.title,
        description: '', // Assume description is in a full catalog in real app
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: 'Fashion',
        portal: 'b2c',
        image: product.image,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '10',
        category: 'Fashion',
        portal: 'b2c',
        image: '',
      });
    }
  }, [product, isEditing, form, isOpen]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const newStock = Number(values.stock);

      if (isEditing && product) {
        updateProduct(product.id, {
          title: values.title,
          price: Number(values.price),
          image: values.image || 'https://via.placeholder.com/300',
          stock: newStock,
          status: newStock > 0 ? 'active' : 'out_of_stock'
        });
        toast.success('Product updated successfully!');
      } else {
        addProduct({
          id: `PROD-${Date.now()}`,
          title: values.title,
          price: Number(values.price),
          image: values.image || 'https://via.placeholder.com/300',
          stock: newStock,
          views: 0,
          sales: 0,
          conversion: 0,
          isBoosted: false,
          status: newStock > 0 ? 'active' : 'out_of_stock'
        });
        toast.success('Product listed successfully!');
      }

      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update product.' : 'Failed to list product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[var(--pm-surface)]/95 border-[var(--pm-border)] text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEditing ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-[var(--pm-accent)]" />}
            {isEditing ? 'পণ্য আপডেট করুন (Update Product)' : 'নতুন পণ্য যোগ করুন (List New Product)'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isEditing ? 'আপনার পণ্যের তথ্য পরিবর্তন করুন।' : 'আপনার পণ্যটি আমাদের মার্কেটপ্লেস এবং রিটেইল পোর্টালে প্রকাশ করুন।'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Premium Cotton Panjabi" className="bg-black/20 border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Publish Portal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-white/5">
                          <SelectValue placeholder="Select Portal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-white/5 text-white">
                        <SelectItem value="b2c">Retail Portal (B2C)</SelectItem>
                        <SelectItem value="b2b">Wholesale Hub (B2B)</SelectItem>
                        <SelectItem value="pk-store">PK Store Exclusive</SelectItem>
                        <SelectItem value="pk-shop">PK Shop (Handmade)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase font-bold text-zinc-500">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product details, materials, and features..." 
                      className="bg-black/20 border-white/5 min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Price (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2500" className="bg-black/20 border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Discount Price (Old)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3000" className="bg-black/20 border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Inventory Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50" className="bg-black/20 border-white/5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-white/5">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-white/5 text-white">
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Home">Home & Living</SelectItem>
                        <SelectItem value="Grocery">Grocery</SelectItem>
                        <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase font-bold text-zinc-500">Cover Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://..." className="bg-black/20 border-white/5" {...field} />
                        <Button type="button" size="icon" variant="outline" className="shrink-0 border-white/10">
                          <ImageIcon className="w-4 h-4 text-zinc-400" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="text-white">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className={isEditing ? "bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "bg-[var(--pm-accent)] hover:bg-[#FF8A00] text-black font-bold px-8 shadow-[0_0_20px_var(--pm-accent)]/30"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'List Product Now'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

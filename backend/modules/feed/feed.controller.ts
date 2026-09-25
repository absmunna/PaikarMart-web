import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (!process.env.DATABASE_URL) {
      // Dev mode mock fallback
      if (type === 'video') {
        return res.json([
          {
            id: 'reel_1',
            content: 'আমাদের খামারের সম্পূর্ণ প্রাকৃতিক উপায়ে উৎপাদিত মধুর রিভিউ দেখুন! 🍯✨',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4',
            likeCount: 4200,
            commentCount: 156,
            shareCount: 89,
            type: 'video',
            createdAt: new Date(),
            author: { id: 'v_1', name: 'Fresh Valley Farm', role: 'seller', avatarUrl: '🥬', verified: true },
            product: {
              id: 'p_honey',
              title: 'খাঁটি সুন্দরবনের মধু (১ কেজি)',
              price: 850,
              images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&auto=format&fit=crop']
            }
          },
          {
            id: 'reel_2',
            content: 'নতুন ধামাকা গ্যাজেট! স্মার্ট ওয়াচ সিরিজ ৯ এর প্রিমিয়াম আনবক্সিং ভিডিও। ⌚🔥',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smartwatch-on-a-users-wrist-40242-large.mp4',
            likeCount: 2950,
            commentCount: 98,
            shareCount: 40,
            type: 'video',
            createdAt: new Date(),
            author: { id: 'v_2', name: 'Rahim Electronics', role: 'seller', avatarUrl: '🔌', verified: false },
            product: {
              id: 'p_watch',
              title: 'Smart Watch Series 9 Ultimate',
              price: 2500,
              images: ['https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=200&auto=format&fit=crop']
            }
          }
        ]);
      }

      return res.json([
        {
          id: '1',
          content: 'Just harvested fresh organic spinach! Special wholesale price for today. 🥬✨',
          images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=640&auto=format&fit=crop'],
          likeCount: 1200,
          commentCount: 45,
          shareCount: 10,
          type: 'status',
          createdAt: new Date(),
          author: { name: 'Fresh Valley Farm', role: 'seller' }
        },
        {
          id: '2',
          content: 'New arrivals! Smart watch series 9 is now in stock. Visit us for an exclusive demo. ⌚',
          images: ['https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=640&auto=format&fit=crop'],
          likeCount: 850,
          commentCount: 12,
          shareCount: 5,
          type: 'status',
          createdAt: new Date(),
          author: { name: 'Rahim Electronics', role: 'seller' }
        }
      ]);
    }

    const where: any = {};
    if (type && type !== 'all') {
      where.type = String(type);
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(posts);
  } catch (error) {
    console.error('Fetch Posts Error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, type, images, videoUrl, productId } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `post-${Date.now()}`,
        content,
        type: type || 'status',
        images: images || [],
        videoUrl: videoUrl || null,
        productId: productId || null,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        createdAt: new Date(),
        author: { name: 'Demo Seller', role: 'seller' }
      });
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo-seller@paikarmart.com',
          name: 'Demo Seller',
          password: 'hashedpassword',
          role: 'seller'
        }
      });
    }

    const post = await prisma.post.create({
      data: {
        content,
        type: type || 'status',
        images: images || [],
        videoUrl,
        productId,
        authorUserId: user.id
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json({ message: 'Post liked successfully (mock)' });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1
        }
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Like Post Error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.json([
        { id: 'c_1', content: 'Nice spinach! Will order soon.', createdAt: new Date(), author: { name: 'Sabbir Hossain' } }
      ]);
    }

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.status(201).json({
        id: `c-${Date.now()}`,
        content,
        createdAt: new Date(),
        author: { name: 'Demo User' }
      });
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo-buyer@paikarmart.com',
          name: 'Demo Buyer',
          password: 'hashedpassword',
          role: 'buyer'
        }
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorUserId: user.id
      }
    });

    // Increment comment count on the post
    await prisma.post.update({
      where: { id },
      data: {
        commentCount: {
          increment: 1
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create Comment Error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getStories = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([
        { id: '1', imageUrl: '🥬', caption: 'Fresh Spinach', author: { name: 'Fresh Valley' } },
        { id: '2', imageUrl: '🔌', caption: 'Electronics deals', author: { name: 'Rahim Elec' } }
      ]);
    }

    const stories = await prisma.story.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(stories);
  } catch (error) {
    console.error('Get Stories Error:', error);
    res.status(500).json({ error: 'Failed to get stories' });
  }
};

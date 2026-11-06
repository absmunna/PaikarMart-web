import { Router } from 'express';
import { 
  getSocialFeed, 
  getCommerceFeed, 
  getPosts, 
  createPost, 
  likePost, 
  toggleFollowStore,
  toggleSavePost,
  getComments, 
  createComment, 
  getStories,
  getUserLocation,
  updateUserLocation,
  getPostBids,
  createPostBid,
  acceptPostBid
} from './feed.controller';

const router = Router();

// Dual Feed Core APIs requested by spec
router.get('/social', getSocialFeed);
router.get('/commerce', getCommerceFeed);

// Location recommendation engine
router.get('/location', getUserLocation);
router.post('/location', updateUserLocation);

// Feed Interactions & Reverse-Auction Bids
router.post('/posts/:id/like', likePost);
router.post('/posts/:sellerId/follow', toggleFollowStore);
router.post('/posts/:id/save', toggleSavePost);
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', createComment);
router.get('/posts/:id/bids', getPostBids);
router.post('/posts/:id/bids', createPostBid);
router.patch('/bids/:bidId/accept', acceptPostBid);
router.get('/stories', getStories);

// Legacy / Direct access compatibility
router.get('/', getSocialFeed);
router.get('/posts', getSocialFeed);
router.post('/posts', createPost);

export const feedRoutes = router;

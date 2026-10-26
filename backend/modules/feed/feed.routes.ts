import { Router } from 'express';
import { getPosts, createPost, likePost, getComments, createComment, getStories } from './feed.controller';

const router = Router();

router.get('/', getPosts);
router.get('/posts', getPosts);
router.post('/posts', createPost);

router.post('/posts/:id/like', likePost);
router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', createComment);
router.get('/stories', getStories);

export const feedRoutes = router;

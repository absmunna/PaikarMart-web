import { Route } from 'react-router-dom';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import { ProductDetails } from '../pages/ProductDetails';
import Login from '../modules/auth/pages/Login';
import { Register } from '../modules/auth/pages/Register';
import Demand from '../pages/Demand';
import { DemandDetail } from '../pages/DemandDetail';
import Reels from '../pages/Reels';
import Profile from '../pages/Profile';
import { SearchPage } from '../pages/SearchPage';
import Notifications from '@/features/notifications/pages/notifications';
import ChatList from '@/portals/messages/pages/ChatList';
import ChatDetail from '@/portals/messages/pages/ChatDetail';

export const publicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/demand" element={<Demand />} />
    <Route path="/demand/:id" element={<DemandDetail />} />
    <Route path="/reels" element={<Reels />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/messages" element={<ChatList />} />
    <Route path="/messages/:id" element={<ChatDetail />} />
  </>
);

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
  </>
);

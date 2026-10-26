export const devNotes = [
  {
    title: "System Overview",
    content: "PaikarMart is a unified global social-commerce and marketplace application. It integrates a continuous feed of products and content, a marketplace for direct purchases, and a demand-driven vendor matching system.",
  },
  {
    title: "Features List",
    content: "1. Social Home Feed: Stories and posts from vendors and users.\n2. Marketplace: Categorized grid of products with advanced filtering.\n3. Vendor Directory: categorized listings of sellers and service providers.\n4. Local Discovery: Distance-based product queries.\n5. Reels: Auto-playing vertical video feed.\n6. Demand System: Post requests for products/services and get matched with vendors.\n7. E-commerce Core: Cart, checkout, and order history.\n8. Notifications: Real-time alerts for matches, orders, and messages.\n9. Seller Dashboard: Analytics and product management.",
  },
  {
    title: "API Plan",
    content: "The backend is a REST API powered by Node.js, Express, and Drizzle ORM. We use React Query via orval-generated hooks for data fetching, caching, and optimistic updates. Endpoints are grouped into: /posts, /products, /vendors, /demands, /cart, /orders, /notifications, and /stats.",
  },
  {
    title: "Database Plan",
    content: "Schema includes Users, Vendors, Products, Posts, Demands, CartItems, Orders, and Notifications. Vendors are a specialized profile linked to Users. Demands implement a basic matching algorithm based on category and location.",
  },
  {
    title: "Future Roadmap",
    content: "- Real-time messaging between buyers and vendors using WebSockets.\n- Live stream shopping events.\n- Crypto/Web3 payment integrations.\n- AI-driven product recommendations and personalized feed ranking.\n- Automated seller onboarding verification.",
  },
  {
    title: "AI Instructions",
    content: "Maintain a dark glassmorphism aesthetic. All interactive elements must have feedback. Leverage lucide-react for iconography. No emojis. Assume mobile-first layout with desktop scaling. Use the exact generated API hooks without modifying their signatures.",
  }
];

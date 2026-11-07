import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

const SEED_PRODUCTS = [
  {
    id: "sp_1",
    title: "Handwoven Cotton Throw",
    description: "Soft, breathable cotton throw, ethically made by local artisans.",
    price: 38,
    stock: 24,
    categoryId: "home",
    categoryName: "Home & Lifestyle",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
    tags: ["home", "cotton", "handmade"],
    views: 248,
    status: 'active',
    sellerId: "seed-seller-1",
    sellerName: "Aurora Goods Co.",
  },
  {
    id: "sp_2",
    title: "Ceramic Pour-over Set",
    description: "A minimalist matte ceramic pour-over kit for the perfect morning cup.",
    price: 54,
    stock: 12,
    categoryId: "home",
    categoryName: "Kitchen",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"],
    tags: ["coffee", "ceramic"],
    views: 412,
    status: 'active',
    sellerId: "seed-seller-1",
    sellerName: "Aurora Goods Co.",
  },
  {
    id: "sp_3",
    title: "Linen Tote – Sand",
    description: "Heavyweight linen tote with reinforced handles. Holds groceries for days.",
    price: 22,
    stock: 0,
    categoryId: "fashion",
    categoryName: "Fashion",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1593998066526-65fcab3021a2?w=600"],
    tags: ["bag", "linen"],
    views: 96,
    status: 'out_of_stock',
    sellerId: "seed-seller-1",
    sellerName: "Aurora Goods Co.",
  },
  {
    id: "sp_4",
    title: "Homemade Chocolate Cake",
    description: "Rich, moist dark chocolate cake made at home with premium ingredients.",
    price: 15,
    stock: 5,
    categoryId: "homemade",
    categoryName: "Home Made",
    type: "homemade",
    location: "Dhanmondi, Dhaka",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"],
    tags: ["cake", "homemade", "food"],
    views: 156,
    status: 'active',
    sellerId: "seed-seller-2",
    sellerName: "Sweet Cravings",
  },
  {
    id: "sp_5",
    title: "Fast Pharmacy - Medicine Delivery",
    description: "Life-saving medicines and healthcare products delivered fast.",
    price: 10,
    stock: 100,
    categoryId: "pharmacy",
    categoryName: "Pharmacy",
    type: "nearby",
    location: "Gulshan, Dhaka",
    images: ["https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600"],
    tags: ["medicine", "health", "pharmacy"],
    views: 89,
    status: 'active',
    sellerId: "seed-seller-3",
    sellerName: "QuickCare Pharma",
  },
  {
    id: "sp_6",
    title: "Elite AC Servicing",
    description: "Professional AC maintenance and repair at your doorstep.",
    price: 25,
    stock: 10,
    categoryId: "services",
    categoryName: "Services",
    type: "service",
    location: "Banani, Dhaka",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"],
    tags: ["ac", "repair", "service"],
    views: 230,
    status: 'active',
    sellerId: "seed-seller-4",
    sellerName: "Elite Services Ltd.",
  },
];

export async function seedProducts() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    
    // Only attempt seed writes if products collection is empty and user is authenticated
    if (snapshot.empty && auth.currentUser) {
      console.log("Seeding initial products to Firestore...");
      for (const product of SEED_PRODUCTS) {
        await setDoc(doc(productsCol, product.id), {
          ...product,
          sellerId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      console.log("Seeding complete.");
    }
  } catch (error) {
    console.warn("Product seeding skipped:", error);
  }
}

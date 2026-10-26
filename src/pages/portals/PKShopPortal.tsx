import { ProductReviews } from "../../components/reviews/ProductReviews";

export default function PKShopPortal() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center text-center px-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 text-white">
          <span className="text-3xl font-bold">F</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fashion Hub Bd</h1>
        <p className="text-gray-500 max-w-md">
          Premium verified products and merchandise.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Store Products</h2>
             <p className="text-gray-500">Products will be listed here...</p>
           </div>
        </div>
        <div className="lg:col-span-1">
          <ProductReviews shopId="demo-seller-1" />
        </div>
      </div>
    </div>
  );
}

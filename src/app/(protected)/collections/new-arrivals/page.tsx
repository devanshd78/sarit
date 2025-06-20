// src/app/collections/all/page.tsx
import { ProductCard, Product } from "@/components/ProductCard";
import { FilterMenu } from "@/components/FilterMenu";
import { SortMenu } from "@/components/SortMenu";

// replace with real data
const products: Product[] = [
  {
    id: "1",
    name: "Tie-Dye Backpack: Lightweight Multi-Compartment Design",
    image: "/images/p1.jpg",
    rating: 4.5,
    reviews: 6,
    price: 849,
    compareAt: 1999,
    onSale: true,
  },
  // …other products…
];

export default function CollectionsPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-black mb-6">Products</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <FilterMenu />
          <SortMenu total={products.length} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
"use client"
import { Navbar5 } from "@/components/navbar5";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts, Product } from "@/lib/get-products";
import { useQuery } from "@tanstack/react-query";
import { Car, Eye, Grid3X3, Heart, List, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchStore } from "@/lib/search-store";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const searchQuery = useSearchStore((state)=> state.searchTerm)
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery)
  const { addToCart, isAuthenticated } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(handler)
  }, [searchQuery])

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

   const filteredproducts = data?.filter((product) =>
    product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

   if (isLoading) {
    return (
      <div className="p-4 grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-24" />
        ))}
      </div>
    )
  }

   if (isError) return <p className="text-red-500 p-4">Failed to load posts.</p>
   if(filteredproducts?.length === 0) return (
    <section>
    <Navbar5 />
    <p className="text-gray-900 dark:text-gray-300 p-4">No results found.</p>
   </section>
)

   const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-chart-5 fill-chart-5'
                : ''
            }`}
          />
        ))}
        <span className="text-sm ml-1">({rating})</span>
      </div>
    );
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <section>
        <Navbar5 />
     <div className="min-h-screen">
      {/* Header Section */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Discover Amazing Products
              </h1>
              <p >
                Find the perfect items from our curated collection
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2 rounded-lg overflow-hidden">
                <Button
                  onClick={() => setViewMode('grid')}
                  size="icon"
                  variant={"secondary"}
                  className="cursor-pointer"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  size="icon"
                  variant={"secondary"}
                  className="cursor-pointer"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p >
            Showing {data?.length} products
          </p>
        </div>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
         {filteredproducts?.map((product)=> {
            console.log("Product:", product)
            return(
            <Link key={product.id} href={`/products/${product.id}`} >
            <Card 
              className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md  overflow-hidden ${
                viewMode === 'list' ? 'flex flex-row h-48' : ''
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Section */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
              }`}>
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={product.image}
                  alt={product.title}
                />
                
                {/* Overlay Actions */}
                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 ${
                  viewMode === 'list' ? 'flex-col' : ''
                }`}>
                  <Button className="cursor-pointer" variant="secondary" size="icon">
                    <Eye  className="w-5 h-5 " />
                  </Button>
                  <Button className="cursor-pointer" variant="secondary" size="icon" >
                    <Heart className="w-5 h-5 " />
                  </Button>
                </div>

            
              </div>

              {/* Content Section */}
              <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 p-6' : ''}`}>
                <CardHeader className={`${viewMode === 'list' ? 'p-0 pb-3' : 'pb-3'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg  line-clamp-2 group-hover:text-chart-1 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm capitalize mt-1">
                        • {product.category}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className={`flex-1 ${viewMode === 'list' ? 'p-0 py-2' : 'pt-0'}`}>
                  <p className="text-sm line-clamp-3 mb-3">
                    {product.description}
                  </p>
                  
                  {product.rating.rate && renderStars(product.rating.rate)}
                </CardContent>

                <CardFooter className={`${viewMode === 'list' ? 'p-0 pt-3 flex items-center justify-between' : 'pt-4 flex-col justify-start items-start gap-2'} `}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      
                    </div>
                   
                  </div>
                  
                  <Button 
                    className="cursor-pointer" 
                    onClick={(e) => {
                      handleAddToCart(e, product)
                      toast("Item Added!")}
                    }
                    disabled={!isAuthenticated}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAuthenticated ? "Add to Cart" : "Login to Add"}
                  </Button>
                </CardFooter>
              </div>
            </Card>
            </Link>
        )})}
           
        </div>
        </div>
        </div>
    </section>
  )
}

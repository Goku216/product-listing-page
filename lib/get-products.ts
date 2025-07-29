export interface Product {
  id:number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: any
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

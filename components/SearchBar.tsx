import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearchStore } from "@/lib/search-store";

export default function SearchBar() {
  const searchQuery= useSearchStore((state)=> state.searchTerm);
  const setSearchQuery= useSearchStore((state)=> state.setSearchTerm)
  return (
    <div className="flex items-center space-x-2">
      <Input  
      type="text" 
      className="px-3 py-2 w-80" 
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <Button className="px-3 py-2">Search</Button>
    </div>
  )
}
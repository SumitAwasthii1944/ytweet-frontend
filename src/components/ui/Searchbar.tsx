import { useState } from "react"
import { useNavigate } from "react-router-dom"
import searchlogo from '../../assets/searchlogo.png'
function SearchBar() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    navigate(`/search?q=${query}`)
    setQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">

        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full lg:w-lg px-4 py-2 pl-10 rounded-full max-w-lg bg-zinc-800 text-white outline-none"
        />

        {/* Search icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <img src={searchlogo} alt="search" className="w-4" />
        </span>

      </div>
    </form>
  )
}

export default SearchBar
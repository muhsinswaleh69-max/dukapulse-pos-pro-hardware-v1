"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Writer = {
  id: string;
  name: string;
  skill: string;
  rate: number;
  rating: number;
  jobs: number;
  bio: string;
  avatar: string;
};

const DEFAULT_WRITERS: Writer[] = [
  { id: "1", name: "Brian Mutua", skill: "Academic Writing", rate: 350, rating: 4.9, jobs: 127, bio: "Masters in Education. 5 years academic writing.", avatar: "BM" },
  { id: "2", name: "Faith Achieng", skill: "SEO Content", rate: 300, rating: 4.8, jobs: 203, bio: "SEO specialist, blog & website content expert.", avatar: "FA" },
  { id: "3", name: "Kevin Omosh", skill: "Research Paper", rate: 400, rating: 4.9, jobs: 89, bio: "Research methodology, data analysis SPSS.", avatar: "KO" },
  { id: "4", name: "Grace Wanjiku", skill: "Dissertation", rate: 450, rating: 5.0, jobs: 64, bio: "PhD assistance, dissertation chapter writing.", avatar: "GW" },
  { id: "5", name: "Dennis Kip", skill: "Technical Writing", rate: 380, rating: 4.7, jobs: 112, bio: "Technical docs, manuals, engineering reports.", avatar: "DK" },
  { id: "6", name: "Linda Atieno", skill: "Blog Writing", rate: 250, rating: 4.8, jobs: 310, bio: "Creative blogs, lifestyle, business articles.", avatar: "LA" },
];

export default function WritersPage() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("writers-market-writers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) setWriters(parsed);
        else setWriters(DEFAULT_WRITERS);
      } catch {
        setWriters(DEFAULT_WRITERS);
      }
    } else {
      setWriters(DEFAULT_WRITERS);
      localStorage.setItem("writers-market-writers", JSON.stringify(DEFAULT_WRITERS));
    }
  }, []);

  const filtered = writers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-700">Writers Market</Link>
          <div className="flex gap-3">
            <Link href="/client" className="px-4 py-2 bg-white border rounded-lg">Post Job</Link>
            <Link href="/writer" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Writer Dashboard</Link>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Find Top Writers in Kenya</h1>
        <p className="text-gray-600 mb-6">{writers.length} verified writers available for hire</p>
        <input
          type="text"
          placeholder="Search by name or skill... e.g Academic, SEO, Research"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map(writer => (
            <div key={writer.id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  {writer.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{writer.name}</h3>
                  <p className="text-sm text-blue-600">{writer.skill}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{writer.bio}</p>
              <div className="flex justify-between text-sm mb-4">
                <span>⭐ {writer.rating} • {writer.jobs} jobs</span>
                <span className="font-bold">KES {writer.rate}/page</span>
              </div>
              <Link href="/client">
                <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                  Hire Writer
                </button>
              </Link>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center mt-10 text-gray-500">No writers found for "{search}"</div>
        )}
      </div>
    </div>
  );
}

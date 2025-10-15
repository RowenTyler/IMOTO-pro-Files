import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-[#FF6700] dark:text-[#FF7D33] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-[#2A352A] rounded-3xl p-8 shadow-md border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
          <h1 className="text-3xl font-bold mb-2 text-[#3E5641] dark:text-white">Our Services</h1>
          <div className="w-20 h-1 bg-[#FF6700] dark:bg-[#FF7D33] mb-6"></div>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 rounded-full bg-[#FFF8E0] dark:bg-[#3E5641]/30 flex items-center justify-center mb-6">
              <span className="text-4xl text-[#FF6700] dark:text-[#FF7D33]">🚧</span>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-[#3E5641] dark:text-white">Coming Soon</h2>
            <p className="text-[#6F7F69] dark:text-gray-300 max-w-lg mb-8">
              We're working hard to bring you amazing services that will enhance your car buying and selling experience.
              Check back soon for exciting new features!
            </p>

            <Button asChild className="bg-[#FF6700] hover:bg-[#FF6700]/90 text-white">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

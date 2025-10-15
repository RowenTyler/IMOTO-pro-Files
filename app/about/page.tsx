import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-[#FF6700] dark:text-[#FF7D33] hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-[#2A352A] rounded-3xl p-8 shadow-md border border-[#9FA791]/20 dark:border-[#4A4D45]/20">
          <h1 className="text-3xl font-bold mb-2 text-[#3E5641] dark:text-white">About imoto</h1>
          <div className="w-20 h-1 bg-[#FF6700] dark:bg-[#FF7D33] mb-6"></div>

          <div className="space-y-6 text-[#3E5641] dark:text-gray-200">
            <p>
              Welcome to imoto, South Africa's premier online marketplace for buying and selling vehicles. Our mission
              is to create a seamless, transparent, and enjoyable experience for everyone involved in the automotive
              market.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-3 text-[#3E5641] dark:text-white">Our Vision</h2>
            <p>
              We envision a world where buying and selling cars is as simple as a few clicks. By leveraging technology
              and innovation, we're building a platform that connects buyers and sellers directly, eliminating
              unnecessary middlemen and reducing costs.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-3 text-[#3E5641] dark:text-white">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Transparency:</span> We believe in honest, clear communication and fair
                dealings.
              </li>
              <li>
                <span className="font-semibold">Innovation:</span> We continuously strive to improve our platform with
                cutting-edge technology.
              </li>
              <li>
                <span className="font-semibold">Community:</span> We're building more than a marketplace; we're creating
                a community of car enthusiasts.
              </li>
              <li>
                <span className="font-semibold">Accessibility:</span> We're making car ownership more accessible to all
                South Africans.
              </li>
              <li>
                <span className="font-semibold">Sustainability:</span> We promote responsible car ownership and
                environmentally conscious practices.
              </li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-3 text-[#3E5641] dark:text-white">Our Story</h2>
            <p>
              Founded with a passion for cars and a desire to revolutionize the automotive market in South Africa, imoto
              has grown from a simple idea to a comprehensive platform serving thousands of users across the country.
            </p>
            <p className="mt-4">
              Our team combines expertise in technology, automotive knowledge, and customer service to deliver an
              unparalleled experience for both buyers and sellers.
            </p>

            <div className="mt-8 pt-6 border-t border-[#9FA791]/20 dark:border-[#4A4D45]/20 flex justify-center">
              <Button asChild className="bg-[#FF6700] hover:bg-[#FF6700]/90 text-white">
                <Link href="/">Explore imoto</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"

export default function RootPage() {
  // Redirect root to home page
  redirect("/home")
}

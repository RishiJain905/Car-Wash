import type { Metadata } from "next";
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: "Premium Car Detailing Services | Northside Detailing & Garage",
  description: "Experience the pinnacle of automotive detailing perfection. Premium interior detailing, exterior polish, and ceramic coating services in Northside.",
}

export default function Home() {
  return <HomeContent />
}

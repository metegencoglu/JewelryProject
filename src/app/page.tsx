"use client";

import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { CampaignSection } from "../components/CampaignSection";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <CampaignSection />
      <Footer />
    </div>
  );
}

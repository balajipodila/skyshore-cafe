import { Hero, ChefSpecial, TodaySpecials, ComboStrip, StoryTeaser, OutletsTeaser, Testimonials, Newsletter } from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <div className="space-y-4">
      <Hero />
      <ChefSpecial />
      <TodaySpecials />
      <ComboStrip />
      <StoryTeaser />
      <OutletsTeaser />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

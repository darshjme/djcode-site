import { Hero } from "@/components/hero/Hero";
import { SocialProof } from "@/components/social-proof/SocialProof";
import Terminal from "@/components/terminal/Terminal";
import { ToolRouter } from "@/components/features/ToolRouter";
import Features from "@/components/features/Features";
import Enhancer from "@/components/enhancer/Enhancer";
import { Agents } from "@/components/agents/Agents";
import Memory from "@/components/memory/Memory";
import Models from "@/components/models/Models";
import Comparison from "@/components/comparison/Comparison";
import Globe from "@/components/globe/Globe";
import Keyboard from "@/components/keyboard/Keyboard";
import Buddy from "@/components/buddy/Buddy";
import { Install } from "@/components/install/Install";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <SocialProof />
      <Terminal />
      <ToolRouter />
      <Features />
      <Enhancer />
      <Memory />
      <Agents />
      <Models />
      <Comparison />
      <Globe />
      <Keyboard />
      <Buddy />
      <Install />
      <Footer />
    </main>
  );
}

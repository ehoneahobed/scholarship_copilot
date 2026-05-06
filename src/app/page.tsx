import Link from "next/link";
import { ArrowRight, Search, Sparkles, ShieldCheck, PenTool } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">
      <div className="animate-fade-in flex flex-col items-center gap-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-text-secondary/80 mb-2 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Next-gen Scholarship Automation</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]">
          Your Personal <span className="text-brand-primary">Scholarship Agent</span>
        </h1>

        
        <p className="text-xl text-text-secondary max-w-2xl mt-4 leading-relaxed">
          Discover, evaluate, and draft high-quality scholarship applications in minutes. 
          Built for ambitious students who want to win more with less effort.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <Link href="/signup" className="btn btn-primary text-lg">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/about" className="btn btn-secondary text-lg">
            How it works
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          <FeatureCard 
            icon={<Search className="w-6 h-6" />}
            title="Intelligent Scout"
            description="Tavily-powered search that finds exclusive opportunities matched to your profile."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Fact-Checked"
            description="Zero-hallucination drafting. Every claim is traced back to your verified profile."
          />
          <FeatureCard 
            icon={<PenTool className="w-6 h-6" />}
            title="Refined Output"
            description="Multi-agent appraisal ensures your essays are polished, professional, and persuasive."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-interactive p-8 rounded-lg text-left flex flex-col gap-4">
      <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

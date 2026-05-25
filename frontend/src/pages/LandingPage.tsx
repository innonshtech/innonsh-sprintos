import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard, Zap, Shield, Users, BarChart3, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Innonsh SprintOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#workflows" className="hover:text-foreground transition">Workflows</a>
            <a href="#analytics" className="hover:text-foreground transition">Analytics</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin">
              <Button className="bg-white text-black hover:bg-neutral-200 shadow-soft">Access Portal</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Introducing SprintOS 2.0
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Innonsh Technologies<br />Engineering Hub
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Internal portal for managing cross-team sprints, tracking developer accountability, and streamlining product delivery across Innonsh.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signin">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-white text-black hover:bg-neutral-200 shadow-glow">
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="container mx-auto mt-20 relative z-10"
        >
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="h-6 flex items-center gap-2 px-4 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center text-muted-foreground">
              {/* Placeholder for actual dashboard image */}
              <LayoutDashboard className="w-24 h-24 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-8">
                <span className="text-sm font-medium tracking-widest uppercase">Dashboard Preview</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Agile</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Built for high-velocity teams that need more than just a simple issue tracker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: LayoutDashboard, title: "Sprint Planning", desc: "Plan sprints with intelligent velocity tracking and capacity forecasting." },
              { icon: Shield, title: "Developer Accountability", desc: "Track individual contributions, pull requests, and code quality metrics." },
              { icon: Users, title: "Daily Standups", desc: "Automated asynchronous standups integrated directly into your workflow." },
              { icon: Zap, title: "Blocker Resolution", desc: "Highlight and escalate blockers automatically to the right stakeholders." },
              { icon: CheckCircle2, title: "Feedback Intelligence", desc: "AI-driven sprint retrospectives to continuously improve team performance." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time dashboards for burndown charts, cycle times, and throughput." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:bg-accent/50 transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[100px] rounded-full -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Access Internal Systems</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Authorized personnel only. Please sign in with your internal credentials.
          </p>
          <Link to="/signin">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-neutral-200">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-neutral-950 py-12 text-sm text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Innonsh SprintOS</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
          <p>© 2026 Innonsh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

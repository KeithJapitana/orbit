import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  Sparkles,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Orbital Rings Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orbital-ring orbital-ring-1" />
        <div className="orbital-ring orbital-ring-2" />
        <div className="orbital-ring orbital-ring-3" />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-noise" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm bg-black/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg rotate-45" />
                <div className="absolute inset-0.5 bg-black rounded-lg rotate-45" />
                <div className="absolute inset-1.5 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-sm rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight">Orbit</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-white/80">
                Now with AI-powered task generation
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] animate-fade-in-up">
              Ship faster
              <br />
              <span className="inline-block bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                with Orbit
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-100">
              The project management tool that moves at the speed of thought.
              Streamline workflows, empower teams, and launch products faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-200">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group relative h-12 px-8 bg-white text-black hover:bg-white/90 text-base font-semibold overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-base font-semibold"
              >
                View Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-white/40 animate-fade-in-up animation-delay-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-white/20 text-white/80">
              Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need
              <br />
              <span className="text-white/40">to move faster</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: LayoutDashboard,
                title: "Kanban Boards",
                description:
                  "Intuitive drag-and-drop interface with real-time updates",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: Zap,
                title: "Real-time Collaboration",
                description:
                  "See changes instantly as your team works together",
                gradient: "from-cyan-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Team Management",
                description:
                  "Role-based permissions and seamless team invitations",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description:
                  "Smart task suggestions and automated descriptions",
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group relative bg-white/[0.02] border-white/10 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-500 hover:border-white/20 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className="space-y-4">
                  <div className="relative w-12 h-12">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity`}
                    />
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-white/20 text-white/80">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for trying out Orbit",
                features: [
                  "1 workspace",
                  "2 boards",
                  "Up to 5 team members",
                  "Basic support",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Lite",
                price: "$9",
                description: "For small teams getting serious",
                features: [
                  "5 workspaces",
                  "10 boards",
                  "Up to 15 team members",
                  "Priority support",
                  "AI features",
                ],
                cta: "Start Free Trial",
                highlighted: true,
              },
              {
                name: "Pro",
                price: "$19",
                description: "For teams that need it all",
                features: [
                  "Unlimited workspaces",
                  "Unlimited boards",
                  "Unlimited team members",
                  "24/7 premium support",
                  "Advanced AI features",
                  "Custom integrations",
                ],
                cta: "Start Free Trial",
                highlighted: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative group ${
                  plan.highlighted
                    ? "bg-white/[0.06] border-white/30 ring-1 ring-violet-500/50 md:scale-105"
                    : "bg-white/[0.02] border-white/10"
                } backdrop-blur-sm hover:border-white/20 transition-all duration-500`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white border-0 px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="space-y-4 pb-8">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-white/40">/month</span>
                  </div>
                  <p className="text-white/60">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Link href="/signup">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <Separator className="bg-white/10" />

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-cyan-500/10 to-violet-500/10 border-white/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />
            <CardContent className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ready to ship faster?
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Join thousands of teams using Orbit to streamline their workflow
                and deliver products faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-white text-black hover:bg-white/90 text-base font-semibold"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-white/5 mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded rotate-45" />
                <div className="absolute inset-0.5 bg-black rounded rotate-45" />
                <div className="absolute inset-1 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-sm rotate-45" />
              </div>
              <span className="text-sm text-white/40">
                © 2026 Orbit. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="#" className="hover:text-white transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

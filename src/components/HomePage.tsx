import React from 'react';
import {
  FileText, Download, Sparkles, ArrowRight, CheckCircle,
  Wand2, Target, Zap, Shield, Award,
  PenTool, Layout, BookOpen, Moon, Sun, MessageCircle
} from 'lucide-react';
import { Template } from '../types/cv';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDarkMode } from './DarkModeProvider';
import { analyticsEvents } from '../utils/analytics';

interface HomePageProps {
  onTemplateSelect: (templateId: string) => void;
  onStartAI?: () => void;
  onOpenFeedback?: () => void;
}

const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Clean and traditional design perfect for corporate roles',
    features: ['ATS-friendly', 'Clean typography', 'Professional layout', 'Skills section'],
    previewColor: 'from-teal-300 to-teal-500'
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Contemporary design with subtle colors and modern styling',
    features: ['Eye-catching header', 'Color accents', 'Modern layout', 'Visual hierarchy'],
    previewColor: 'from-teal-200 to-cyan-400'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Bold design for creative industries and standout applications',
    features: ['Creative layout', 'Bold typography', 'Visual elements', 'Unique design'],
    previewColor: 'from-emerald-300 to-teal-400'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist approach focusing on content and readability',
    features: ['Clean lines', 'Minimal design', 'Focus on content', 'Easy to read'],
    previewColor: 'from-slate-300 to-teal-300'
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Premium design for senior management and executive positions',
    features: ['Premium look', 'Executive styling', 'Professional header', 'Sophisticated layout'],
    previewColor: 'from-teal-400 to-emerald-500'
  },
  {
    id: 'tech',
    name: 'Tech Professional',
    description: 'Modern tech-focused design for IT and development roles',
    features: ['Tech-focused', 'Modern elements', 'Skills emphasis', 'Developer-friendly'],
    previewColor: 'from-cyan-300 to-teal-400'
  }
];

/* Scroll-reveal wrapper */
function RevealSection({
  children,
  className = '',
  type = 'reveal',
}: {
  children: React.ReactNode;
  className?: string;
  type?: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale' | 'stagger-children';
}) {
  const { ref, isVisible } = useScrollReveal(0.12);
  return (
    <div ref={ref} className={`${type} ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

const HomePage: React.FC<HomePageProps> = ({ onTemplateSelect, onStartAI, onOpenFeedback }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  React.useEffect(() => {
    analyticsEvents.homePageView();
  }, []);

  const handleTemplateClick = (templateId: string) => {
    analyticsEvents.templateSelected(templateId);
    onTemplateSelect(templateId);
  };

  const handleAIClick = () => {
    onStartAI?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/30 to-white font-inter overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-teal-100/40 blob animate-float" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-emerald-100/20 blob animate-float" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-cyan-100/20 blob animate-float" style={{ animationDuration: '8s', animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">CV Builder Pro</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">v1.0</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-3 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-slate-800"
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenFeedback}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-3 py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-slate-800"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
              <button
                onClick={handleAIClick}
                className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle label */}
          <p className="hero-animate mb-8">
            <span className="text-lg font-serif-display italic text-teal-600/80 border-b border-teal-300/40 pb-0.5">AI-Powered</span>
          </p>

          {/* Heading */}
          <h1 className="hero-animate hero-animate-delay-1 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            <span className="font-serif-display">Craft Your Perfect</span>
            <br />
            <span className="font-serif-display text-teal-600">Professional CV</span>
          </h1>

          <p className="hero-animate hero-animate-delay-2 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe yourself or paste your existing CV with a job description.
            Our AI creates a tailored, ATS-optimized CV that lands you interviews.
          </p>

          {/* CTAs */}
          <div className="hero-animate hero-animate-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleAIClick}
              className="group flex items-center gap-2 bg-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-600 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Start with AI
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#templates"
              className="flex items-center gap-2 text-slate-600 px-8 py-4 rounded-2xl font-medium text-lg border border-slate-200 hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              Browse Templates
            </a>
          </div>

          {/* Stats */}
          <div className="hero-animate hero-animate-delay-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: 'AI', label: 'Smart Generation' },
              { value: '6+', label: 'Pro Templates' },
              { value: '100%', label: 'Free to Use' },
              { value: 'ATS', label: 'Optimized' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/70 backdrop-blur border border-teal-100/60 rounded-2xl px-4 py-3">
                <div className="text-xl font-bold text-teal-600 mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 text-lg">Three simple steps, no account needed</p>
          </RevealSection>

          <RevealSection type="stagger-children" className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting dashed line */}
            <div className="hidden md:block absolute top-14 left-[18%] right-[18%] border-t-2 border-dashed border-teal-200"></div>

            {[
              {
                icon: PenTool,
                title: 'Describe or Paste',
                desc: 'Tell AI about yourself, or paste your existing CV along with the job description.',
                num: '1'
              },
              {
                icon: Sparkles,
                title: 'AI Crafts Your CV',
                desc: 'Our AI writes a professional, ATS-optimized CV tailored to your background and target role.',
                num: '2'
              },
              {
                icon: Download,
                title: 'Download PDF',
                desc: 'Review, tweak if you like, then download your polished CV for free.',
                num: '3'
              },
            ].map((step) => (
              <div key={step.num} className="relative text-center group">
                <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 mb-5 group-hover:bg-teal-100 transition-colors">
                  <step.icon className="w-6 h-6 text-teal-600" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50/40 to-white">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              What AI Can Do For You
            </h2>
            <p className="text-slate-500 text-lg">Let artificial intelligence handle the hard parts</p>
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-8">
            <RevealSection type="reveal-left">
              <div className="h-full bg-white rounded-3xl p-8 border border-teal-100 hover:border-teal-200 transition-colors group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 group-hover:bg-teal-100 transition-colors">
                    <Wand2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">Generate from Scratch</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Describe your background and AI will craft a complete, professionally written CV in seconds.
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5 ml-1">
                  {['Professional summary writing', 'Action verb optimization', 'Skills extraction and formatting', 'ATS-friendly structure'].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            <RevealSection type="reveal-right">
              <div className="h-full bg-white rounded-3xl p-8 border border-teal-100 hover:border-teal-200 transition-colors group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">Optimize for Any Job</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Paste your CV and the job description. AI rewrites it to perfectly match the role.
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5 ml-1">
                  {['Keyword matching from job ads', 'Tailored summary rewriting', 'Experience bullet reframing', 'Skills priority reordering'].map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>

          <RevealSection type="reveal-scale" className="text-center mt-14">
            <button
              onClick={handleAIClick}
              className="group inline-flex items-center gap-2 bg-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-600 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Try it Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </RevealSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              Why CV Builder Pro?
            </h2>
            <p className="text-slate-500 text-lg">Built with care, designed for results</p>
          </RevealSection>

          <RevealSection type="stagger-children" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Secure and Private', desc: 'Your data stays private. We never store or share your personal information.', iconBg: 'bg-teal-50 border-teal-100', iconText: 'text-teal-500' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Get your complete CV generated in under 15 seconds. No waiting around.', iconBg: 'bg-amber-50 border-amber-100', iconText: 'text-amber-500' },
              { icon: Layout, title: 'ATS-Optimized', desc: 'Every template passes applicant tracking systems used by top employers.', iconBg: 'bg-blue-50 border-blue-100', iconText: 'text-blue-500' },
              { icon: BookOpen, title: 'Expert Writing', desc: 'AI uses proven CV writing techniques with strong action verbs and quantified results.', iconBg: 'bg-emerald-50 border-emerald-100', iconText: 'text-emerald-500' },
              { icon: PenTool, title: 'Fully Editable', desc: 'AI gives you a head start, then tweak every detail to your liking.', iconBg: 'bg-violet-50 border-violet-100', iconText: 'text-violet-500' },
              { icon: Download, title: 'Free PDF Export', desc: 'Download professional PDFs with no watermarks. Completely free, forever.', iconBg: 'bg-rose-50 border-rose-100', iconText: 'text-rose-500' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-teal-200 transition-colors group"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${item.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.iconText}`} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-teal-50/20 to-white">
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-16">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              Professional Templates
            </h2>
            <p className="text-slate-500 text-lg">Choose a template, then fill manually or let AI do the work</p>
          </RevealSection>

          <RevealSection type="stagger-children" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-teal-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-44 bg-gradient-to-br ${template.previewColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
                  <div className="absolute top-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 h-32">
                      <div className="space-y-2">
                        <div className="h-2.5 bg-slate-300/70 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-200/70 rounded-full w-1/2"></div>
                        <div className="h-2 bg-slate-200/70 rounded-full w-2/3"></div>
                        <div className="space-y-1.5 mt-3">
                          <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                          <div className="h-1.5 bg-slate-100 rounded-full w-5/6"></div>
                          <div className="h-1.5 bg-slate-100 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1.5 group-hover:text-teal-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{template.description}</p>
                  <div className="mb-5 space-y-1.5">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-500">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleTemplateClick(template.id)}
                    className="w-full bg-teal-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-slate-700">CV Builder Pro</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure and Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
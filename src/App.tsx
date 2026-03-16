/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download, 
  Code2, 
  Cpu, 
  Globe, 
  Layers,
  Terminal,
  Trophy,
  ChevronRight,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const Section = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <motion.section 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`py-24 px-6 md:px-12 max-w-7xl mx-auto ${className}`}
  >
    {children}
  </motion.section>
);

const Spotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        opacity,
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.06), transparent 80%)`
      }}
    />
  );
};

const Marquee = ({ items }: { items: string[] }) => (
  <div className="relative flex overflow-x-hidden border-y border-white/5 bg-white/[0.01] py-4">
    <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="text-sm font-mono text-white/20 uppercase tracking-[0.3em] flex items-center gap-4">
          {item} <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </span>
      ))}
    </div>
  </div>
);

const BentoCard = ({ children, className = "", title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any, key?: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass glow-hover rounded-3xl p-8 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    {title && (
      <div className="flex items-center gap-3 mb-6">
        {Icon && <Icon className="w-5 h-5 text-white/60" />}
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/40">{title}</h3>
      </div>
    )}
    {children}
  </motion.div>
);

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi, I'm Salil's Research Assistant. Ask me anything about his work in AI, GSoC, or Spatio-Temporal analysis!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{ role: 'user', parts: [{ text: `You are an assistant for Salil Jha's portfolio. Salil is a CS student at IIIT Kottayam, a GSoC '25 contributor with OWASP, and an AI researcher. He founded Grow Local Digital. His research is on Bayesian Graph Neural Networks for Spatio-Temporal Analysis. Answer this question about him professionally: ${userMsg}` }] }],
        config: {
          systemInstruction: "You are a professional, concise assistant for Salil Jha's portfolio. Keep answers short and high-impact.",
          tools: [{ googleSearch: {} }]
        }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: result.text || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Salil is likely optimizing the backend!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black bg-black">
      <Spotlight />
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 flex gap-8 items-center glass rounded-full border-white/10 shadow-2xl">
        <div className="text-sm font-bold tracking-tighter border-r border-white/10 pr-8">saliljha.dev</div>
        <div className="hidden md:flex gap-8 items-center text-[10px] font-mono uppercase tracking-widest text-white/40">
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#research" className="hover:text-white transition-colors">Research</a>
          <a href="#skills" className="hover:text-white transition-colors">Arsenal</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex gap-4 items-center border-l border-white/10 pl-8">
          <a href="https://github.com/SalilDEV9" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="mailto:saliljha523@gmail.com" className="text-xs font-medium text-white/80 hover:text-white transition-colors">
            Hire Me
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <Section className="pt-64 pb-32 text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-12">
            <div className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-mono text-emerald-400 flex items-center gap-2 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open for Full-Time Work & Research Roles
            </div>
          </div>
          
          <h1 className="text-7xl md:text-[120px] font-bold tracking-tighter mb-12 leading-[0.85] text-gradient">
            ENGINEERING<br />THE FUTURE.
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            CS Student at <span className="text-white/80 font-medium">IIIT Kottayam</span>. 
            GSoC '25 Contributor at <span className="text-white/80 font-medium">OWASP</span>. 
            Pioneering <span className="text-white/80 font-medium">Spatio-Temporal AI</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group px-10 py-5 rounded-full bg-white text-black font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Explore Projects <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-full border border-white/10 bg-white/5 font-bold flex items-center gap-3 hover:bg-white/10 transition-colors">
              Download CV <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </Section>

      <Marquee items={['Python', 'GoLang', 'PyTorch', 'TensorFlow', 'React', 'FastAPI', 'Docker', 'AWS', 'Graph Neural Networks', 'Bayesian Inference']} />

      {/* Impact Metrics */}
      <Section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "JEE Main", value: "98.1%ile", sub: "Top 1% of 1M+", color: "hover:bg-blue-500/10 hover:border-blue-500/30", glow: "hover:shadow-blue-500/10" },
            { label: "GSoC '25", value: "OWASP", sub: "AppSec & GoLang", color: "hover:bg-emerald-500/10 hover:border-emerald-500/30", glow: "hover:shadow-emerald-500/10" },
            { label: "DSA", value: "200+", sub: "Solved Problems", color: "hover:bg-orange-500/10 hover:border-orange-500/30", glow: "hover:shadow-orange-500/10" },
            { label: "Founder", value: "Grow Local", sub: "12+ Businesses", color: "hover:bg-rose-500/10 hover:border-rose-500/30", glow: "hover:shadow-rose-500/10" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`glass rounded-3xl p-6 text-center transition-all duration-500 group cursor-default relative overflow-hidden ${stat.color} ${stat.glow}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="text-sm font-mono text-white/40 mb-2 uppercase tracking-tighter group-hover:text-white/60 transition-colors">{stat.label}</div>
              <div className="text-2xl font-bold mb-1 group-hover:scale-110 transition-transform duration-500">{stat.value}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Strategic Experience */}
      <Section id="work">
        <div className="grid md:grid-cols-2 gap-8">
          <BentoCard title="Open Source" icon={Terminal} className="h-full border-white/10 hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-3xl font-bold tracking-tight">Google Summer of Code '25</h4>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">OWASP</div>
            </div>
            <p className="text-white/50 mb-8 leading-relaxed text-lg font-light">
              Architecting secure digital infrastructure and vulnerability detection tools. Leveraging GoLang for high-performance security modules.
            </p>
            <div className="flex flex-wrap gap-3">
              {['GoLang', 'AppSec', 'Vuln Detection', 'GitHub'].map(tag => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 group-hover:text-white/80 transition-colors">{tag}</span>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Startup" icon={Globe} className="h-full border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-3xl font-bold tracking-tight">Grow Local Digital</h4>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">Founder</div>
            </div>
            <p className="text-white/50 mb-8 leading-relaxed text-lg font-light">
              Empowering local commerce through digital transformation. Scaling automation tools and bespoke web platforms for 12+ enterprises.
            </p>
            <div className="flex items-center gap-8 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700">
              <div className="font-bold text-sm tracking-widest uppercase">TRUSTED BY</div>
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10" />
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10" />
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10" />
              </div>
            </div>
          </BentoCard>
        </div>
      </Section>

      {/* Research Section */}
      <Section id="research" className="relative">
        <div className="absolute top-0 right-0 -mt-20 opacity-10">
          <Cpu className="w-64 h-64" />
        </div>
        <BentoCard title="Research.paper()" icon={Sparkles} className="border-white/20 bg-white/[0.02]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-3xl font-bold mb-6">Bayesian Graph Neural Networks for Spatio-Temporal Analysis</h4>
              <p className="text-white/60 mb-8 leading-relaxed">
                Exploring probabilistic deep learning approaches for improved uncertainty estimation in graph-based models. 
                Focusing on modeling complex spatio-temporal datasets with high precision.
              </p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm font-medium hover:text-white/80 transition-colors">
                  Read Abstract <ExternalLink className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-white/80 transition-colors">
                  GitHub Repo <Github className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 font-mono text-sm bg-black/40 border-white/5">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="text-white/80">
                <span className="text-blue-400"># Loss Function</span><br />
                L = KL(q(w)||p(w)) - E[log p(y|x,w)]<br /><br />
                <span className="text-blue-400"># Uncertainty Estimation</span><br />
                Var[y] = E[Var(y|w)] + Var[E(y|w)]
              </div>
            </div>
          </div>
        </BentoCard>
      </Section>

      {/* Projects Bento Grid */}
      <Section>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Engineering.log</h2>
            <p className="text-white/40">Selected projects from my technical journey.</p>
          </div>
          <div className="hidden md:block text-xs font-mono text-white/20">SCROLL TO EXPLORE</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Project - Urban Heat */}
          <BentoCard className="md:col-span-2 h-[550px] flex flex-col justify-between" title="AI & Sustainability">
            <div>
              <h4 className="text-3xl font-bold mb-4">Urban Heat Vulnerability Prediction</h4>
              <p className="text-white/60 max-w-xl">
                Predicting urban heat vulnerability using Random Forest and Gradient Boosting. 
                Integrated satellite imagery (NDVI, LST) with weather datasets for spatial analysis.
              </p>
            </div>
            <div className="mt-8 glass rounded-2xl overflow-hidden border-white/10 bg-black/60 flex-1 flex flex-col shadow-2xl">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="text-[10px] font-mono text-white/30 ml-4 px-3 py-1 bg-white/5 rounded-md border border-white/5">
                    streamlit-dashboard.app/spatial-analysis
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-1 bg-white/10 rounded-full" />
                  <div className="w-4 h-1 bg-white/10 rounded-full" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'NDVI Index', val: '0.82', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Vegetation Density' },
                    { label: 'Surface Temp', val: '34.2°C', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', desc: 'LST Measurement' },
                    { label: 'Risk Level', val: 'CRITICAL', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', desc: 'Vulnerability Score' }
                  ].map((m, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                      className={`rounded-2xl p-4 border ${m.border} ${m.bg} transition-all duration-300 cursor-default group/metric relative overflow-hidden`}
                    >
                      <div className="relative z-10">
                        <div className="text-[9px] text-white/40 mb-1 uppercase tracking-[0.2em] font-bold">{m.label}</div>
                        <div className={`text-2xl font-bold tracking-tight ${m.color}`}>{m.val}</div>
                        <div className="text-[8px] text-white/30 mt-1 uppercase tracking-widest">{m.desc}</div>
                      </div>
                      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover/metric:w-full transition-all duration-700 bg-current opacity-40" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-5 relative overflow-hidden group/map">
                   {/* Simulated Map Visualization */}
                   <div className="absolute inset-0 opacity-30 group-hover/map:opacity-50 transition-opacity duration-1000">
                      <div className="absolute top-4 left-10 w-32 h-32 bg-emerald-500/40 rounded-full blur-[60px] animate-pulse" />
                      <div className="absolute bottom-10 right-20 w-48 h-48 bg-orange-500/40 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                   </div>
                   
                   <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <div className="text-[10px] font-mono text-white/60 tracking-widest">LIVE SPATIAL ANALYSIS</div>
                        </div>
                        <div className="flex gap-2">
                          <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[8px] font-mono text-white/40">LAYER: LST_2024</div>
                          <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[8px] font-mono text-white/40">ZOOM: 14.5x</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-8 gap-1.5 opacity-40">
                         {Array.from({length: 48}).map((_, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0.1 }}
                             whileInView={{ opacity: Math.random() * 0.6 + 0.2 }}
                             className={`rounded-sm ${
                               i % 7 === 0 ? 'bg-rose-500' : 
                               i % 5 === 0 ? 'bg-orange-500' : 
                               'bg-emerald-500'
                             }`}
                             style={{ opacity: Math.random() }}
                           />
                         ))}
                      </div>
                      
                      <div className="mt-4 flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="h-1 w-32 bg-white/10 rounded-full" />
                          <div className="h-1 w-24 bg-white/10 rounded-full" />
                        </div>
                        <div className="text-[8px] font-mono text-white/20">COORD: 25.5941° N, 85.1376° E</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Small Project 1 */}
          <BentoCard title="Reinforcement Learning" className="h-[450px]">
            <h4 className="text-2xl font-bold mb-4">Smart Agents</h4>
            <p className="text-white/60 text-sm mb-8">
              Multi-Agent Reinforcement Learning system for dynamic resource allocation. 
              Designed adaptive reward mechanisms for fairness.
            </p>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-white/20 rounded-full" />
                <div className="absolute inset-[45%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </BentoCard>

          {/* Small Project 2 */}
          <BentoCard title="Blockchain" className="h-[400px]">
            <h4 className="text-2xl font-bold mb-4">Roots-Agate</h4>
            <p className="text-white/60 text-sm mb-6">
              Supply chain traceability for Ayurvedic herbs using blockchain. 
              Implemented geo-tagging and batch-level tracking.
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                  <div className="h-2 w-24 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Small Project 3 */}
          <BentoCard title="NLP" className="h-[400px] md:col-span-2">
            <div className="grid md:grid-cols-2 gap-8 h-full">
              <div>
                <h4 className="text-2xl font-bold mb-4">Advanced NLP Chatbot</h4>
                <p className="text-white/60 text-sm">
                  Context-aware chatbot using modular architecture. 
                  Enabling multi-turn conversations and extensible intent modules.
                </p>
              </div>
              <div className="glass rounded-xl p-4 bg-black/20 font-mono text-[10px] space-y-4">
                <div className="text-white/40">User: How's the weather?</div>
                <div className="text-blue-400">Agent: Analyzing spatio-temporal data...</div>
                <div className="text-white/40">User: Predict vulnerability.</div>
                <div className="text-green-400">Agent: High risk detected in Sector 7.</div>
              </div>
            </div>
          </BentoCard>
        </div>
      </Section>

      {/* Technical Arsenal */}
      <Section id="skills">
        <h2 className="text-4xl font-bold tracking-tight mb-12">Technical Arsenal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              category: "Languages & Core", 
              icon: Code2, 
              color: "text-blue-400",
              glow: "group-hover:shadow-blue-500/10",
              border: "group-hover:border-blue-500/30",
              skills: ["Python", "C/C++", "Java", "JavaScript", "TypeScript", "SQL", "DSA", "System Design", "OOP", "OS", "DBMS"] 
            },
            { 
              category: "AI / ML & LLMs", 
              icon: Cpu, 
              color: "text-purple-400",
              glow: "group-hover:shadow-purple-500/10",
              border: "group-hover:border-purple-500/30",
              skills: ["PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "LangChain", "OpenAI API", "LLM Fine-Tuning", "RAG", "Vector DBs (Pinecone, FAISS, Chroma)", "NLP", "Reinforcement Learning", "GenAI", "Prompt Engineering"] 
            },
            { 
              category: "Web & Backend", 
              icon: Globe, 
              color: "text-emerald-400",
              glow: "group-hover:shadow-emerald-500/10",
              border: "group-hover:border-emerald-500/30",
              skills: ["React.js", "Node.js", "FastAPI", "RESTful APIs", "HTML5/CSS3", "Microservices", "API Integration", "Streamlit"] 
            },
            { 
              category: "Cloud & DevOps", 
              icon: Layers, 
              color: "text-orange-400",
              glow: "group-hover:shadow-orange-500/10",
              border: "group-hover:border-orange-500/30",
              skills: ["AWS (EC2, S3, IAM)", "Docker", "Kubernetes", "MLOps", "CI/CD", "Linux", "Git", "MongoDB", "PostgreSQL", "MySQL", "VS Code", "Jupyter", "Agile/Scrum"] 
            }
          ].map((group, i) => (
            <BentoCard key={i} className={`h-full transition-all duration-500 ${group.glow} ${group.border}`}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <group.icon className={`w-6 h-6 ${group.color}`} />
                  <h3 className="font-bold text-lg tracking-tight">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <span key={skill} className={`px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 group-hover:text-white/80 transition-colors cursor-default`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </Section>

      {/* Achievements */}
      <Section>
        <BentoCard title="Footprints" icon={Trophy}>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { title: "NTSE Stage 1 Scholar", desc: "National Talent Search Examination" },
                { title: "SIH College Winner", desc: "Smart India Hackathon 2024" },
                { title: "200+ DSA Solved", desc: "LeetCode & Codeforces" }
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="text-xl font-bold group-hover:text-white/80 transition-colors">{item.title}</h4>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {[
                { title: "Mind Quest Club", desc: "Sub-Lead & Event Organizer" },
                { title: "GDG Organizer", desc: "Google Developer Group IIITK" },
                { title: "Cyber Crime Volunteer", desc: "Ministry of Home Affairs" }
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <h4 className="text-xl font-bold group-hover:text-white/80 transition-colors">{item.title}</h4>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="text-center">
        <div className="glass rounded-[40px] p-16 border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">LET'S BUILD<br />SOMETHING ICONIC.</h2>
            <p className="text-white/40 max-w-xl mx-auto mb-12 text-lg font-light">
              Currently seeking high-impact engineering and research roles. 
              My inbox is always open for bold ideas and full-time opportunities.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a href="mailto:saliljha523@gmail.com" className="px-12 py-6 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                Get In Touch
              </a>
              <div className="flex gap-4">
                <a href="https://linkedin.com/in/salil-3b9a7b281" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://github.com/SalilDEV9" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter mb-4">saliljha.dev</div>
          <p className="text-white/40 text-sm mb-8">Built with precision. Inspired by high-performance engineering.</p>
          <div className="flex justify-center gap-6 mb-12">
            <a href="https://github.com/SalilDEV9" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/salil-3b9a7b281" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="mailto:saliljha523@gmail.com" className="text-white/40 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            © 2026 Salil Jha. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* AI Research Assistant Floating Chat */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 right-0 w-80 md:w-96 glass rounded-3xl overflow-hidden shadow-2xl border-white/10"
            >
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-bold">Research Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-white text-black rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-black/40 border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Salil..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-colors"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:shadow-white/10 transition-shadow"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
}

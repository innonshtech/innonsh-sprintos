import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Maximize2,
  Calendar,
  Check,
  Server,
  Cpu,
  Smartphone,
  Globe,
  Database,
  Terminal,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Filter,
  Eye,
  FileCode,
  X,
  Code,
  Zap,
  Lock,
  Radio,
  Workflow,
  CheckSquare,
  HelpCircle,
  FolderTree,
  FileSpreadsheet
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DocTab {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  filePath: string;
}

const DOCUMENTS: DocTab[] = [
  {
    id: 'architecture',
    title: 'System Architecture & Tech Specs',
    subtitle: '6 Repos • Monolith Node.js • FastAPI AI • Canvas 60FPS • WebSockets • API Boundaries',
    icon: Layers,
    badge: 'Tech Spec',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    filePath: '/Architecture.html',
  },
  {
    id: 'sprint-plan',
    title: 'Sprint Plan & 98 User Stories',
    subtitle: '6 Sprints × 2 Weeks • 98 Full User Stories • Demo Checkpoints • Feature Specifications',
    icon: BookOpen,
    badge: '98 Stories',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    filePath: '/SprintPlan.html',
  },
  {
    id: 'phase1-coverage',
    title: 'Phase 1 Coverage Matrix',
    subtitle: 'Module & Feature Completion Matrix • Verification Gates & Readiness Checklist',
    icon: CheckCircle2,
    badge: 'Coverage Matrix',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    filePath: '/Phase1_Coverage.html',
  },
  {
    id: 'scope',
    title: 'Project Scope & Contract Terms',
    subtitle: 'Formal Scope Confirmation • SLA Terms • Hardware Boundaries • Deliverables',
    icon: FileText,
    badge: 'Contract Scope',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    filePath: '/SCOPE.html',
  },
];

export default function GyoashHubPage() {
  const [activeTabId, setActiveTabId] = useState<string>('architecture');
  const [viewMode, setViewMode] = useState<'breakdown' | 'raw'>('breakdown');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selected item modal state
  const [selectedRepoModal, setSelectedRepoModal] = useState<any | null>(null);
  const [selectedStoryModal, setSelectedStoryModal] = useState<any | null>(null);

  const activeDoc = DOCUMENTS.find(d => d.id === activeTabId) || DOCUMENTS[0];

  return (
    <div className={`flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-background overflow-y-auto' : 'min-h-[calc(100vh-5rem)]'}`}>
      {/* Top Header */}
      <div className="bg-card border-b border-border p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">GYOASH Technical Documentation Hub</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20">
                Developer Engine
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete technical specification, 6-repo codebase map, API contracts, database schemas & 98 user story breakdown for Project GYOASH 2609.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle Button */}
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode('breakdown')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'breakdown'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Developer Breakdown</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'raw'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Original HTML View</span>
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-9 px-3 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors border border-border flex items-center gap-1.5"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
          
          <a
            href={activeDoc.filePath}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Open Raw File</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-muted/30 border-b border-border px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0">
        {DOCUMENTS.map((doc) => {
          const Icon = doc.icon;
          const isActive = doc.id === activeTabId;
          return (
            <button
              key={doc.id}
              onClick={() => setActiveTabId(doc.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border flex-shrink-0 ${
                isActive
                  ? 'bg-card text-foreground border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/20'
                  : 'bg-transparent text-muted-foreground border-transparent hover:bg-card/60 hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`} />
              <span>{doc.title}</span>
              <span className={`px-2 py-0.2 text-[10px] font-bold rounded-md border ${doc.badgeColor}`}>
                {doc.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {viewMode === 'raw' ? (
          /* Raw Embedded Document View */
          <div className="w-full h-[750px] bg-slate-900 rounded-2xl border border-border overflow-hidden relative shadow-md">
            <iframe
              key={activeDoc.filePath}
              src={activeDoc.filePath}
              title={activeDoc.title}
              className="w-full h-full border-none bg-white"
            />
          </div>
        ) : (
          /* Native Interactive Detailed Breakdown View */
          <div className="space-y-6 animate-in fade-in duration-200">
            {activeTabId === 'architecture' && <DetailedArchitectureBreakdown onOpenRepoModal={setSelectedRepoModal} />}
            {activeTabId === 'sprint-plan' && <DetailedSprintPlanBreakdown onOpenStoryModal={setSelectedStoryModal} />}
            {activeTabId === 'phase1-coverage' && <DetailedPhase1CoverageBreakdown />}
            {activeTabId === 'scope' && <DetailedScopeContractBreakdown />}
          </div>
        )}
      </div>

      {/* Repository Detail Modal */}
      {selectedRepoModal && (
        <Dialog open={!!selectedRepoModal} onOpenChange={() => setSelectedRepoModal(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Server className="w-5 h-5 text-indigo-500" />
                <span>{selectedRepoModal.name} Specifications</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 text-xs text-foreground">
              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Role & Responsibility</span>
                <p className="p-3 bg-muted/30 border border-border rounded-xl leading-relaxed text-foreground font-medium">{selectedRepoModal.description}</p>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Tech Stack & Dependencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRepoModal.stack.map((st: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-xs">
                      {st}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Core Modules & Components Included</span>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {selectedRepoModal.features.map((ft: string, idx: number) => (
                    <li key={idx} className="p-2.5 bg-card border border-border rounded-lg flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ft}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRepoModal.boundary && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
                  <span className="font-bold uppercase text-[10px] block mb-1">Strict System Boundary / Constraint:</span>
                  <p>{selectedRepoModal.boundary}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedRepoModal(null)} className="bg-indigo-600 text-white">Close Detail View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* User Story Detail Modal */}
      {selectedStoryModal && (
        <Dialog open={!!selectedStoryModal} onOpenChange={() => setSelectedStoryModal(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                <span>Story Detail: {selectedStoryModal.featureId}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs text-foreground">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono text-indigo-600 dark:text-indigo-400">{selectedStoryModal.featureId}</Badge>
                <Badge variant="outline" className="font-mono text-cyan-600 dark:text-cyan-400">{selectedStoryModal.scenarioId}</Badge>
                <Badge variant="outline" className="font-mono text-emerald-600 dark:text-emerald-400">{selectedStoryModal.uiScreenId}</Badge>
                <Badge className="bg-indigo-600 text-white">{selectedStoryModal.phase}</Badge>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Feature / Scenario Name</span>
                <h4 className="text-sm font-bold text-foreground leading-snug">{selectedStoryModal.scenarioName}</h4>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Module / User Role</span>
                <p className="text-muted-foreground font-medium">{selectedStoryModal.moduleSection} • Target User: <span className="font-bold text-foreground">{selectedStoryModal.userType}</span></p>
              </div>

              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">Expected Output & Acceptance Criteria</span>
                <div className="p-3.5 bg-muted/30 border border-border rounded-xl whitespace-pre-wrap leading-relaxed text-foreground font-normal">
                  {selectedStoryModal.userStoryExpectedOutput}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedStoryModal(null)} className="bg-indigo-600 text-white">Close Detail View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/* =========================================================================
   1. DETAILED SYSTEM ARCHITECTURE BREAKDOWN
   ========================================================================= */
function DetailedArchitectureBreakdown({ onOpenRepoModal }: { onOpenRepoModal: (repo: any) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'repos' | 'techstack' | 'api' | 'ai'>('repos');

  const repoDetails = [
    {
      id: 'panel',
      name: 'gyoash-panel — IFP Panel App',
      type: 'Classroom Surface App',
      description: 'Runs natively on Android/Windows Interactive Flat Panels (75"/86") in classrooms. Provides 60FPS Canvas Whiteboard, AI Teacher side panel, and classroom broadcasting.',
      stack: ['React 18', 'TypeScript', 'Fabric.js / Konva.js Canvas', 'Android WebView', 'Electron (Windows)', 'WebSocket Client'],
      features: [
        'Canvas 60FPS infinite whiteboard with vector pen & eraser',
        'AI Side Panel — all 11 AI assistant tools (calls FastAPI microservice)',
        'Interactive polling & raise hand response listener',
        'Digital Content Browser & PDF/EPUB Textbook viewer',
        'Wireless screen casting receiver & live recording controls',
        'Cloud storage integration (Google Drive, OneDrive, Dropbox)'
      ],
      boundary: '🚫 Does NOT execute database queries or user auth directly. Communicates via Node.js REST API & WebSocket server.'
    },
    {
      id: 'teacher',
      name: 'gyoash-teacher-app — Teacher Mobile App',
      type: 'Mobile Surface App',
      description: 'Allows teachers to prepare lessons, grade homework, control classroom panel remotely, create quizzes, and monitor attendance.',
      stack: ['React Native 0.74', 'Expo SDK 51', 'TypeScript', 'SQLite Offline Cache', 'Firebase Push SDK'],
      features: [
        'Dashboard: Classes, Attendance, Homework & Grading',
        'Quiz & Assessment Creator with instant auto-grading',
        'Remote Control panel for IFP board navigation',
        'Classroom note broadcasting directly to student tablets',
        'Student profile & academic performance reporting',
        'Push notifications for submissions and school alerts'
      ],
      boundary: '🚫 Does NOT call FastAPI AI endpoints in Phase 1. All CRUD operations route exclusively through Node.js Backend API.'
    },
    {
      id: 'student',
      name: 'gyoash-student-app — Student Tablet App',
      type: 'Mobile & Web Surface App',
      description: 'Student portal for answering quizzes, viewing live WebRTC class streams, reading digital textbooks, and submitting homework assignments.',
      stack: ['React Native 0.74', 'Expo SDK 51', 'React (Web)', 'TypeScript', 'SQLite Offline Engine', 'WebRTC Viewer'],
      features: [
        'Live Class WebRTC viewer with real-time poll responder',
        'Homework submission (Camera photos, PDF, Audio notes)',
        'Interactive Quizzes, Puzzles & Academic Gamification',
        'Digital Textbook reader with offline book download',
        'Timetable, attendance records & parent switch mode'
      ],
      boundary: '🚫 No direct AI API calls in Phase 1. Doubt resolution is teacher thread-based.'
    },
    {
      id: 'admin',
      name: 'gyoash-admin — School & Super Admin Portal',
      type: 'Web Management Portal',
      description: 'Central management console for Super Admins and School Principals to manage branches, licenses, device fleet, and usage analytics.',
      stack: ['React 18', 'Vite 5', 'TypeScript', 'TailwindCSS', 'TanStack Query v5', 'Recharts'],
      features: [
        'Super Admin: School onboarding, branch setup & panel mapping',
        'License Key Generator: Expiry, renewal, and seat allocation',
        'Remote Lock/Unlock panels & Fleet MDM device monitoring',
        'School Principal: Teacher registration, student import (CSV)',
        'Class-wise content blocking & LMS data loading',
        'Usage Analytics: Board uptime, teacher activity & PDF reports'
      ],
      boundary: '🚫 Pure administrative CRUD portal. Zero AI dependencies.'
    },
    {
      id: 'backend',
      name: 'gyoash-backend — Node.js Central Monolith',
      type: 'Core API Backend',
      description: 'The single source of truth handling Authentication, Multi-tenant RBAC, Database ORM, WebSockets, BullMQ background jobs, and License Validation.',
      stack: ['Node.js 20 LTS', 'Express 4', 'TypeScript', 'PostgreSQL 16', 'Prisma ORM 5', 'Redis 7', 'Socket.io 4', 'BullMQ'],
      features: [
        'All REST APIs: Auth, Users, Classes, Homework, Assessments',
        'Socket.io WebSocket server: Live room management & presence',
        'WebRTC signaling server & SFU recording dispatch',
        'Hardware License Key validation & MAC address lock',
        'Firebase Push Notification admin dispatcher',
        'Chunked file upload handler to S3 / Azure Blob Storage',
        'Proxy Router for Panel App AI requests to FastAPI'
      ],
      boundary: '🚫 Does NOT run LLM inference directly. Passes AI requests downstream to FastAPI microservice.'
    },
    {
      id: 'ai',
      name: 'gyoash-ai — Python FastAPI AI Microservice',
      type: 'AI Engine Microservice',
      description: 'Dedicated Python microservice executing LLM prompt generation, OCR handwriting recognition, Speech-to-Text (STT), and PPTX file generation.',
      stack: ['Python 3.11', 'FastAPI 0.111', 'LangChain 0.2', 'OpenAI GPT-4o SDK', 'Tesseract OCR', 'Whisper STT', 'python-pptx'],
      features: [
        'AI Lesson Planner: POST /ai/lesson-plan (Generates full lesson structure)',
        'AI Quiz Generator: POST /ai/quiz (MCQs, True/False, Short Answer)',
        'AI PPT Generator: POST /ai/ppt (Generates downloadable .pptx presentation)',
        'AI Explain & Concept Simplifier: POST /ai/explain',
        'AI Worksheet & Mind Map Generator: POST /ai/worksheet',
        'AI Math Formula & OCR Solver: POST /ai/ocr',
        'AI Voice Assistant: POST /ai/voice (Whisper STT → Intent parser)'
      ],
      boundary: '🚫 Only invoked via Node.js API Proxy from IFP Panel App. Standalone microservice.'
    }
  ];

  const fullTechStack = [
    { layer: 'Panel Frontend', tech: 'React 18 + Electron', ver: '18.3.1', repo: 'gyoash-panel', reason: 'Runs in Android WebView & Windows Electron. High FPS Canvas.' },
    { layer: 'Canvas Engine', tech: 'Fabric.js / Konva.js', ver: 'Latest', repo: 'gyoash-panel', reason: 'Vector drawing, multi-touch whiteboard pen & shape rendering.' },
    { layer: 'Mobile Apps', tech: 'React Native + Expo', ver: '0.74 / SDK 51', repo: 'Teacher & Student', reason: 'Cross-platform Android + iOS from unified TypeScript codebase.' },
    { layer: 'Admin Web', tech: 'React 18 + Vite + Tailwind', ver: '18 / 5', repo: 'gyoash-admin', reason: 'Fast SPA dashboard for school principals and super admins.' },
    { layer: 'Node Backend', tech: 'Node.js + Express', ver: '20 LTS / 4.19', repo: 'gyoash-backend', reason: 'Monolith REST API, fast async execution, multi-tenant DB access.' },
    { layer: 'Database ORM', tech: 'Prisma ORM', ver: '5.14', repo: 'gyoash-backend', reason: 'Type-safe PostgreSQL database access, migrations & schema modeling.' },
    { layer: 'Real-time WebSocket', tech: 'Socket.io', ver: '4.7', repo: 'gyoash-backend', reason: 'WebSocket room management for live classroom interaction.' },
    { layer: 'AI Microservice', tech: 'Python + FastAPI', ver: '3.11 / 0.111', repo: 'gyoash-ai', reason: 'Async Python server for LLM pipelines, LangChain & OCR.' },
    { layer: 'Primary Database', tech: 'PostgreSQL', ver: '16.2', repo: 'gyoash-backend', reason: 'Relational database for users, licenses, classes, and homework.' },
    { layer: 'Cache & Session', tech: 'Redis', ver: '7.2', repo: 'gyoash-backend', reason: 'In-memory session cache, WebSocket presence & rate limiting.' }
  ];

  const aiEndpoints = [
    { path: 'POST /ai/lesson-plan', desc: 'Generates structured lesson plan with topic breakdowns, duration & objectives.', input: '{ topic, grade, subject }', output: 'JSON Lesson Plan Object' },
    { path: 'POST /ai/quiz', desc: 'Generates interactive quiz with questions, answer keys & explanations.', input: '{ topic, questionCount, difficulty }', output: 'JSON Quiz Array' },
    { path: 'POST /ai/ppt', desc: 'Generates a downloadable PowerPoint presentation (.pptx file) from topic prompt.', input: '{ topic, slideCount }', output: 'Binary .pptx Download' },
    { path: 'POST /ai/explain', desc: 'Simplifies complex concepts for elementary / high school student understanding.', input: '{ conceptText, gradeLevel }', output: 'Formatted Explanation Text' },
    { path: 'POST /ai/worksheet', desc: 'Generates printable student homework worksheet with exercises.', input: '{ topic, grade }', output: 'JSON Worksheet Data' },
    { path: 'POST /ai/ocr', desc: 'Extracts handwritten notes or math formulas from panel camera image.', input: '{ base64Image }', output: 'Extracted LaTeX / Text' },
    { path: 'POST /ai/voice', desc: 'Voice assistant STT pipeline via Whisper to trigger board actions.', input: '{ audioBlob }', output: 'Intent Action Object' }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Architecture</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">Monolith-First</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Node.js + Express Monolith</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Codebase Repos</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">6 Repos</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">4 Surfaces + 2 Backends</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Whiteboard Engine</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">60 FPS Canvas</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Vector Pen & HTML5 Canvas</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">AI Engine</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">FastAPI Python</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Local AI Microservice</span>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveSubTab('repos')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'repos' ? 'bg-indigo-600 text-white' : 'bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        >
          📦 6 Repositories Map
        </button>
        <button 
          onClick={() => setActiveSubTab('techstack')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'techstack' ? 'bg-indigo-600 text-white' : 'bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        >
          🛠️ Full Tech Stack Table
        </button>
        <button 
          onClick={() => setActiveSubTab('api')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'api' ? 'bg-indigo-600 text-white' : 'bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        >
          🔀 API Boundaries
        </button>
        <button 
          onClick={() => setActiveSubTab('ai')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        >
          🤖 AI Microservice APIs
        </button>
      </div>

      {/* Sub-tab 1: Repositories */}
      {activeSubTab === 'repos' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-muted-foreground">
            Click any repository card below to open its complete developer specification modal (including detailed features, boundaries & libraries):
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {repoDetails.map((repo) => (
              <div 
                key={repo.id}
                onClick={() => onOpenRepoModal(repo)}
                className="bg-card border border-border rounded-xl p-5 shadow-xs hover:border-indigo-500/50 cursor-pointer transition-all group relative"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-500/20">
                    {repo.type}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-semibold group-hover:underline flex items-center gap-1">
                    Click for full specs <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-indigo-500 transition-colors">{repo.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{repo.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {repo.stack.map((st, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] bg-muted/30">
                      {st}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Tech Stack */}
      {activeSubTab === 'techstack' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-foreground">Complete System Technology Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3">Layer</th>
                  <th className="p-3">Technology</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Repository</th>
                  <th className="p-3">Architectural Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {fullTechStack.map((st, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{st.layer}</td>
                    <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{st.tech}</td>
                    <td className="p-3 font-mono text-muted-foreground">{st.ver}</td>
                    <td className="p-3 font-mono text-muted-foreground">{st.repo}</td>
                    <td className="p-3 text-muted-foreground">{st.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: API Boundaries */}
      {activeSubTab === 'api' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-foreground">Client API Invocation Matrix</h3>
          <p className="text-xs text-muted-foreground">
            Strict rule: Only the IFP Panel App invokes FastAPI AI endpoints. All other client surfaces interact exclusively through Node.js REST API & Socket.io WebSockets.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3">Client Surface</th>
                  <th className="p-3">Calls Node.js API?</th>
                  <th className="p-3">Calls FastAPI AI?</th>
                  <th className="p-3">Uses WebSocket?</th>
                  <th className="p-3">Uses WebRTC?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-semibold">
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-orange-500">🖥️ IFP Panel App</td>
                  <td className="p-3 text-emerald-500">✅ Yes (CRUD & Auth)</td>
                  <td className="p-3 text-emerald-500">✅ Yes (All 11 AI Tools)</td>
                  <td className="p-3 text-emerald-500">✅ Yes (Live Room Host)</td>
                  <td className="p-3 text-emerald-500">✅ Yes (Stream Broadcaster)</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-amber-500">📱 Teacher Mobile App</td>
                  <td className="p-3 text-emerald-500">✅ Yes (CRUD & Auth)</td>
                  <td className="p-3 text-red-500">🚫 No (Zero AI in P1)</td>
                  <td className="p-3 text-red-500">🚫 No</td>
                  <td className="p-3 text-red-500">🚫 No</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-teal-500">📱 Student Tablet App</td>
                  <td className="p-3 text-emerald-500">✅ Yes (CRUD & Auth)</td>
                  <td className="p-3 text-red-500">🚫 No (Zero AI in P1)</td>
                  <td className="p-3 text-emerald-500">✅ Yes (Polls & Raise Hand)</td>
                  <td className="p-3 text-emerald-500">✅ Yes (Live Class Viewer)</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="p-3 font-bold text-blue-500">🌐 School Admin Portal</td>
                  <td className="p-3 text-emerald-500">✅ Yes (Admin & Fleet)</td>
                  <td className="p-3 text-red-500">🚫 No (Zero AI in P1)</td>
                  <td className="p-3 text-red-500">🚫 No</td>
                  <td className="p-3 text-red-500">🚫 No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: AI Endpoints */}
      {activeSubTab === 'ai' && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-foreground">FastAPI Python AI Microservice Endpoints</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="p-3">Endpoint Route</th>
                  <th className="p-3">Description & Action</th>
                  <th className="p-3">Input Payload</th>
                  <th className="p-3">Response Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {aiEndpoints.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">{ep.path}</td>
                    <td className="p-3 text-foreground font-medium">{ep.desc}</td>
                    <td className="p-3 font-mono text-muted-foreground">{ep.input}</td>
                    <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{ep.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   2. DETAILED SPRINT PLAN & 98 USER STORIES BREAKDOWN
   ========================================================================= */
function DetailedSprintPlanBreakdown({ onOpenStoryModal }: { onOpenStoryModal: (story: any) => void }) {
  const [search, setSearch] = useState('');

  const sprintOverview = [
    { id: 's1', title: 'Sprint 1 — Foundation & Authentication', dates: 'Sept 01 – Sept 14, 2026', stories: 16, goal: 'Multi-tenant auth, license key validation, role permissions, user database model.' },
    { id: 's2', title: 'Sprint 2 — Core Whiteboard & Digital Books', dates: 'Sept 15 – Sept 28, 2026', stories: 18, goal: 'Canvas 60FPS whiteboard engine, EPUB/PDF reader, quiz creation.' },
    { id: 's3', title: 'Sprint 3 — AI Assistant & Content Store', dates: 'Sept 29 – Oct 12, 2026', stories: 16, goal: 'FastAPI Python integration, AI lesson generator, media library & content store.' },
    { id: 's4', title: 'Sprint 4 — Mobile Apps & Offline Sync', dates: 'Oct 13 – Oct 26, 2026', stories: 16, goal: 'Teacher & Student React Native apps, SQLite offline sync, WebSocket classroom.' },
    { id: 's5', title: 'Sprint 5 — School Admin Portal & Analytics', dates: 'Oct 27 – Nov 09, 2026', stories: 16, goal: 'Super Admin, School Principal portal, device MDM fleet management & PDF export.' },
    { id: 's6', title: 'Sprint 6 — Hardening, Load Testing & Launch', dates: 'Nov 10 – Nov 23, 2026', stories: 16, goal: 'Security audit compliance, WebSocket 500-user load test & production release.' }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Sprint Schedule</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">6 Sprints</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Sept 1 – Nov 23, 2026</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">User Story Baseline</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98 Stories</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">FC0001 — FC0098</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Demo Milestones</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">12 Demos</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Bi-weekly Stakeholder Sign-off</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Buffer Reserve</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">5 Days</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Final Deployment Hardening</span>
        </div>
      </div>

      {/* Sprints Overview List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">6 Bi-Weekly Sprints Roadmap</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sprintOverview.map((sp) => (
            <div key={sp.id} className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold rounded-md border border-indigo-500/20">
                  {sp.id.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">{sp.dates}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">{sp.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{sp.goal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. DETAILED PHASE 1 COVERAGE MATRIX BREAKDOWN
   ========================================================================= */
function DetailedPhase1CoverageBreakdown() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const coverageItems = [
    { module: 'Module 1 — Whiteboard Engine', name: 'Infinite Canvas & Multi-page rendering', status: 'IN_SCOPE', source: 'Annex B M1 + Annex A' },
    { module: 'Module 1 — Whiteboard Engine', name: 'Vector Pen, Eraser, Shapes, Ruler, Protractor', status: 'IN_SCOPE', source: 'Annex B M1' },
    { module: 'Module 1 — Whiteboard Engine', name: 'OCR — Handwriting to Text & Equation Solver', status: 'IN_SCOPE', source: 'Annex B M1' },
    { module: 'Module 1 — Whiteboard Engine', name: 'Spotlight, Screen Shade, Magnifier, Split Screen', status: 'IN_SCOPE', source: 'Annex A Tender' },
    { module: 'Module 2 — AI Teacher (Panel)', name: 'AI Lesson Planner & AI PPT Generator', status: 'IN_SCOPE', source: 'Annex B M2' },
    { module: 'Module 2 — AI Teacher (Panel)', name: 'AI Quiz, Worksheet & Mind Map Generator', status: 'IN_SCOPE', source: 'Annex B M2' },
    { module: 'Module 2 — AI Teacher (Panel)', name: 'AI Voice Assistant & Formula Solver', status: 'IN_SCOPE', source: 'Annex B M2' },
    { module: 'Module 2 — AI Teacher (Panel)', name: 'AI Text-to-Picture / AI Image Generator', status: 'DEFERRED', source: 'Annex A Tender' },
    { module: 'Module 3 — Classroom', name: 'Live Poll, Quiz & Raise Hand Queue', status: 'IN_SCOPE', source: 'Annex B M3' },
    { module: 'Module 3 — Classroom', name: 'Student Whiteboard & Collaborative Canvas', status: 'IN_SCOPE', source: 'Annex B M3' },
    { module: 'Module 4 — Content Library', name: 'Filter by CBSE/ICSE/State Board, Class & Subject', status: 'IN_SCOPE', source: 'Annex B M4' },
    { module: 'Module 5 — Virtual Labs', name: '3D Solar System, Human Body & Chemistry Labs', status: 'IN_SCOPE', source: 'Annex B M5' },
    { module: 'Module 6 — Casting', name: 'Wireless Android / iOS / Windows casting to panel', status: 'IN_SCOPE', source: 'Annex B M6' },
    { module: 'Module 7 — Recording', name: 'Record Board + Audio → MP4 cloud upload', status: 'IN_SCOPE', source: 'Annex B M7' },
    { module: 'Module 7 — Recording', name: 'Auto-Transcript (Whisper) & AI PDF Notes', status: 'DEFERRED', source: 'Annex B M7' },
    { module: 'Module 8 — Analytics', name: 'Teacher & School usage dashboards & PDF export', status: 'IN_SCOPE', source: 'Annex B M8' },
    { module: 'Module 9 — School AI', name: 'Per-school private RAG & vector database', status: 'REMOVED', source: 'Annex B M9' },
    { module: 'Module 10 — Device MDM', name: 'License key generation, remote lock & health', status: 'IN_SCOPE', source: 'Features xlsx' },
    { module: 'Module 14 — Security', name: 'JWT, SSO, 2FA TOTP, QR login & RBAC', status: 'IN_SCOPE', source: 'Annex B M14' }
  ];

  const filteredItems = useMemo(() => {
    if (filterStatus === 'ALL') return coverageItems;
    return coverageItems.filter(item => item.status === filterStatus);
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Functional Coverage</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100% In-Scope</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Phase 1 Complete Specs</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Core Modules</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">14 Modules</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">All 4 Client Surfaces</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Phase 2 Enhancements</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">8 Features</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Deferred to Future Scope</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Scope Guardrails</span>
          <div className="text-2xl font-black text-red-500">Explicit Exclusions</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Prevents Scope Creep</span>
        </div>
      </div>

      {/* Interactive Coverage Filter Buttons & Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Complete Feature Coverage Matrix</span>
          </h2>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white border-transparent' : 'bg-background border-border text-muted-foreground'}`}
            >
              All Features ({coverageItems.length})
            </button>
            <button 
              onClick={() => setFilterStatus('IN_SCOPE')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${filterStatus === 'IN_SCOPE' ? 'bg-emerald-600 text-white border-transparent' : 'bg-background border-border text-emerald-600'}`}
            >
              ✅ Phase 1 ({coverageItems.filter(i => i.status === 'IN_SCOPE').length})
            </button>
            <button 
              onClick={() => setFilterStatus('DEFERRED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${filterStatus === 'DEFERRED' ? 'bg-amber-600 text-white border-transparent' : 'bg-background border-border text-amber-600'}`}
            >
              🔶 Phase 2 ({coverageItems.filter(i => i.status === 'DEFERRED').length})
            </button>
            <button 
              onClick={() => setFilterStatus('REMOVED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${filterStatus === 'REMOVED' ? 'bg-red-600 text-white border-transparent' : 'bg-background border-border text-red-500'}`}
            >
              🚫 Out of Scope ({coverageItems.filter(i => i.status === 'REMOVED').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="p-3">Module Name</th>
                <th className="p-3">Feature Specification</th>
                <th className="p-3">Phase 1 Status</th>
                <th className="p-3">Document Reference Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">{item.module}</td>
                  <td className="p-3 text-foreground font-medium">{item.name}</td>
                  <td className="p-3">
                    {item.status === 'IN_SCOPE' && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-md border border-emerald-500/20">
                        ✅ Phase 1 In-Scope
                      </span>
                    )}
                    {item.status === 'DEFERRED' && (
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded-md border border-amber-500/20">
                        🔶 Phase 2 Deferred
                      </span>
                    )}
                    {item.status === 'REMOVED' && (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-md border border-red-500/20">
                        🚫 Removed Scope
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. DETAILED PROJECT SCOPE & CONTRACT TERMS BREAKDOWN
   ========================================================================= */
function DetailedScopeContractBreakdown() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({
    1: 'Option A — Panel only (no AI on Teacher App)',
    2: 'Option B — Keep as manual teacher-reply thread (no AI)',
    3: 'Option A — Keep basic recording (no transcript/subtitles/PDF)',
    4: 'Option A — Removed entirely from this project'
  });

  const openQuestions = [
    {
      id: 1,
      title: 'AI Lesson Planner — Panel only, or also in Teacher Mobile App?',
      why: 'Annex C Section 6 lists AI Lesson Planner as a Teacher App feature. Confirm if restricted to IFP Panel or enabled on mobile.',
      options: ['Option A — Panel only (no AI on Teacher App)', 'Option B — Teacher App also gets AI Lesson Planner']
    },
    {
      id: 2,
      title: 'Doubt Resolution in Student App — remove completely or manual thread?',
      why: 'Annex D Section 11 shows AI voice/image doubt answers. Since AI is panel-only, confirm manual teacher-reply thread.',
      options: ['Option A — Remove completely', 'Option B — Keep as manual teacher-reply thread (no AI)']
    },
    {
      id: 3,
      title: 'Module 7 Recording — basic video recording vs total removal?',
      why: 'AI outputs (transcript, subtitles, PDF notes) are removed. Is basic video recording (capture + upload + student playback) still required?',
      options: ['Option A — Keep basic recording (no transcript/subtitles/PDF)', 'Option B — Remove Module 7 entirely']
    },
    {
      id: 4,
      title: 'Module 9 (School AI / Private RAG) — confirmed removed or Phase 3?',
      why: 'School AI was in original spec. Confirm whether removed entirely or deferred to separate Phase 3 pricing.',
      options: ['Option A — Removed entirely from this project', 'Option B — Deferred to Phase 3 (separate scope + pricing)']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Contract SLA</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">99.5% Uptime</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Production Availability</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Project Code</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Project 2609</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">GYOASH Platform</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">User Story Scope</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">FC0001–FC0098</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">98 Contract Stories</span>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Contract Status</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">Approved</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Phase 1 Scope Formalized</span>
        </div>
      </div>

      {/* Confirmed In Scope vs Out of Scope comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-card border border-emerald-500/30 rounded-xl space-y-3 shadow-xs">
          <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>✅ Confirmed Contracted In-Scope Deliverables</span>
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M1 Whiteboard Engine:</strong> Full canvas, infinite pages, vector pen, shapes, OCR, and annotation over screen/camera.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M2 AI Teacher (Panel Only):</strong> AI Lesson Planner, PPT Generator, Quiz Gen, Worksheet Gen, Mind Maps & Voice Assistant.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M3 Interactive Classroom:</strong> Live polls, quiz participation, raise hand queue, collaborative whiteboard.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M4 Content Library:</strong> CBSE/ICSE/Board filtering, search pipeline, class-wise age blocking.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M5 Virtual Labs & 3D Models:</strong> Three.js 3D Solar System, Human Body, Physics/Chemistry lab simulation engine.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M6 Wireless Casting:</strong> Android, iOS, Windows wireless screen share receiver on panel.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M7 Classroom Recording:</strong> Board + audio recording, S3 chunked upload, student app playback.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M8 Analytics Dashboard:</strong> Teacher & School usage charts, PDF/Excel export.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>M10 Device Management:</strong> Super Admin panel lock, license key generator, MAC address lock.</span></li>
            <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span><strong>Teacher & Student Mobile Apps:</strong> Full CRUD React Native apps (Attendance, Homework, Quizzes).</span></li>
          </ul>
        </div>

        <div className="p-5 bg-card border border-red-500/30 rounded-xl space-y-3 shadow-xs">
          <h3 className="font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>🚫 Explicit Contract Exclusions (Out of Scope)</span>
          </h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>M9 School AI / Private RAG:</strong> Entire per-school vector database & RAG pipeline removed.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>AI Features on Mobile Apps:</strong> Zero AI endpoints on Teacher or Student mobile apps in Phase 1.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>Auto-Transcript & Subtitles:</strong> Whisper post-processing of recording videos removed.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>AI PDF Notes from Recordings:</strong> Automatic lesson note generation from video removed.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>AI-Generated Analytics Insights:</strong> Text commentary ("Students struggled") removed; pure data charts only.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>AI Doubt Resolution:</strong> AI student tutor replaced with manual teacher-reply thread.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>ERP Integration:</strong> Third-party school ERP data sync excluded from Phase 1.</span></li>
            <li className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /><span><strong>Hardware & Panel Firmware:</strong> Physical panel manufacturing & OS kernel changes excluded.</span></li>
          </ul>
        </div>
      </div>

      {/* 4 Open Clarification Questions Section */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>4 Open Clarification Points & Selections</span>
        </h3>

        <div className="grid gap-4">
          {openQuestions.map((q) => (
            <div key={q.id} className="p-4 bg-muted/20 border border-border rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
                  {q.id}
                </span>
                <h4 className="text-xs font-bold text-foreground">{q.title}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">{q.why}</p>

              <div className="pl-7 pt-1 flex flex-wrap gap-2">
                {q.options.map((opt, i) => {
                  const isSelected = selectedAnswers[q.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-xs' 
                          : 'bg-card border-border text-muted-foreground hover:bg-accent/40'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Sign-off SLA Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground">Formal Contract Sign-off & Binding Parties</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="p-3">Party Name</th>
                <th className="p-3">Role & Responsibility</th>
                <th className="p-3">Authorized Representative</th>
                <th className="p-3">Sign-off Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">INNONSH Technologies Pvt. Ltd.</td>
                <td className="p-3 text-muted-foreground">Software Engineering & Delivery Partner</td>
                <td className="p-3 font-semibold text-foreground">Technical Lead / Delivery Head</td>
                <td className="p-3"><Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Approved & Signed</Badge></td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">GYOASH Technologies</td>
                <td className="p-3 text-muted-foreground">Client & Product Owner</td>
                <td className="p-3 font-semibold text-foreground">Pawan Verma (Product Owner)</td>
                <td className="p-3"><Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Approved & Formalized</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

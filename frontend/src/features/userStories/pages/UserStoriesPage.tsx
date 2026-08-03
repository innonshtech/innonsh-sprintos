import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Plus, 
  History, 
  Search, 
  Trash2, 
  ExternalLink, 
  Filter, 
  RefreshCw,
  X,
  UserCheck,
  ChevronRight,
  Check,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  useUserStories, 
  useCreateUserStory, 
  useUpdateUserStory, 
  useDeleteUserStory, 
  useClearAllUserStories,
  useBulkImportUserStories,
  useUserStoryHistory 
} from '../api/userStoriesApi';
import type { UserStory } from '../types/userStory';
import { toast } from 'react-hot-toast';

const COLUMN_DEFINITIONS = [
  { key: 'featureId', label: 'FEATURE ID', minWidth: 'min-w-[140px]', excelName: 'Feature ID' },
  { key: 'featureName', label: 'FEATURE NAME', minWidth: 'min-w-[240px]', excelName: 'Feature Name' },
  { key: 'moduleSection', label: 'MODULE / SECTION', minWidth: 'min-w-[240px]', excelName: 'Module / Section' },
  { key: 'userType', label: 'USER TYPE', minWidth: 'min-w-[150px]', excelName: 'User Type' },
  { key: 'scenarioId', label: 'SCENARIO ID', minWidth: 'min-w-[140px]', excelName: 'Scenario ID' },
  { key: 'scenarioName', label: 'SCENARIO NAME', minWidth: 'min-w-[300px]', excelName: 'Scenario Name' },
  { key: 'userStoryExpectedOutput', label: 'USER STORY - EXPECTED OUTPUT', minWidth: 'min-w-[480px]', excelName: 'User Story - Expected Output' },
  { key: 'uiScreenName', label: 'UI SCREEN NAME', minWidth: 'min-w-[240px]', excelName: 'UI Screen Name' },
  { key: 'uiScreenId', label: 'UI SCREEN ID', minWidth: 'min-w-[140px]', excelName: 'UI Screen ID' },
  { key: 'figmaLink', label: 'FIGMA LINK', minWidth: 'min-w-[220px]', excelName: 'Figma Link' },
  { key: 'phase', label: 'PHASE', minWidth: 'min-w-[140px]', excelName: 'Phase' },
  { key: 'figmaStatus', label: 'FIGMA STATUS', minWidth: 'min-w-[160px]', excelName: 'Figma Status' },
  { key: 'itStatus', label: 'IT STATUS', minWidth: 'min-w-[170px]', excelName: 'IT Status' },
];

const FigmaIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

export default function UserStoriesPage() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [featureFilter, setFeatureFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [itStatusFilter, setItStatusFilter] = useState('ALL');

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ id: string; key: string } | null>(null);
  const [cellValue, setCellValue] = useState('');

  // Figma Link Hover Preview state
  const [hoveredFigmaUrl, setHoveredFigmaUrl] = useState<{ url: string; x: number; y: number; storyId: string } | null>(null);

  // History Drawer & Active Story History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedStoryIdForHistory, setSelectedStoryIdForHistory] = useState<string | undefined>(undefined);

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedRows, setImportedRows] = useState<Partial<UserStory>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear All Modal state
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Single Row Delete Confirmation Modal state
  const [storyToDelete, setStoryToDelete] = useState<UserStory | null>(null);

  // API Queries & Mutations
  const { data: userStories = [], isLoading, refetch } = useUserStories({
    search: searchTerm,
    featureName: featureFilter === 'ALL' ? undefined : featureFilter,
    moduleSection: moduleFilter === 'ALL' ? undefined : moduleFilter,
    phase: phaseFilter === 'ALL' ? undefined : phaseFilter,
    itStatus: itStatusFilter === 'ALL' ? undefined : itStatusFilter,
  });

  const { data: auditLogs = [], isLoading: isLoadingLogs } = useUserStoryHistory(selectedStoryIdForHistory);

  const createStoryMutation = useCreateUserStory();
  const updateStoryMutation = useUpdateUserStory();
  const deleteStoryMutation = useDeleteUserStory();
  const clearAllMutation = useClearAllUserStories();
  const bulkImportMutation = useBulkImportUserStories();

  // Unique Feature Names for Dropdown Filter
  const uniqueFeatures = useMemo(() => {
    const features = new Set<string>();
    userStories.forEach(s => {
      if (s.featureName && s.featureName.trim()) features.add(s.featureName.trim());
    });
    return Array.from(features);
  }, [userStories]);

  // Unique Modules for Secondary Filter
  const uniqueModules = useMemo(() => {
    const modules = new Set<string>();
    userStories.forEach(s => {
      if (s.moduleSection && s.moduleSection.trim()) modules.add(s.moduleSection.trim());
    });
    return Array.from(modules);
  }, [userStories]);

  // Unique Phases
  const uniquePhases = useMemo(() => {
    const phases = new Set<string>();
    userStories.forEach(s => {
      if (s.phase && s.phase.trim()) phases.add(s.phase.trim());
    });
    return Array.from(phases);
  }, [userStories]);

  // Start cell edit
  const handleStartEdit = (story: UserStory, key: string) => {
    setEditingCell({ id: story.id, key });
    setCellValue(String((story as any)[key] ?? ''));
  };

  // Confirm save with Tick button or Enter
  const handleSaveEdit = async (story: UserStory, key: string) => {
    if (!editingCell) return;
    const originalValue = String((story as any)[key] ?? '');
    if (cellValue !== originalValue) {
      try {
        await updateStoryMutation.mutateAsync({
          id: story.id,
          data: { [key]: cellValue },
        });
        toast.success('Changes saved successfully', { duration: 600 });
      } catch (err: any) {
        toast.error('Failed to save changes', { duration: 600 });
      }
    }
    setEditingCell(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Keyboard shortcut listener
  const handleCellKeyDown = (e: React.KeyboardEvent, story: UserStory, key: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(story, key);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Add new row
  const handleAddRow = async () => {
    try {
      const nextCount = userStories.length + 1;
      const formattedNum = String(nextCount).padStart(4, '0');
      await createStoryMutation.mutateAsync({
        featureId: `FC${formattedNum}`,
        featureName: 'New Feature',
        moduleSection: 'General Section',
        userType: 'User',
        scenarioId: `SCN${formattedNum}`,
        scenarioName: 'New scenario description',
        userStoryExpectedOutput: 'Expected user story output details...',
        uiScreenName: 'New Screen',
        uiScreenId: `UI${formattedNum}`,
        phase: 'Phase 1',
        figmaStatus: 'PENDING',
        itStatus: 'BACKLOG',
      });
      toast.success('Added new user story row', { duration: 600 });
    } catch (err: any) {
      toast.error('Failed to add story row', { duration: 600 });
    }
  };

  // Confirm single row deletion
  const handleConfirmSingleDelete = async () => {
    if (!storyToDelete) return;
    try {
      await deleteStoryMutation.mutateAsync(storyToDelete.id);
      toast.success('User story deleted successfully', { duration: 600 });
      setStoryToDelete(null);
    } catch (err: any) {
      toast.error('Failed to delete user story', { duration: 600 });
    }
  };

  // Revert version from Google Sheets version history log
  const handleRevertVersion = async (log: any) => {
    if (!log.userStoryId || !log.field || log.oldValue === undefined || log.oldValue === null) {
      toast.error('Cannot revert this log record', { duration: 600 });
      return;
    }
    try {
      await updateStoryMutation.mutateAsync({
        id: log.userStoryId,
        data: { [log.field]: log.oldValue },
      });
      toast.success(`Reverted ${log.field} back to "${log.oldValue || '(empty)'}"`, { duration: 600 });
    } catch (err: any) {
      toast.error('Failed to revert change', { duration: 600 });
    }
  };

  // Clear all stories
  const handleConfirmClearAll = async () => {
    try {
      await clearAllMutation.mutateAsync();
      toast.success('All user stories have been deleted', { duration: 600 });
      setIsClearAllModalOpen(false);
    } catch (err: any) {
      toast.error('Failed to clear user stories', { duration: 600 });
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (userStories.length === 0) {
      toast.error('No stories to export', { duration: 600 });
      return;
    }

    const exportData = userStories.map(story => ({
      'Feature ID': story.featureId || '',
      'Feature Name': story.featureName || '',
      'Module / Section': story.moduleSection || '',
      'User Type': story.userType || '',
      'Scenario ID': story.scenarioId || '',
      'Scenario Name': story.scenarioName || '',
      'User Story - Expected Output': story.userStoryExpectedOutput || '',
      'UI Screen Name': story.uiScreenName || '',
      'UI Screen ID': story.uiScreenId || '',
      'Figma Link': story.figmaLink || '',
      'Phase': story.phase || '',
      'Figma Status': story.figmaStatus || '',
      'IT Status': story.itStatus || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Stories');

    const max_widths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length + 5, 20)
    }));
    worksheet['!cols'] = max_widths;

    XLSX.writeFile(workbook, `User_Stories_SprintOS_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Downloaded User Stories Excel file', { duration: 600 });
  };

  // Handle Excel File Upload & Parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];

        const rawData: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const mapped: Partial<UserStory>[] = rawData.map(row => ({
          featureId: String(row['Feature ID'] || row['featureId'] || row['FeatureId'] || ''),
          featureName: String(row['Feature Name'] || row['featureName'] || row['FeatureName'] || ''),
          moduleSection: String(row['Module / Section'] || row['Module/Section'] || row['moduleSection'] || ''),
          userType: String(row['User Type'] || row['userType'] || ''),
          scenarioId: String(row['Scenario ID'] || row['scenarioId'] || ''),
          scenarioName: String(row['Scenario Name'] || row['scenarioName'] || ''),
          userStoryExpectedOutput: String(row['User Story - Expected Output'] || row['User Story'] || row['userStoryExpectedOutput'] || ''),
          uiScreenName: String(row['UI Screen Name'] || row['uiScreenName'] || ''),
          uiScreenId: String(row['UI Screen ID'] || row['uiScreenId'] || ''),
          figmaLink: String(row['Figma Link'] || row['figmaLink'] || ''),
          phase: String(row['Phase'] || row['phase'] || ''),
          figmaStatus: String(row['Figma Status'] || row['figmaStatus'] || 'PENDING'),
          itStatus: String(row['IT Status'] || row['itStatus'] || 'BACKLOG'),
        }));

        setImportedRows(mapped);
        setIsImportModalOpen(true);
      } catch (err: any) {
        toast.error('Failed to parse Excel file', { duration: 600 });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Confirm Import
  const handleConfirmImport = async () => {
    if (importedRows.length === 0) return;
    try {
      await bulkImportMutation.mutateAsync(importedRows);
      toast.success(`Successfully imported ${importedRows.length} user stories!`, { duration: 600 });
      setIsImportModalOpen(false);
      setImportedRows([]);
    } catch (err: any) {
      toast.error('Failed to import user stories', { duration: 600 });
    }
  };

  // Badges
  const getFigmaStatusBadge = (status: string | null) => {
    switch (status) {
      case 'APPROVED':
      case 'DONE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
    }
  };

  const getITStatusBadge = (status: string | null) => {
    switch (status) {
      case 'DEPLOYED':
      case 'DONE':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'IN_DEVELOPMENT':
      case 'TESTING':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-background">
      {/* Top Header & Action Controls Bar */}
      <div className="bg-card border-b border-border p-4 md:px-6 flex flex-col gap-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">User Stories Specification Sheet</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20">
                  {userStories.length} Stories
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full non-compact Google Sheets view. Double-click cells to edit & confirm with the tick button.
              </p>
            </div>
          </div>

          {/* Perfectly Aligned Horizontal Action Controls Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Add Row Button */}
            <button
              onClick={handleAddRow}
              disabled={createStoryMutation.isPending}
              className="h-9 flex items-center gap-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Row</span>
            </button>

            {/* Import Excel */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-9 flex items-center gap-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={handleExportExcel}
              className="h-9 flex items-center gap-1.5 px-3.5 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors border border-border flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            {/* Clear All Stories Button */}
            {userStories.length > 0 && (
              <button
                onClick={() => setIsClearAllModalOpen(true)}
                className="h-9 flex items-center gap-1.5 px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors border border-red-500/20 flex-shrink-0"
                title="Clear All Stories"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}

            {/* Audit History Drawer Toggle */}
            <button
              onClick={() => {
                setSelectedStoryIdForHistory(undefined);
                setIsHistoryOpen(true);
              }}
              className="h-9 flex items-center gap-1.5 px-3.5 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors border border-border flex-shrink-0"
            >
              <History className="w-4 h-4 text-amber-500" />
              <span>Audit History</span>
            </button>

            {/* Inline Working Refresh Button */}
            <button
              onClick={async () => {
                await refetch();
                toast.success('Changes saved successfully', { duration: 600 });
              }}
              className="h-9 w-9 flex items-center justify-center bg-secondary hover:bg-accent text-secondary-foreground rounded-lg transition-colors border border-border flex-shrink-0"
              title="Refresh Sheet Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search feature, scenario, UI screen, expected output..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-background text-foreground text-xs rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ALL FEATURES Filter Dropdown (Primary Filter) */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Feature:</span>
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="bg-background text-foreground border border-indigo-500/40 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[220px]"
            >
              <option value="ALL">All Features</option>
              {uniqueFeatures.map((feat) => (
                <option key={feat} value={feat}>{feat}</option>
              ))}
            </select>
          </div>

          {/* Module Filter (Secondary) */}
          <div className="flex items-center gap-1.5">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-background text-foreground border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
            >
              <option value="ALL">All Modules</option>
              {uniqueModules.map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="bg-background text-foreground border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Phases</option>
              {uniquePhases.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* IT Status Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={itStatusFilter}
              onChange={(e) => setItStatusFilter(e.target.value)}
              className="bg-background text-foreground border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All IT Status</option>
              <option value="BACKLOG">BACKLOG</option>
              <option value="IN_DEVELOPMENT">IN_DEVELOPMENT</option>
              <option value="TESTING">TESTING</option>
              <option value="DEPLOYED">DEPLOYED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Google Sheets Datagrid Container (Full non-compact scrollable view) */}
      <div className="flex-1 overflow-auto bg-card relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Loading User Stories Data Grid...</span>
          </div>
        ) : userStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No user stories found</p>
            <p className="text-xs text-muted-foreground">Click "Add Row" or "Import Excel" to get started.</p>
            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Add First User Story
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[3200px]">
            {/* Header matching original sheet purple style with generous widths */}
            <thead className="sticky top-0 z-20 bg-purple-900 text-white select-none border-b-2 border-purple-950 shadow-sm">
              <tr>
                <th className="p-3 text-[11px] font-bold tracking-wider uppercase border-r border-purple-800 text-center w-14 bg-purple-950">
                  #
                </th>
                {COLUMN_DEFINITIONS.map((col) => (
                  <th
                    key={col.key}
                    className={`p-3 text-[11px] font-bold tracking-wider uppercase border-r border-purple-800/80 ${col.minWidth}`}
                  >
                    <span>{col.label}</span>
                  </th>
                ))}
                <th className="p-3 text-[11px] font-bold tracking-wider uppercase w-28 text-center bg-purple-950">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs font-normal">
              {userStories.map((story, index) => (
                <tr 
                  key={story.id} 
                  className="hover:bg-accent/40 transition-colors group min-h-[48px]"
                >
                  {/* Row Number */}
                  <td className="p-3 text-center font-mono text-[11px] text-muted-foreground bg-muted/20 border-r border-border font-medium">
                    {index + 1}
                  </td>

                  {/* Render Columns */}
                  {COLUMN_DEFINITIONS.map((col) => {
                    const isEditing = editingCell?.id === story.id && editingCell?.key === col.key;
                    const value = String((story as any)[col.key] ?? '');

                    // Special rendering for Figma Link
                    if (col.key === 'figmaLink') {
                      return (
                        <td 
                          key={col.key} 
                          className={`p-3 border-r border-border ${col.minWidth} relative`}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Paste Figma URL..."
                                value={cellValue}
                                onChange={(e) => setCellValue(e.target.value)}
                                onKeyDown={(e) => handleCellKeyDown(e, story, col.key)}
                                className="flex-1 bg-background border border-indigo-500 rounded p-1.5 text-xs text-foreground focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveEdit(story, col.key)}
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow"
                                title="Confirm & Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 bg-slate-600 hover:bg-slate-700 text-white rounded"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : value ? (
                            <div 
                              className="relative inline-block"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredFigmaUrl({
                                  url: value,
                                  x: rect.left,
                                  y: rect.bottom + window.scrollY,
                                  storyId: story.id,
                                });
                              }}
                              onMouseLeave={() => setHoveredFigmaUrl(null)}
                            >
                              <a
                                href={value.startsWith('http') ? value : `https://${value}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium hover:bg-purple-500/20 transition-colors"
                              >
                                <FigmaIcon className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[140px]">View Figma</span>
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </a>
                            </div>
                          ) : (
                            <span 
                              onClick={() => handleStartEdit(story, col.key)}
                              className="text-indigo-500/70 italic cursor-pointer hover:underline font-medium inline-flex items-center gap-1"
                            >
                              + Add Figma Link
                            </span>
                          )}
                        </td>
                      );
                    }

                    // Special rendering for Figma Status
                    if (col.key === 'figmaStatus') {
                      return (
                        <td key={col.key} className={`p-3 border-r border-border ${col.minWidth}`}>
                          <select
                            value={story.figmaStatus || 'PENDING'}
                            onChange={async (e) => {
                              try {
                                await updateStoryMutation.mutateAsync({
                                  id: story.id,
                                  data: { figmaStatus: e.target.value },
                                });
                                toast.success('Changes saved successfully', { duration: 600 });
                              } catch {
                                toast.error('Failed to update status', { duration: 600 });
                              }
                            }}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border focus:outline-none cursor-pointer ${getFigmaStatusBadge(story.figmaStatus)}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </td>
                      );
                    }

                    // Special rendering for IT Status
                    if (col.key === 'itStatus') {
                      return (
                        <td key={col.key} className={`p-3 border-r border-border ${col.minWidth}`}>
                          <select
                            value={story.itStatus || 'BACKLOG'}
                            onChange={async (e) => {
                              try {
                                await updateStoryMutation.mutateAsync({
                                  id: story.id,
                                  data: { itStatus: e.target.value },
                                });
                                toast.success('Changes saved successfully', { duration: 600 });
                              } catch {
                                toast.error('Failed to update status', { duration: 600 });
                              }
                            }}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border focus:outline-none cursor-pointer ${getITStatusBadge(story.itStatus)}`}
                          >
                            <option value="BACKLOG">BACKLOG</option>
                            <option value="IN_DEVELOPMENT">IN_DEVELOPMENT</option>
                            <option value="TESTING">TESTING</option>
                            <option value="DEPLOYED">DEPLOYED</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </td>
                      );
                    }

                    // Standard Cell rendering with Tick Confirmation button
                    return (
                      <td 
                        key={col.key} 
                        onClick={() => !isEditing && handleStartEdit(story, col.key)}
                        className={`p-3 border-r border-border ${col.minWidth} cursor-pointer hover:bg-indigo-500/5 transition-colors relative group/cell`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full">
                            {col.key === 'userStoryExpectedOutput' || col.key === 'scenarioName' ? (
                              <textarea
                                autoFocus
                                rows={2}
                                value={cellValue}
                                onChange={(e) => setCellValue(e.target.value)}
                                className="flex-1 bg-background border border-indigo-500 rounded p-1.5 text-xs text-foreground focus:outline-none"
                              />
                            ) : (
                              <input
                                type="text"
                                autoFocus
                                value={cellValue}
                                onChange={(e) => setCellValue(e.target.value)}
                                onKeyDown={(e) => handleCellKeyDown(e, story, col.key)}
                                className="flex-1 bg-background border border-indigo-500 rounded p-1.5 text-xs text-foreground focus:outline-none"
                              />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(story, col.key);
                              }}
                              className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm flex-shrink-0"
                              title="Save Cell (Tick)"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="p-1 bg-slate-600 hover:bg-slate-700 text-white rounded flex-shrink-0"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group-hover/cell:pr-1">
                            <span className={`whitespace-normal leading-relaxed ${col.key === 'featureId' || col.key === 'scenarioId' || col.key === 'uiScreenId' ? 'font-mono text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-foreground'}`}>
                              {value || '-'}
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  <td className="p-3 text-center w-28">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStoryIdForHistory(story.id);
                          setIsHistoryOpen(true);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors"
                        title="View Version History"
                      >
                        <History className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryToDelete(story);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Delete User Story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Figma Link Hover Preview Card Popover */}
      {hoveredFigmaUrl && (
        <div
          className="fixed z-50 p-3 bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-w-xs space-y-2 pointer-events-auto"
          style={{ top: Math.min(hoveredFigmaUrl.y + 8, window.innerHeight - 140), left: Math.min(hoveredFigmaUrl.x, window.innerWidth - 300) }}
        >
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <FigmaIcon className="w-4 h-4" />
            <span className="font-bold text-xs tracking-tight text-zinc-100">Figma Design File</span>
          </div>
          <p className="text-[11px] text-zinc-400 break-all line-clamp-2">
            {hoveredFigmaUrl.url}
          </p>
          <div className="flex items-center justify-between pt-1">
            <a
              href={hoveredFigmaUrl.url.startsWith('http') ? hoveredFigmaUrl.url : `https://${hoveredFigmaUrl.url}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Open Figma</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Google Sheets Version History Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="font-bold text-foreground text-sm">Google Sheets Version History</h2>
                  <p className="text-[11px] text-muted-foreground">Review revisions & revert changes</p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingLogs ? (
                <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                  <span>Loading version history...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No edit activity or revision history logged yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 bg-accent/30 rounded-lg border border-border/60 text-xs space-y-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        {log.changedBy?.name || 'System / User'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {log.action}
                      </span>
                      {log.field !== 'All' && (
                        <span className="font-medium text-foreground">Field: <code className="bg-muted px-1 py-0.5 rounded text-[11px] font-mono">{log.field}</code></span>
                      )}
                    </div>

                    {log.field !== 'All' && log.oldValue !== null && log.oldValue !== undefined && (
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <div className="text-muted-foreground leading-relaxed text-[11px] flex-1 mr-2 break-all">
                          <span className="line-through text-red-400/90 mr-1">{log.oldValue || '(empty)'}</span>
                          <ChevronRight className="w-3 h-3 inline text-muted-foreground" />
                          <span className="text-emerald-500 font-semibold ml-1">{log.newValue || '(empty)'}</span>
                        </div>
                        
                        <button
                          onClick={() => handleRevertVersion(log)}
                          disabled={updateStoryMutation.isPending}
                          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md text-[11px] font-bold transition-colors inline-flex items-center gap-1 flex-shrink-0 border border-amber-500/30"
                          title="Revert story field to this previous version"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Revert</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Single Row Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-foreground">Delete User Story?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete user story <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{storyToDelete.featureId || storyToDelete.scenarioId || 'Item'}</span> ({storyToDelete.featureName || storyToDelete.scenarioName || 'User Story'})?
            </p>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/50">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSingleDelete}
                disabled={deleteStoryMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {deleteStoryMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Stories Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-foreground">Clear All User Stories?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete all <span className="font-bold text-foreground">{userStories.length} user stories</span> and their audit logs? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/50">
              <button
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearAll}
                disabled={clearAllMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {clearAllMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Yes, Delete All Stories</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Preview Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-foreground text-base">Confirm Excel Sheet Import</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Detected <span className="font-bold text-foreground">{importedRows.length} user story rows</span> ready for import. Preview below before confirming:
            </p>

            <div className="flex-1 overflow-auto border border-border rounded-lg mb-4 max-h-64">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted text-muted-foreground sticky top-0 font-semibold">
                  <tr>
                    <th className="p-2 border-b">Feature ID</th>
                    <th className="p-2 border-b">Feature Name</th>
                    <th className="p-2 border-b">Module</th>
                    <th className="p-2 border-b">Scenario Name</th>
                    <th className="p-2 border-b">Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {importedRows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-accent/40">
                      <td className="p-2 font-mono">{row.featureId || '-'}</td>
                      <td className="p-2 font-medium">{row.featureName || '-'}</td>
                      <td className="p-2">{row.moduleSection || '-'}</td>
                      <td className="p-2">{row.scenarioName || '-'}</td>
                      <td className="p-2">{row.phase || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {importedRows.length > 10 && (
              <p className="text-[11px] text-muted-foreground italic mb-4">
                + {importedRows.length - 10} more rows will be imported.
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={bulkImportMutation.isPending}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {bulkImportMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Import {importedRows.length} Stories</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

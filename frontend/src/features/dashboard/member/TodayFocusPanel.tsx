import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Check, RefreshCw } from 'lucide-react';
import { useTodayFocus, useUpdateTodayFocus } from '../api/memberDashboardApi';
import { useToast } from '@/hooks/use-toast';

export default function TodayFocusPanel({ tasks, reviewQueue }: { tasks: any[], reviewQueue: number }) {
  const { data: focusData, isLoading } = useTodayFocus();
  const updateFocus = useUpdateTodayFocus();
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (focusData && !isEditing) {
      setContent(focusData.content);
    }
  }, [focusData, isEditing]);

  const handleSave = () => {
    updateFocus.mutate(
      { id: focusData?.id, content },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({
            title: "Focus Updated",
            description: "Your daily focus has been saved.",
          });
        }
      }
    );
  };

  const handleAutoGenerate = () => {
    const dueToday = tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate.toDateString() === today.toDateString();
    });
    
    const highPriority = tasks.filter(t => t.priority === 'URGENT' || t.priority === 'CRITICAL' || t.priority === 'HIGH');
    
    let gen = "🎯 Today's Focus:\n\n";
    if (dueToday.length > 0) {
      gen += `Due Today:\n${dueToday.map(t => `• ${t.title}`).join('\n')}\n\n`;
    }
    if (highPriority.length > 0) {
      gen += `High Priority:\n${highPriority.map(t => `• ${t.title}`).join('\n')}\n\n`;
    }
    if (reviewQueue > 0) {
      gen += `Review Queue:\n• ${reviewQueue} tasks pending review\n`;
    }
    
    if (gen === "🎯 Today's Focus:\n\n") {
      gen += "• Select a task to start working on\n";
    }
    
    setContent(gen);
    setIsEditing(true);
  };

  if (isLoading) {
    return <Card className="animate-pulse bg-card h-[300px]" />;
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-card border-indigo-100 shadow-soft h-full flex flex-col">
      <CardHeader className="pb-3 border-b bg-white/50 dark:bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-md">Today's Focus</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handleAutoGenerate} title="Auto-generate from tasks" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        {isEditing || !focusData?.content ? (
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is your main focus for today?"
            className="min-h-[200px] resize-none border-dashed bg-white/80 dark:bg-card focus-visible:ring-indigo-500"
          />
        ) : (
          <div 
            className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 min-h-[200px] cursor-text p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-md transition-colors"
            onClick={() => setIsEditing(true)}
          >
            {content}
          </div>
        )}
      </CardContent>
      {(isEditing || !focusData?.content) && (
        <CardFooter className="pt-0 justify-end pb-4 pr-4">
          <Button onClick={handleSave} disabled={updateFocus.isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            {updateFocus.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Save Focus
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

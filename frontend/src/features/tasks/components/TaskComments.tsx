import { useState } from 'react';
import { useAddComment } from '../api/taskApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function TaskComments({ taskId, comments }: { taskId: string, comments: any[] }) {
  const [newComment, setNewComment] = useState('');
  const addComment = useAddComment();
  const { user } = useAuthStore();

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ taskId, content: newComment.trim() }, {
      onSuccess: () => setNewComment('')
    });
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Comment Input */}
      <div className="flex gap-3 mb-6">
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            placeholder="Add a comment..." 
            className="min-h-[80px] text-sm resize-none"
            value={newComment}
            onChange={(e: any) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={!newComment.trim() || addComment.isPending} onClick={handleSubmit}>
              <Send className="w-3.5 h-3.5 mr-2" />
              {addComment.isPending ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-5">
        {comments?.map((comment: any) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.user?.avatar} />
              <AvatarFallback>{comment.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-sm">{comment.user?.name}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

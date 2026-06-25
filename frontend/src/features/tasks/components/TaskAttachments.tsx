import React, { useRef, useState } from 'react';
import { useAddAttachment } from '../api/taskApi';
import { Button } from '@/components/ui/button';
import { Paperclip, Upload, File, Loader2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface TaskAttachmentsProps {
  taskId: string;
  attachments?: Attachment[];
}

export default function TaskAttachments({ taskId, attachments = [] }: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addAttachmentMutation = useAddAttachment();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await addAttachmentMutation.mutateAsync({ taskId, fileData: formData });
    } catch (error) {
      console.error('Failed to upload attachment:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center">
          <Paperclip className="w-4 h-4 mr-2" />
          Attachments ({attachments.length})
        </h4>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      {attachments.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 border rounded-md hover:bg-muted transition-colors group"
            >
              <div className="mr-3 text-muted-foreground group-hover:text-primary transition-colors">
                <File className="w-8 h-8" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate" title={attachment.fileName}>
                  {attachment.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes ? formatBytes(attachment.fileSize) : `${(attachment.fileSize / 1024).toFixed(1)} KB`}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center p-6 border border-dashed rounded-md">
          No attachments yet. Upload images or PDFs to provide more context.
        </div>
      )}
    </div>
  );
}

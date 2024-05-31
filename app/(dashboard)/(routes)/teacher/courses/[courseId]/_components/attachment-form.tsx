'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { PlusCircle, File, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Attachment, Course } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});
type FormSchemaValue = z.infer<typeof formSchema>;

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const router = useRouter();

  const onSubmit = async (values: FormSchemaValue) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course image updated successfully');
      toggleEditing();
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course Attachments
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && <p className='text-sm mt-2 text-slate-500 italic'> No attachment</p>}
          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-75 transition'
                      onClick={() => {
                        onDelete(attachment.id);
                      }}
                    >
                      <X className='h-4 w-4 ' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Add anything your students might need to complete the cource.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;

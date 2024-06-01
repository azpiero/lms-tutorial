'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});
type FormSchemaValue = z.infer<typeof formSchema>;

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };
  const router = useRouter();
  const form = useForm<FormSchemaValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: FormSchemaValue) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter created');
      toggleCreating();
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      });
      toast.success('Chapters reordered');
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button variant='ghost' onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder='e.g. "Introduction to the course"' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
          {!initialData.chapters.length && 'No chapters'}
          <ChaptersList onEdit={() => {}} onReorder={onReorder} items={initialData.chapters || []} />
        </div>
      )}
      {!isCreating && <p className='text-xs text-muted-foreground mt-4'>Drag and drop to reorder the chapters</p>}
    </div>
  );
};

export default ChaptersForm;

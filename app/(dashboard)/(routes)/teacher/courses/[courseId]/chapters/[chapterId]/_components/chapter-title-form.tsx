'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});
type FormSchemaValue = z.infer<typeof formSchema>;

export const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const router = useRouter();
  const form = useForm<FormSchemaValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: FormSchemaValue) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter title updated successfully');
      toggleEditing();
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter Title
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className='text-sm mt-2'>{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder='Enter chapter title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterTitleForm;

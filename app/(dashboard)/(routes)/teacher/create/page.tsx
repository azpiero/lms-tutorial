'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

type formValues = z.infer<typeof formSchema>;

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: formValues) => {
    try {
      const response = await axios.post('/api/course', values);
      router.push(`/teacher/courses/${response.data.id}`);
    } catch {
      toast.error('An error occurred. Please try again');
    }
  };
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>Name your course</h1>
        <p className='text-sm text-slate-600'>
          Whet is the title of your course? Dont worry, you can change this later
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder='Enter course title' {...field} />
                  </FormControl>
                  <FormDescription>This is the title of your course. You can change this later</FormDescription>
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href='/'>
                <Button type='button' variant='ghost'>
                  Cancel
                </Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;

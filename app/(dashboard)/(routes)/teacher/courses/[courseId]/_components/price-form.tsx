'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});
type FormSchemaValue = z.infer<typeof formSchema>;

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const router = useRouter();
  const form = useForm<FormSchemaValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: FormSchemaValue) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course description updated successfully');
      toggleEditing();
      router.refresh();
    } catch {
      toast.error('An error occurred. Please try again');
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course Price
        <Button variant='ghost' onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn('text-sm mt-2', !initialData.price && 'text-slate-500 italic')}>
          {initialData.price ? formatPrice(initialData.price) : 'No price'}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      disabled={isSubmitting}
                      placeholder='Enter course price'
                      {...field}
                    />
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

export default PriceForm;

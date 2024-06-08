'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      // window.location.assignとは、指定されたURLにリダイレクトするためのメソッドです。
      window.location.assign(response.data.url);
    } catch {
      toast.error('something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={onClick} disabled={isLoading} size='sm' className='w-full md:w-auto'>
      Enroll for {formatPrice(price)}
    </Button>
  );
};

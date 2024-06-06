'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';

interface ChapterAcrionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterAcrions = ({ disabled, courseId, chapterId, isPublished }: ChapterAcrionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted successfully');
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success('Chapter unpublished successfully');
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success('Chapter updated successfully');
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-centergapx-2'>
      <Button disabled={disabled} onClick={onClick} variant='outline' size='sm'>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterAcrions;

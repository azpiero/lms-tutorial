import { IconBadge } from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: 'default' | 'success';
}

/**
 *
 * @param param0
 * @returns
 */
export const InfoCard = ({ icon, label, numberOfItems, variant }: InfoCardProps) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconBadge icon={icon} variant={variant} />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-gray-500 text-sm'>
          {numberOfItems} {numberOfItems === 1 ? 'course' : 'courses'}
        </p>
      </div>
    </div>
  );
};

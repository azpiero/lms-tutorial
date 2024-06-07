import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const CoursesPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const courses = await db.course.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;

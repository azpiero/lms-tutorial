import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs';
import { Course } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
    <div className='p-6'>
      <Link href='/teacher/create'>
        <Button>Courses Page!</Button>
      </Link>
      {!courses.length ? (
        <p>You have no courses yet</p>
      ) : (
        courses.map((course: Course) => {
          return (
            <div key={course.id}>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CoursesPage;

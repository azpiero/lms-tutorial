import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    console.log('[COURSE_ID_UNPUBLICSH]', updatedCourse);

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log('[COURSE_ID_UNPUBLICSH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

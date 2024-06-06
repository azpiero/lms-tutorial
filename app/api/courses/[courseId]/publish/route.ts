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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const hasPublishedChapters = course.chapters.some((chapter) => chapter.isPublished);

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId ||
      !hasPublishedChapters
    ) {
      return new NextResponse('Missing require data', { status: 401 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log('[COURSE_ID_PUBLICSH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

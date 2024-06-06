import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse('Permission Error', { status: 403 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    const muxData = await db.muxData.findFirst({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (!chapter || !muxData || !chapter.videoUrl || !chapter.title || !chapter.description) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('[CHAPTER PUBLISH]', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

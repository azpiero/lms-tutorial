import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();
    // isPublishedは別のAPIで操作するのでのぞいておく
    const { isPublished, ...values } = await req.json();
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

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // TODO: video update

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

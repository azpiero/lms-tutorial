import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import Mux from '@mux/mux-node';

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
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

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 });
    }
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deleteChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // course内にpublishedなchapterがない場合、courseをunpublishする
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deleteChapter);
  } catch (error) {
    console.log('[CHAPTER DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

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

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // playback_policy: 'public',
      const asset = await video.assets.create({
        input: values.videoUrl,
        test: false,
      });

      console.log('asset id :', asset.id);

      const playbackId = await video.assets.createPlaybackId(asset.id, {
        policy: 'public',
      });

      console.log('playbockID :', playbackId.id);

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: playbackId.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

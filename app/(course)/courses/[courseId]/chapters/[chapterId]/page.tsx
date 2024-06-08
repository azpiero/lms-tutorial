import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getChapter } from '@/actions/get-chapters';
import Banner from '@/components/banner';
import { VideoPlayer } from './_components/video-player';

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && <Banner variant='success' label='You already completed this chapter' />}
      {isLocked && <Banner variant='warning' label='This chapter is locked' />}
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <VideoPlayer
          chapterId={params.chapterId}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
      </div>
    </div>
  );
};
export default ChapterIdPage;

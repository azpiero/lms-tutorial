'use client';

import { Chapter } from '@prisma/client';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import { Grid, Grip, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChaptersListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  items: Chapter[];
}
export const ChaptersList = ({ items, onEdit, onReorder }: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  /**
   * splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
   * const ary = [0, 1, 2, 3, 4, 5, 6];

   * インデックス1から要素を2個取り除く
   * console.log(ary.splice(1, 2));     // [1, 2]
   * console.log(ary);                  // [0, 3, 4, 5, 6]

   * インデックス3から末尾までの要素を取り除く
   * console.log(ary.splice(3));        // [5, 6]
   * console.log(ary);                  // [0, 3, 4]

   * インデックス1から要素を1個取り除き、そこに99,100,101を追加する
   * console.log(ary.splice(1, 1, 99, 100, 101)); // [3]
   * console.log(ary);                  // [0, 99, 100, 101, 4] 
   * @param result
   * @returns
   */

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updateChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);
    const bulkUpdateData = updateChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        chapter.isPublished && 'bg-sky-200 border-sky-200'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    {chapter.title}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      {chapter.isFree && <Badge className='h-4 w-4'> Free </Badge>}
                      <Badge className={cn('bg-slate-500', chapter.isPublished && 'bg-sky-700')}>
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className='w-4 h-4 cursor-pointer hover:opacity-75 transition'
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChaptersList;

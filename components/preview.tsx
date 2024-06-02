'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import 'react-quill/dist/quill.bubble.css';

interface EditorProps {
  value: string;
}

export const Preview = ({ value }: EditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <div className='bg-slate'>
      <ReactQuill theme='bubble' value={value} readOnly />
    </div>
  );
};

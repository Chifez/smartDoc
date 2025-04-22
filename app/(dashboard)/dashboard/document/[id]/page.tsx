import { Suspense } from 'react';
import DocumentClient from '../document-client';

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<p>loading...</p>}>
      <DocumentClient id={id} />
    </Suspense>
  );
}

import DocumentClient from '../document-client';

export default async function DocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <DocumentClient id={id} />;
}

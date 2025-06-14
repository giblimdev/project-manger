// @/app/projects/roadmap/sprints/[id]/page.tsx

import React from "react"; 

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <div>projects/roadmap/sprints/[id] : {id}</div>;
}

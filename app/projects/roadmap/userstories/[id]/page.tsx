//@/app/projects/roadmap/userstories/[id]/page.ts



import React from "react"; 

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <div>projects/roadmap/userstories/[id] : {id}</div>;
}





//@/app/projects/teams/[id]/page.ts



import React from "react"; 

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <div>projects/teams/[id] : {id}</div>;
}





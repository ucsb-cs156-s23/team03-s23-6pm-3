import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SongTable from "main/components/Songs/SongTable";
import { useBackend } from "main/utils/useBackend";

export default function SongDetailsPage() {
  let { id } = useParams();

  const {
    data: songs,
    error,
    status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/song?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/song`,
      params: {
        id,
      },
    }
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Song Details</h1>
        {songs && <SongTable songs={[songs]} showButtons={false} />}
      </div>
    </BasicLayout>
  );
}

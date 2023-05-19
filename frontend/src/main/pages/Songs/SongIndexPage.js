import React from 'react'
import {useBackend} from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SongTable from 'main/components/Songs/SongTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function SongIndexPage() {

    const currentUser = useCurrentUser();

    const { data: songs, error: _error, status: _status } =
      useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
         ["/api/songs/all"],
         { method: "GET", url: "/api/songs/all" },
      []
    ); 

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Songs</h1>
                <SongTable songs={songs} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}

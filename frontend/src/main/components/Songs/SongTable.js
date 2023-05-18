import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBDateUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function SongTable({ songs, currentUser }){
    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        navigate(`/songs/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/songs/all"]
    );
    // Stryker enable all 

    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Artist',
            accessor: 'artist',
        },
        {
            Header: 'Album',
            accessor: 'album',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "SongTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "SongTable"));
    } 

    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedSongs = React.useMemo(() => dates, [dates]);

    return <OurTable
        data={memoizedSongs}
        columns={memoizedColumns}
        testid={"SongsTable"}
    />;
};

export { showCell };
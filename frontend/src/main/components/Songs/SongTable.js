import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/songUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function SongTable({ songs, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/songs/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        navigate(`/songs/details/${cell.row.values.id}`);
    };

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/song/all"]
    );
    // Stryker enable all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    };

    const columns = [
        {
            Header: "id",
            accessor: "id", // accessor is the "key" in the data
        },
        {
            Header: "Title",
            accessor: "title",
        },
        {
            Header: "Artist",
            accessor: "artist",
        },
        {
            Header: "Album",
            accessor: "album",
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(
            ButtonColumn("Details", "primary", detailsCallback, "SongTable")
        );
        columns.push(
            ButtonColumn("Edit", "primary", editCallback, "SongTable")
        );
        columns.push(
            ButtonColumn("Delete", "danger", deleteCallback, "SongTable")
        );
    }

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => songs, [songs]);

    return (
        <OurTable
            data={memoizedDates}
            columns={memoizedColumns}
            testid={"SongTable"}
        />
    );
}

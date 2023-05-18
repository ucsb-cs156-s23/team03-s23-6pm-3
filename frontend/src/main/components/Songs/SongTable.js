import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { songUtils } from "main/utils/songUtils";

const showCell = (cell) => JSON.stringify(cell.row.values);


const defaultDeleteCallback = async (cell) => {
    console.log(`deleteCallback: ${showCell(cell)})`);
    songUtils.del(cell.row.values.id);
}

export default function SongTable({
    songs,
    deleteCallback = defaultDeleteCallback,
    showButtons = true,
    testIdPrefix = "SongTable" }) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/songs/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/songs/details/${cell.row.values.id}`)
    }

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

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
        ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
        ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    ]

    const columnsToDisplay = showButtons ? buttonColumns : columns;

    return <OurTable
        data={songs}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };
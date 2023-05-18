import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SongTable from 'main/components/Songs/SongTable';
import { songUtils } from 'main/utils/songUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function SongIndexPage() {

    const navigate = useNavigate();

    const songCollection = songUtils.get();
    const songs = songCollection.songs;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`SongIndexPage deleteCallback: ${showCell(cell)})`);
        songUtils.del(cell.row.values.id);
        navigate("/songs");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/songs/create">
                    Create Song
                </Button>
                <h1>Songs</h1>
                <SongTable songs={songs} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}
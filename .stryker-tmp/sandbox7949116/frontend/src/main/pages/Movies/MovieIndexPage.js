import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MovieTable from 'main/components/Movies/MovieTable';
import { movieUtils } from 'main/utils/movieUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function MovieIndexPage() {

    const navigate = useNavigate();

    const movieCollection = movieUtils.get();
    const movies = movieCollection.movies;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`MovieIndexPage deleteCallback: ${showCell(cell)})`);
        movieUtils.del(cell.row.values.id);
        navigate("/movies");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/movies/create">
                    Create Movie
                </Button>
                <h1>Movies</h1>
                <MovieTable movies={movies} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}
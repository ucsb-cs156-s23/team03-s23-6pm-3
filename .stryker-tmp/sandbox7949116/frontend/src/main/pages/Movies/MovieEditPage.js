
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { movieUtils }  from 'main/utils/movieUtils';
import MovieForm from 'main/components/Movies/MovieForm';
import { useNavigate } from 'react-router-dom'


export default function MovieEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = movieUtils.getById(id);

    const onSubmit = async (movie) => {
        const updatedMovie = movieUtils.update(movie);
        console.log("updatedMovie: " + JSON.stringify(updatedMovie));
        navigate("/movies");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Movie</h1>
                <MovieForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.movie}/>
            </div>
        </BasicLayout>
    )
}
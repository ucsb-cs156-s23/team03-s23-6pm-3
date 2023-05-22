import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MovieForm from "main/components/Movies/MovieForm";
import { useNavigate } from 'react-router-dom'
import { movieUtils } from 'main/utils/movieUtils';

export default function MovieCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (movie) => {
    const createdMovie = movieUtils.add(movie);
    console.log("createdMovie: " + JSON.stringify(createdMovie));
    navigate("/movies");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Movie</h1>
        <MovieForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
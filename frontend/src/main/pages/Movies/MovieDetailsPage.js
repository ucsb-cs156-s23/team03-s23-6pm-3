import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MovieTable from 'main/components/Movies/MovieTable';
import { movieUtils } from 'main/utils/movieUtils';

export default function MovieDetailsPage() {
  let { id } = useParams();

  const response = movieUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Movie Details</h1>
        <MovieTable movies={[response.movie]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
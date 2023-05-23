import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MovieForm from "main/components/Movies/MovieForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MoviesEditPage() {
    let { id } = useParams();

    const {
        data: movie,
        error,
        status,
    } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/movies?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/movies`,
            params: {
                id,
            },
        }
    );

    const objectToAxiosPutParams = (movie) => ({
        url: "/api/movies",
        method: "PUT",
        params: {
            id: movie.id,
        },
        data: {
            name: movie.name,
            starring: movie.starring,
            director: movie.director,
        },
    });

    const onSuccess = (movie) => {
        toast(`Movie Updated - id: ${movie.id} name: ${movie.name}`);
    };

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/movies?id=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    if (isSuccess) {
        return <Navigate to="/movies/list" />;
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Movie</h1>
                {movie && (
                    <MovieForm
                        initialMovie={movie}
                        submitAction={onSubmit}
                        buttonLabel="Update"
                    />
                )}
            </div>
        </BasicLayout>
    );
}

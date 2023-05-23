import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MovieForm from "main/components/Movies/MovieForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MoviesCreatePage() {
    const objectToAxiosParams = (movie) => ({
        url: "/api/movies/post",
        method: "POST",
        params: {
            name: movie.name,
            starring: movie.starring,
            director: movie.director,
        },
    });

    const onSuccess = (movie) => {
        toast(`New movie created - id: ${movie.id} name: ${movie.name}`);
    };

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/movies/all"]
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
                <h1>Create New Movie</h1>

                <MovieForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    );
}

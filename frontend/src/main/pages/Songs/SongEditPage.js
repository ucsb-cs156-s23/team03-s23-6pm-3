import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SongForm from "main/components/Songs/SongForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SongsEditPage() {
    let { id } = useParams();

    const {
        data: song,
        error,
        status,
    } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/song?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/song`,
            params: {
                id,
            },
        }
    );

    const objectToAxiosPutParams = (song) => ({
        url: "/api/song",
        method: "PUT",
        params: {
            id: song.id,
        },
        data: {
            title: song.title,
            artist: song.artist,
            album: song.album,
        },
    });

    const onSuccess = (song) => {
        toast(
            `Song Updated - id: ${song.id} name: ${song.name}`
        );
    };

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/song?id=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    if (isSuccess) {
        return <Navigate to="/songs/list" />;
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Song</h1>
                {song && (
                    <SongForm
                        initialSong={song}
                        submitAction={onSubmit}
                        buttonLabel="Update"
                    />
                )}
            </div>
        </BasicLayout>
    );
}

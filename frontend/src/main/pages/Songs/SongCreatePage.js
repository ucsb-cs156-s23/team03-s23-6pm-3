import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SongForm from "main/components/Songs/SongForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SongCreatePage() {

  const objectToAxiosParams = (song) => ({
    url: "/api/song/post",
    method: "POST",
    params: {
      title: song.title,
      artist: song.artist,
      album: song.album
    }
  });


  const onSuccess = (song) => {
    toast(`New song Created - id: ${song.id} name: ${song.name}`);
  }


  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/song/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/songs/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Song</h1>

        <SongForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )

}

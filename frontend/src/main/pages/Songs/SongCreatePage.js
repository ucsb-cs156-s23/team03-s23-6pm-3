import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SongForm from "main/components/Songs/SongForm";
import { Navigate } from 'react-router-dom'
import { songUtils } from 'main/utils/songUtils';
import { toast } from "react-toastify";

export default function SongCreatePage() {

  const objectToAxiosParams = (song) => ({
    url: "/api/song/post",
    method: "POST",
    params: {
      id: Song.id,
      title: Song.title,
      artist: Song.localDateTime,
      album: Song.album
    }
  });

  const onSuccess = (song) => {
    toast(`New song Created - id: ${Song.id} title: ${Song.name}`);
  }
  
   const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/songs/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (song) => {
    mutation.mutate(song);
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

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SongForm from "main/components/Songs/SongForm";
import { useNavigate } from 'react-router-dom'
import { songUtils } from 'main/utils/songUtils';

export default function SongCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (song) => {
    const createdSong = songUtils.add(song);
    console.log("createdSong: " + JSON.stringify(createdSong));
    navigate("/songs");
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

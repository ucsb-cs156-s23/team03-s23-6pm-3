
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { songUtils }  from 'main/utils/songUtils';
import SongForm from 'main/components/Songs/SongForm';
import { useNavigate } from 'react-router-dom'


export default function SongEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = songUtils.getById(id);

    const onSubmit = async (song) => {
        const updatedSong = songUtils.update(song);
        console.log("updatedSong: " + JSON.stringify(updatedSong));
        navigate("/songs");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Song</h1>
                <SongForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.song}/>
            </div>
        </BasicLayout>
    )
}
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SongTable from 'main/components/Songs/SongTable';
import { songUtils } from 'main/utils/songUtils';

export default function SongDetailsPage() {
  let { id } = useParams();

  const response = songUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Song Details</h1>
        <SongTable songs={[response.song]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}

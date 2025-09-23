import type { Asset } from "@schemas/course";
import VideoViewer from "./VideoViewer";

export default function AssetResource({ asset }: { asset: Asset }) {
  if (asset.type === "video") {
    return <VideoViewer url={asset.url} />;
  }
  if (asset.type === "image") {
    return <img src={asset.url} className="h-full w-full" />;
  }
  if (asset.type === "pdf") {
    return (
      <object
        data={asset.url + "#toolbar=0"}
        type="application/pdf"
        width="100%"
        height="100%"
      ></object>
    );
  }
  return null;
}

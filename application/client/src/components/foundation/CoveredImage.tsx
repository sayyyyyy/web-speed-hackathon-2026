import { useCallback, useId, type MouseEvent } from "react";

import { Button } from "@web-speed-hackathon-2026/client/src/components/foundation/Button";
import { Modal } from "@web-speed-hackathon-2026/client/src/components/modal/Modal";
import { getImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";

interface Props {
  image: Models.Image;
  isPriority?: boolean;
}

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 */
export const CoveredImage = ({ image, isPriority }: Props) => {
  const dialogId = useId();
  const src = getImagePath(image.id);
  const alt = image.alt || "";
  const imageWidth = image.width || 1;
  const imageHeight = image.height || 1;

  // ダイアログの背景をクリックしたときに投稿詳細ページに遷移しないようにする
  const handleDialogClick = useCallback((ev: MouseEvent<HTMLDialogElement>) => {
    ev.stopPropagation();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-cax-surface-subtle">
      <img
        alt={alt}
        className="h-full w-full object-cover"
        src={src}
        width={imageWidth}
        height={imageHeight}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
      />
      <div className="absolute top-0 right-0 p-2">
        <Modal id={dialogId} onClick={handleDialogClick} title={alt}>
          <img alt={alt} className="max-h-[80vh] w-full object-contain" src={src} />
        </Modal>
        <Button className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70" command="show-modal" commandfor={dialogId}>
          🔍
        </Button>
      </div>
    </div>
  );
};

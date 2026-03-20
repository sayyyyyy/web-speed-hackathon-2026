import classNames from "classnames";
import { MouseEvent, useCallback, useId, useState, useRef, useEffect } from "react";

import { Button } from "@web-speed-hackathon-2026/client/src/components/foundation/Button";
import { Modal } from "@web-speed-hackathon-2026/client/src/components/modal/Modal";
import { getImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";

interface Props {
  image: Models.Image;
}

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 */
export const CoveredImage = ({ image }: Props) => {
  const dialogId = useId();
  const src = getImagePath(image.id);
  const alt = image.alt || "";
  const imageWidth = image.width || 0;
  const imageHeight = image.height || 0;

  // ダイアログの背景をクリックしたときに投稿詳細ページに遷移しないようにする
  const handleDialogClick = useCallback((ev: MouseEvent<HTMLDialogElement>) => {
    ev.stopPropagation();
  }, []);

  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        height: containerRef.current.clientHeight,
        width: containerRef.current.clientWidth,
      });
    }
  }, []);

  const containerRatio = containerSize.height / containerSize.width;
  const imageRatio = imageHeight / imageWidth;

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-cax-surface-subtle">
      <img
        alt={alt}
        className={classNames(
          "absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
          {
            "w-auto h-full": containerRatio > imageRatio,
            "w-full h-auto": containerRatio <= imageRatio,
          },
        )}
        src={src}
        loading="lazy"
        decoding="async"
      />

      <button
        className="border-cax-border bg-cax-surface-raised/90 text-cax-text-muted hover:bg-cax-surface absolute right-1 bottom-1 rounded-full border px-2 py-1 text-center text-xs"
        type="button"
        command="show-modal"
        commandfor={dialogId}
        onClick={(ev) => ev.stopPropagation()}
      >
        ALT を表示する
      </button>

      <Modal id={dialogId} closedby="any" onClick={handleDialogClick}>
        <div className="grid gap-y-6">
          <h1 className="text-center text-2xl font-bold">画像の説明</h1>

          <p className="text-sm">{alt}</p>

          <Button variant="secondary" command="close" commandfor={dialogId}>
            閉じる
          </Button>
        </div>
      </Modal>
    </div>
  );
};

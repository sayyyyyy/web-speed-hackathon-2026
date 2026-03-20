import { useEffect, useRef, useState } from "react";

import { formatDate } from "@web-speed-hackathon-2026/client/src/utils/date";
import { getProfileImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";

interface Props {
  user: Models.User;
}

export const UserProfileHeader = ({ user }: Props) => {
  const [bgColor, setBgColor] = useState("var(--color-cax-brand)");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    let didCancel = false;

    import("fast-average-color").then(({ FastAverageColor }) => {
      if (didCancel) return;
      const fac = new FastAverageColor();
      fac
        .getColorAsync(imgRef.current!)
        .then((color) => {
          if (!didCancel) setBgColor(color.hex);
        })
        .catch((e) => {
          console.warn("Failed to extract color:", e);
        })
        .finally(() => {
          fac.destroy();
        });
    });

    return () => {
      didCancel = true;
    };
  }, [user.profileImage.id]);

  return (
    <div className="relative">
      <div
        className="bg-cax-brand h-32 w-full transition-colors duration-500 sm:h-48"
        style={{ backgroundColor: bgColor }}
      ></div>
      <div className="border-cax-border bg-cax-surface-subtle absolute left-2/4 m-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border sm:h-32 sm:w-32">
        <img
          ref={imgRef}
          alt={user.profileImage.alt}
          className="h-full w-full object-cover"
          src={getProfileImagePath(user.profileImage.id)}
          loading="lazy"
          decoding="async"
          id="user-profile-image" /* Added ID for fast-average-color extraction */
          crossOrigin="anonymous"
        />
      </div>
      <div className="px-4 pt-20">
        <div className="flex flex-col items-center">
          <h1 className="text-cax-text text-2xl font-bold">{user.name}</h1>
          <p className="text-cax-text-muted">@{user.username}</p>
        </div>
        <div className="mt-4 text-cax-text">
          <p className="whitespace-pre-wrap">{user.description}</p>
        </div>
        <div className="text-cax-text-subtle mt-4 flex items-center gap-2 text-sm">
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

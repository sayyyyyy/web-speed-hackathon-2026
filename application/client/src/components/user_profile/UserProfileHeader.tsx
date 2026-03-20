import { Link } from "react-router";

import { formatDate } from "@web-speed-hackathon-2026/client/src/utils/date";
import { getProfileImagePath } from "@web-speed-hackathon-2026/client/src/utils/get_path";

interface Props {
  user: Models.User;
}

export const UserProfileHeader = ({ user }: Props) => {
  return (
    <div className="relative">
      <div
        className="bg-cax-brand h-32 w-full sm:h-48"
        style={{
          backgroundColor: "var(--color-cax-brand)",
        }}
      ></div>
      <div className="border-cax-border bg-cax-surface-subtle absolute left-2/4 m-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border sm:h-32 sm:w-32">
        <img
          alt={user.profileImage.alt}
          className="h-full w-full object-cover"
          src={getProfileImagePath(user.profileImage.id)}
          loading="lazy"
          decoding="async"
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

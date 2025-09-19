import { ucFirst } from "../../utils/string";

const UserItem = ({ user = {}, onClick }) => {
  const { username = "Default Name", avatar } = user;

  const displayName = ucFirst(username);
  const displayAvatar = avatar?.url && "https://iili.io/HPz3fFn.png";

  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left cursor-pointer  bg-gray-200 hover:bg-gray-300  dark:bg-slate-900 dark:hover:bg-slate-950 p-3 rounded-xl transition-colors focus:outline-none focus:ring-0"
      >
        <img
          src={displayAvatar}
          alt={`${displayName}'s avatar`}
          className="size-10 rounded-full object-cover"
        />
        <span className="text-xl truncate">{displayName}</span>
      </button>
    </li>
  );
};

export default UserItem;

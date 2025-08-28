import { ucFirst } from "../utils/string";

const UserList = ({ user, handleOneOnOneChat }) => {
  return (
    <li
      className="flex gap-2 cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-slate-900 dark:hover:bg-slate-950 p-3 rounded-xl"
      onClick={() => handleOneOnOneChat(user)}
    >
      <img
        // src={user?.avatar?.url || "/images/user.png"}
        src={"/images/user.png"}
        alt="User Image"
        className="size-[40px] rounded-full object-cover"
      />
      <span className="text-xl">
        {ucFirst(user?.username) ?? "Default Name"}
      </span>
    </li>
  );
};

export default UserList;

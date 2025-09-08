import UserItem from "./UserItem";

import useChatStore from "../../store/useChatStore";

import useChatActions from "../../hooks/useChatActions";

const UserList = () => {
  const { availableUsers } = useChatStore();
  const { startOneOnOneChat } = useChatActions();
  
  return (
    <section className="w-[25%] h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-scroll scrollbar-custom">
        {availableUsers?.length ? (
          <ul className="flex flex-col gap-4 pr-4">
            {availableUsers.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onClick={() => startOneOnOneChat(user)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">No users available.</p>
        )}
      </div>
    </section>
  );
};

export default UserList;

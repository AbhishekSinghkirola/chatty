import { SquarePen } from "lucide-react";
import Search from "./Search";

const UserListHeader = () => {
  return (
    <section className="pr-1 md:pr-4 mb-4">
      <div className="flex item-center justify-between mb-4">
        <h3 className="text-xl">Chats</h3>
        <SquarePen />
      </div>
      <Search />
    </section>
  );
};

export default UserListHeader;

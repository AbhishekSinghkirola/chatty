import { Loader2, SquarePen } from "lucide-react";
import Search from "./Search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDropDown from "./UserDropDown";
import useChatStore from "../../store/useChatStore";

const UserListHeader = () => {
  const { loading, getAvailableUsers } = useChatStore();

  return (
    <section className="pr-1 md:pr-4 mb-4">
      <div className="flex item-center justify-between mb-4">
        <h3 className="text-xl">Chats</h3>

        <DropdownMenu onOpenChange={(open) => open && getAvailableUsers()}>
          <DropdownMenuTrigger>
            <SquarePen className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xl py-3">
              New Group Chat
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="mb-3">
              <Search />
            </DropdownMenuLabel>

            {loading ? (
              <Loader2 className="w-6 h-8 animate-spin m-auto my-1" />
            ) : (
              <UserDropDown />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Search />
    </section>
  );
};

export default UserListHeader;

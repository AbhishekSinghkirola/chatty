import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChatStore from "../../store/useChatStore";

const UserDropDown = () => {
  const { availableUsers } = useChatStore();

  return (
    <div className="max-h-[245px] overflow-y-auto scrollbar-custom">
      {availableUsers?.map((user) => (
        <DropdownMenuItem
          className="flex gap-3 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
          key={user?._id}
        >
          {console.log(user)}
          <Checkbox id={`user-${user?._id}`} className="cursor-pointer" />
          <label
            htmlFor={`user-${user?._id}`}
            className="flex gap-3 text-lg flex-1 cursor-pointer py-2 items-center"
          >
            <Avatar className="size-4 md:size-6">
              <AvatarImage src={user?.url} />
              <AvatarFallback>
                {user?.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user?.username || "--"}
          </label>
        </DropdownMenuItem>
      ))}
    </div>
  );
};

export default UserDropDown;

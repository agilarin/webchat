import { useEffect, useMemo, useState } from "react";
import { ChatType, UserProfile } from "@/types";
import { useCurrentUserStore } from "@/store";
import { searchUsersByUsername } from "@/services/searchService.ts";
import { ChatList, ChatItemWithUser } from "@/pages/Home/components/ChatList";
import { UserSearchListSkeleton } from "./UserSearchListSkeleton";
import { UserSearchListEmpty } from "./UserSearchListEmpty";
import classes from "./UserSearchList.module.scss";

interface UserSearchListProps {
  searchQuery: string;
  chats: ChatType[];
}

export function UserSearchList({ searchQuery, chats }: UserSearchListProps) {
  const userProfile = useCurrentUserStore.use.userProfile();
  const [result, setResult] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResult([]);
      setIsLoading(false);
      return;
    }
    let isCancelled = false;

    async function fetchUsers() {
      setIsLoading(true);
      try {
        const result = await searchUsersByUsername(searchQuery);
        if (!isCancelled) {
          setResult(result);
        }
      } catch (e) {
        if (!isCancelled) {
          setResult([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchUsers();

    return () => {
      isCancelled = true;
    };
  }, [searchQuery]);

  const filteredResult = useMemo(() => {
    const usernamesSet = new Set(chats.map(({ username }) => username));
    if (userProfile?.username) {
      usernamesSet.add(userProfile.username);
    }

    return result.filter((user) => !usernamesSet.has(user.username));
  }, [result, chats, userProfile]);

  if (isLoading) return <UserSearchListSkeleton />;
  if (!filteredResult?.length) return <UserSearchListEmpty />;

  return (
    <div className={classes.SearchListRoot}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>Результаты поиска</span>
      </div>
      <ChatList>
        {filteredResult.map((item) => (
          <ChatItemWithUser
            key={item.id}
            user={item}
          />
        ))}
      </ChatList>
    </div>
  );
}

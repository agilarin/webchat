import {ref, serverTimestamp, onValue, onDisconnect, update} from 'firebase/database';
import {database, auth} from "@/services/firebase.ts";



export async function updateUserOnlineStatus(isOnline: boolean) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Пользователь не авторизован");
  }

  try {
    await update(ref(database, `users/${user.uid}`), {
      isOnline,
      lastOnline: serverTimestamp(),
    });
  } catch (error) {
    console.error("Ошибка при обновлении онлайн-статуса:", error);
    throw error;
  }
}

export function updateUserOnConnection(userId: string) {
  const connectedRef = ref(database, '.info/connected');
  const userRef = ref(database, `users/${userId}`);

  return onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      return;
    }
    onDisconnect(userRef)
      .update({
        isOnline: false,
        lastOnline: serverTimestamp(),
      })
      .then(() => {
        update(userRef, {
          isOnline: true,
          lastOnline: serverTimestamp(),
        })
      });
  });
}



export function subscribeToUserStatusOnline(
  userId: string,
  callback: (isOnline: boolean, lastOnline: number) => void
) {
  const statusRef = ref(database, `users/${userId}`);
  return onValue(statusRef, (snapshot) => {
    const {isOnline, lastOnline} = snapshot.val();
    callback(isOnline, lastOnline)
  });
}
import {ref, serverTimestamp, onValue, onDisconnect, update} from 'firebase/database';
import {database} from "@/services/firebase.ts";


interface IUpdateUserOnConnection {
  userId: string,
}

export function updateUserOnConnection({userId}: IUpdateUserOnConnection) {
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
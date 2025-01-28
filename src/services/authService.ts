import {
  getAuth,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {ref, serverTimestamp, update} from 'firebase/database';
import {database, firestore} from "@/services/firebase.ts";
import {doc, setDoc, serverTimestamp as FSServerTimestamp, collection} from "firebase/firestore";


interface ICreateUser {
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName?: string,
}


interface ISignIn {
  email: string,
  password: string,
}



class authService {
  usersRef = collection(firestore, "users");
  userChatsRef = collection(firestore, "userchats");
  auth = getAuth();


  async createUser({email, password, username, firstName, lastName}: ICreateUser) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await setDoc(doc(this.usersRef, userCredential.user.uid), {
        email,
        username,
        firstName,
        lastName: lastName || null,
        createdAt: FSServerTimestamp(),
      });

      await setDoc(doc(this.userChatsRef, userCredential.user.uid), {
        chats: []
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async signIn({email, password}: ISignIn) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async signOut() {
    if (!this.auth.currentUser) {
      throw undefined;
    }

    try {
      await update(ref(database, `users/${this.auth.currentUser.uid}`), {
        isOnline: false,
        lastOnline: serverTimestamp(),
      })
      return await firebaseSignOut(this.auth);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}



export default new authService();
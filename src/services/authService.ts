import {
  getAuth,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider, updatePassword,
  updateEmail as updateEmailFirebase
} from "firebase/auth";
import {ref, serverTimestamp, update} from 'firebase/database';
import {doc, setDoc, serverTimestamp as FSServerTimestamp, collection, updateDoc} from "firebase/firestore";
import {database, firestore} from "@/services/firebase.ts";
import userChatsService from "@/services/userChatsService.ts";



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
  auth = getAuth();



  private async passwordVerification(password: string) {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw undefined;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        password
      )
      return await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


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
      await userChatsService.createUserChats(userCredential.user.uid);

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


  async updatePassword(oldPassword: string, newPassword: string) {
    try {
      const userCredential = await this.passwordVerification(oldPassword);
      await updatePassword(userCredential.user, newPassword)
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async updateEmail(newEmail: string, password: string) {
    try {
      const userCredential = await this.passwordVerification(password)
      await updateEmailFirebase(userCredential.user, newEmail);
      const userRef = doc(firestore, "user", userCredential.user.uid);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}



export default new authService();
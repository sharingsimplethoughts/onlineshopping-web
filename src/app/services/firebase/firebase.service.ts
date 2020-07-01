import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  createUser(value){
    return this.db.collection('Users').add({
      id:value.id,
      name: value.name,
      nameToSearch: value.name.toLowerCase(),
      // user_type: parseInt(value.age),
      // profile_pic: avatar
    });
  }
  getUser(userKey){
    return this.db.collection('Users').doc(userKey).snapshotChanges();
  }
  getUsers(){
    return this.db.collection('Users').snapshotChanges();
  }
  searchUsers(searchValue){
    return this.db.collection('Users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }
}

// ----------------------earlier------------------------------
  // getAvatars(){
  //     return this.db.collection('/Avatar').valueChanges()
  // }

  // getUser(userKey){
  //   return this.db.collection('Users').doc(userKey).snapshotChanges();
  // }

  // updateUser(userKey, value){
  //   var formatedValue={
  //     id:value.id,
  //     name: value.name,
  //     nameToSearch: value.name.toLowerCase()
  //   }
  //   // value.nameToSearch = value.name.toLowerCase();
  //   return this.db.collection('Users').doc(userKey).set(formatedValue);
  // }

  // deleteUser(userKey){
  //   return this.db.collection('Users').doc(userKey).delete();
  // }

  // getUsers(){
  //   return this.db.collection('Users').snapshotChanges();
  // }

  // searchUsers(searchValue){
  //   return this.db.collection('Users',ref => ref.where('nameToSearch', '>=', searchValue)
  //     .where('nameToSearch', '<=', searchValue + '\uf8ff'))
  //     .snapshotChanges()
  // }

  // searchUsersByAge(value){
  //   return this.db.collection('Users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  // }


  // createUser(value){
  //   return this.db.collection('Users').add({
  //     id:value.id,
  //     name: value.name,
  //     nameToSearch: value.name.toLowerCase(),
  //     // user_type: parseInt(value.age),
  //     // profile_pic: avatar
  //   });
  // }
  // createRoom(value){
  //   return this.db.collection('Chatrooms').add({
  //     room_id:value.room_id,
  //     user1_id:value.user1_id,
  //     user2_id:value.user2_id,
      
  //     // user_type: parseInt(value.age),
  //     // profile_pic: avatar
  //   });
  // }

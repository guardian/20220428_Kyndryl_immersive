// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection, getDocs, getDoc, doc, updateDoc, increment, writeBatch, arrayUnion } from "firebase/firestore";
import {onSnapshot } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBryoostKnr6TMc5klx-YaqOVNcwDbsWKs",
  authDomain: "kyn01-a9bae.firebaseapp.com",
  projectId: "kyn01-a9bae",
  storageBucket: "kyn01-a9bae.appspot.com",
  messagingSenderId: "203582590521",
  appId: "1:203582590521:web:cba146364e4cc1654947e8"
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);
const db = getFirestore(fireapp);

// Get a list of cities from your database
const dataList = async function getCities(db) {
  const citiesCol = collection(db, 'survey');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;

}
// Get a list of cities from your database
const polldoc = async function getCities(db) {
  const citiesCol = doc(db, 'survey', 'ASeVuptLIrcbVzDiAPIK');
  const citySnapshot = await getDoc(citiesCol);
  return citySnapshot.data();
}

export const checkPollState = async (userId) => {
//   const ref = doc(db, `respondent/${userId}`, 'completedPolls');
  const ref = doc(db, `respondent`, userId);
  const snapshot = await getDoc(ref);
  const data = snapshot.data() ? snapshot.data().completedPolls : [];

  console.log('checkPollState', data);
  return function (pollId) {
    return data.indexOf(pollId) >= 0;
  }
 
}

export const watchPoll = (docid, cb) => {
    // return onSnapshot(doc(db, 'survey', docid), (res)=>console.log('>>',res));
    return onSnapshot(doc(db, 'survey', docid), res=> cb(res.data()));
}

export const updateVote = async (docid, option, userId) => {
    const batch = writeBatch(db);
    const ref = doc(db, 'survey', docid);
    const respondentRef = doc(db, 'respondent', userId);
    // if (!(await getDoc(respondentRef)).exists() {
    //     batch.doc(db,'respondents', userId);
    // }
    // await updateDoc(ref, {option1: increment(1)})
    batch.update(ref, {[option]: increment(1)});
    batch.update(ref, {total: increment(1)});
    batch.update(respondentRef,{completedPolls: arrayUnion(docid)});
    // batch.update(respondentRef,'completedPolls', {completedPolls: arrayUnion(docid)});
    await batch.commit();
}

export const fireDb = dataList(db);

export const fireDoc = polldoc(db);



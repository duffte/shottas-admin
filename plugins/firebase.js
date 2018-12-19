import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyAY3ihvhzscRyegOBQtOjPTdiYGfTCJVeg',
    authDomain: 'shottas-24a2b.firebaseapp.com',
    databaseURL: 'https://shottas-24a2b.firebaseio.com',
    projectId: 'shottas-24a2b',
    storageBucket: 'shottas-24a2b.appspot.com',
    messagingSenderId: '225737590626'
  }
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true })
}
const fireDb = firebase.firestore()
const storage = firebase.storage()

export { storage, fireDb }

var firebaseConfig = {
  apiKey: "AIzaSyDLzTZawRI24-Ec57_B1_bl-qs7HWnkmAk",
  authDomain: "marvelmovies.firebaseapp.com",
  databaseURL: "https://marvelmovies.firebaseio.com",
  projectId: "marvelmovies",
  storageBucket: "marvelmovies.appspot.com",
  messagingSenderId: "379003713317",
  appId: "1:379003713317:web:36618e4d38079ece"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var db = firebase.firestore();
var marvelmoviesRef = db.collection("marvelmovies");

fillMovies();
fillFavourites();
logMovies();

function addMeClicked(idVal){
  editFavourite(idVal, true);
}

function removeMeClicked(idVal){
  editFavourite(idVal, false);
}

function editFavourite(idVal, favVal){
  marvelmoviesRef.where("id", "==", parseInt(idVal)).get().then(function(snapshot) {
  if (snapshot.size > 0) {
    snapshot.forEach(function (doc) {
      var userData = doc.data();
      console.log("Updating: " + userData.name);
      if(userData.fav != favVal){
        marvelmoviesRef.doc(doc.id).update({fav: favVal});

        if(favVal){ 
          userData.onRemoveMe = function(){removeMeClicked(doc.id);};
          favourites.push(userData);
        } else { 
          var indexToRemove = favourites.findIndex(function(el){return el.id==userData.id;});
          if(indexToRemove >= 0)
            favourites.splice(indexToRemove, 1);
        }
      }
    });
  } else {
    console.log('no documents found');
  }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

function fillMovies(){
  marvelmoviesRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var userData = doc.data();
      userData.onAddMe = function(){addMeClicked(doc.id);};
      users.push(userData);
    });
  }).catch(function(error) {
    console.log("Error getting documents: ", error);
  });
}

function fillFavourites(){
  marvelmoviesRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var userData = doc.data();
      if(userData.fav){
        userData.onRemoveMe = function(){removeMeClicked(doc.id);};
        favourites.push(userData);
      }
    });
  }).catch(function(error) {
    console.log("Error getting documents: ", error);
  });
}

function logMovies(){
  marvelmoviesRef.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      console.log(doc.id, " => ", doc.data().name + " -- " + doc.data().fav);
    });
  }).catch(function(error) {
    console.log("Error getting documents: ", error);
  });
}


function deleteElementFromDatabase(ID){
  marvelmoviesRef.doc(ID).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

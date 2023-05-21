const name_input = document.getElementById("name-input");
const name_button = document.getElementById("name-button");
const connect_button = document.getElementById("connect-button");
const disconnect_button = document.getElementById("disconnect-button");
const add_button = document.getElementById("add-button");
const subtract_button = document.getElementById("subtract-button");
const listing = document.getElementById("listing-data")

let userID;
let userRef;
let users;

function display_entry(name, coins){
    const row =  document.createElement("tr")
    const cell_1 = document.createElement("td")
    const cellText_1 = document.createTextNode(name)
    const cell_2 = document.createElement("td")
    const cellText_2 = document.createTextNode(coins)
    cell_1.appendChild(cellText_1);
    cell_2.appendChild(cellText_2);
    row.appendChild(cell_1);
    row.appendChild(cell_2);
    listing.appendChild(row);
}

function clear_display(){
    function re(element){
        element.remove();
    }
    // console.log(listing.getElementsByTagName("tr"));
    Array.prototype.slice.call(listing.getElementsByTagName("tr")).forEach(re);
}

function display_from_database(snapshot){

    clear_display();
    users = snapshot.val()
    Object.keys(users).forEach(
        function(item){
            if(users[item].id == userID){
                display_entry("> " + users[item].name + " <",users[item].coins);
            } else {
                display_entry(users[item].name,users[item].coins);
            }
        }
    )
}

function increment_curr_user(){
    if (!userRef){
        console.log("Not connected to server");
        return;
    }
    const newcoins = users[userID].coins + 1;
    userRef.update({
        coins : newcoins
    })
}

function decrement_curr_user(){
    if (!userRef){
        console.log("Not connected to server");
        return;
    }
    const newcoins = users[userID].coins - 1;
    userRef.update({
        coins : newcoins
    })
}

function rename_curr_user(){
    if (!userRef){
        console.log("Not connected to server");
        return;
    }
    userRef.update({
        name : name_input.value || 'user' + Math.floor(Math.random() * 1000),
    })

}

function login_user(user){
    userID = user.uid;
    userRef=firebase.database().ref(`users/${user.uid}`);
    const name = name_input.value || 'user' + Math.floor(Math.random() * 1000);
    const coins = 0;

    userRef.set({
        id: user.uid,
        name,
        coins,
    })

    userRef.onDisconnect().remove();
}

function logout_user(){
    if (!userRef){
        console.log("Not connected to server");
        return;
    }
    userRef.remove();
    userRef = null;
};


function on_auth_state_changed(user){
    console.log("Logging in as",user.uid);
    if (!user) return;
    console.log("Success!");
    login_user(user);

}

function connect_to_server(){
    firebase.auth().signInAnonymously().catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode, errorMessage);
      });
    firebase.auth().onAuthStateChanged(on_auth_state_changed);
}



display_entry("Hello",12);
display_entry("Hello2",24);
clear_display();

const usersRef = firebase.database().ref(`users`);
usersRef.on("value", display_from_database);
connect_button.onclick = connect_to_server;
disconnect_button.onclick = logout_user;
name_button.onclick = rename_curr_user;
add_button.onclick = increment_curr_user;
subtract_button.onclick = decrement_curr_user;

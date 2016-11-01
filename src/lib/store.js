'use strict';
import Firebase from 'firebase';
import _ from 'lodash';

class Store{
    constructor (config) {
        Firebase.initializeApp({
            serviceAccount: config.apijson,
            databaseURL: config.database
        });

        this.db = Firebase.database();
        this.ref = this.db.ref("/");
        this.ref.once("value", function(snapshot) {
            console.log(snapshot.val());
        });
    }
    
    getRandomLunchVenue(){

    }
}

export default Store;
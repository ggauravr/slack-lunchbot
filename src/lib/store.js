'use strict';
import Firebase from 'firebase';
import _ from 'lodash';

class Store{
    constructor (config) {
        let _self = this;
        Firebase.initializeApp({
            serviceAccount: config.apijson,
            databaseURL: config.database
        });
        this.db = Firebase.database();
        this.ref = this.db.ref('/');
        this.ref.on('value', function(snapshot) {
            _self.lunchList = snapshot.val();
        });
    }

    getList(restriction){
        //TODO: filter
        return this.lunchList;
    }
    getRandomLunchVenue(restriction){
        console.log('Meal called',restriction);
        console.log(this.lunchList);
    }
}

export default Store;
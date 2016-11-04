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
            _self.foodList = snapshot.val();
        });
    }

    getVenueList(restriction){
        let items;
        if (restriction !== 'all'){
            items = _.filter(this.foodList, (o)=> {return o.availability[restriction.toLowerCase()]});
        } else{
            items = this.foodList;
        }
        return _.sortBy(items, ['title']);
    }
    getRandomLunchVenue(restriction){
        let items = this.getVenueList(restriction);
        let filtered = _.shuffle(items);
        return _.first(_.values(filtered));
    }
}

export default Store;
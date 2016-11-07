'use strict';
import Firebase from 'firebase';
import _ from 'lodash';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config({ silent: process.env.NODE_ENV === 'production' });

class Store{
    constructor () {
        let _self = this;
        Firebase.initializeApp({
            serviceAccount: {
                'type': process.env.FB_TYPE,
                'project_id': process.env.FB_PROJECTID,
                'private_key_id': process.env.FB_PRIVATEKEY_ID,
                'private_key': process.env.FB_PRIVATEKEY.replace(/\\n/g, '\n'),
                'client_email': process.env.FB_CLIENT_EMAIL,
                'client_id': process.env.FB_CLIENT_ID,
                'auth_uri': process.env.FB_AUTH_URI,
                'token_uri': process.env.FB_TOKEN_URI,
                'auth_provider_x509_cert_url': process.env.FB_AUTH_PROVIDER,
                'client_x509_cert_url': process.env.FB_CLIENT_CERT
             },
            databaseURL: process.env.FIREBASE_DB
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
'use strict';
import config from '../config';
import LocalTunnel from 'localtunnel';

let localtunnel = LocalTunnel(config.localtunnel.port, {subdomain: config.localtunnel.subdomain},function(err, tunnel) {
    console.log('Local Tunnel is running ', localtunnel.url, ' using port ', config.localtunnel.port);
});

export default localtunnel;


import config from './config';
import Bot from './lib/bot';
//import setSchedule from './lib/schedule';
import Store from './lib/store';

//let store = new Store(config.firebase);
let bot = new Bot(config);
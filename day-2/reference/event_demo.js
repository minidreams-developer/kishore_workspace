const EventEmitter = require('events');


// create class

class MyEmitter extends EventEmitter {}

//init object
const myEmitter = new MyEmitter();

//Event Listner

myEmitter.on('event',() => {
    console.log('Event fired...');
})

//init event

myEmitter.emit('event');
myEmitter.emit('event');
myEmitter.emit('event');
myEmitter.emit('event');
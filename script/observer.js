

class Observer {
	constructor() {
	  this.subscribers = [];
	}
	subscribe(callback) {
	  this.subscribers.push(callback);
	}
	unsubscribe(callback) {
	  this.subscribers = this.subscribers.filter((el) => el !== callback);
	}
	broadcast(data) {
	  this.subscribers.forEach((callback) => {
		callback(data);
	  });
	}
  }
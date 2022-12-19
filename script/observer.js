class Observer {
	constructor() {
	  this.subscribers = [];
	}
	subscribe(callback) {
	  this.subscribers.push(callback);
	}
	unsubscribe(callback) {
	  //
	}
	broadcast(data) {
	  this.subscribers.forEach((callback) => {
		callback(data);
	  });
	}
  }
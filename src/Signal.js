export class Signal {
	#listeners;

	constructor() {
	  this.listeners = [];
	}

	on(listener) {
		const index = this.listeners.indexOf(listener);

		if (index === -1) {
			this.listeners.push(listener);
		}
	}

	once(listener) {
	  const onceWrapper = (...args) => {
		listener(...args);

		this.off(onceWrapper);
	  };

	  this.on(onceWrapper);
	}

	off(listener) {
	  const index = this.listeners.indexOf(listener);

	  if (index !== -1) {
		this.listeners.splice(index, 1);
	  }
	}

	// Emit the signal with the specified data
	emit(...args) {
	  const listeners = this.listeners.slice();

	  for (const listener of listeners) {
		listener(...args);
	  }
	}
  }

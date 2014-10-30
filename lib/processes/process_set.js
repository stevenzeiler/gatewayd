
function ProcessSet() {
  this.processes = {};
  this.processes['server'] = 1;
  this.processes['incoming'] = 1;
  this.processes['outgoing'] = 1;
}

ProcessSet.prototype = {
  constructor: ProcessSet,

  add: function(name) {
    this.processes[name] = 1;
    return this.processes;
  },

  remove: function(name) {
    delete this.processes[name];
    return this.processes;
  },

  toString: function() {
    return this.processes.toString()
  },

  toArray: function() {
    var array = [];
    for (path in this.processes) {
      array.push(path);
    } 
    return array;
  }
}

module.exports = ProcessSet;


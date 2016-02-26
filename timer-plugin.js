/*!
  Javascript Timer Plugin

*/
(function() {

  // Define our constructor
  this.Timer = function() {

    // Timer Class References
    this.timer = null;
    this.secondsInterval = null;
    this.timeObject = null;
    this.timerOn = false;

    // Document References
    this.timerContent = null;
    this.startButton = null;
    this.stopButton = null;
    this.pauseButton = null;

    // Define option defaults
    var defaults = {
      // Timer Options
      countUpStart: 0,
      countDownStart: 60,
      countDown: false,
      showZeros: true,

      // HTML IDs and classes
      timerId: "timer",
      timerClass: "timer",
      startButtonId: "start",
      stopButtonId: "stop",
      pauseButtonId: "pause"
    }

    // Default Overrides
    this.options = extendDefaults(defaults, arguments[0]);

    // Set Seconds Counter
    this.secondsCounter = (this.options.countDown) ?
      this.options.countDownStart : this.options.countUpStart;

    // build init HTML
    initTimerHTML.call(this);

    // init time object and update html
    this.timeObject = secondsToHHMMSS(this.secondsCounter);
    updateTimerHTML.call(this);

    // initializeEvents
    initializeEvents.call(this);
  }

  /**********************************************
   Public Methods
   */

  Timer.prototype.start = function() {
    if (this.timerOn)
      return;

    this.timerOn = true;
    this.tick();
  }

  Timer.prototype.stop = function() {
    this.timerOn = false;
    // Reset Counter and interval
    this.secondsCounter = (this.options.countDown) ?
      this.options.countDownStart : this.options.countUpStart;
    clearInterval(this.secondsInterval);
    this.secondsInterval = null;
  }

  Timer.prototype.pause = function() {
    this.timerOn = false;
    clearInterval(this.secondsInterval);
  }

  Timer.prototype.tick = function() {
    // Update time object and Total Seconds Counter
    this.timeObject = secondsToHHMMSS(this.secondsCounter);
    this.secondsCounter += (this.options.countDown) ? -1 : 1;

    // Update HTML Elements
    updateTimerHTML.call(this);

    // Call tick
    this.secondsInterval = setTimeout(this.tick.bind(this), 1000);
  }



  /**********************************************
   Private Methods
   */

  // Return Object
  function secondsToHHMMSS(totalSec) {
    return {
      days: parseInt(totalSec / 86400) % 86400,
      hours: parseInt(totalSec / 3600) % 24,
      minutes: parseInt(totalSec / 60) % 60,
      seconds: totalSec % 60
    };
  }

  // Initialize CLick Events
  function initializeEvents() {
    if (this.startButton) {
      this.startButton.addEventListener('click', this.start.bind(this));
    }
    if (this.stopButton) {
      this.stopButton.addEventListener('click', this.stop.bind(this));
    }
    if (this.pauseButton) {
      this.pauseButton.addEventListener('click', this.pause.bind(this));
    }
  }

  // Default Options Utitlity Function
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  // Update Timer HTML
  function updateTimerHTML() {
      var hours, minutes, seconds;
      var timerContent = document.getElementById(this.options.timerId);

      hours = timerContent.getElementsByTagName('span')[0];
      minutes = timerContent.getElementsByTagName('span')[1];
      seconds = timerContent.getElementsByTagName('span')[2];

      hours.innerHTML = (this.options.showZeros || this.timeObject.hours > 0) ?
        this.timeObject.hours: "";
      minutes.innerHTML = (this.options.showZeros || this.timeObject.minutes > 0) ?
        this.timeObject.minutes: "";
      seconds.innerHTML = (this.options.showZeros || this.timeObject.seconds > 0) ?
        this.timeObject.seconds: "";

  }

  function initTimerHTML() {
    var hours, minutes, seconds;
    var timerContent = document.getElementById(this.options.timerId);
    timerContent.setAttribute('class',this.options.timerClass);

    // Build buttons and References for event handler
    this.startButton = document.getElementById(this.options.startButtonId);
    this.stopButton = document.getElementById(this.options.stopButtonId);
    this.pauseButton = document.getElementById(this.options.pauseButtonId);

    hours = document.createElement("span");
    minutes = document.createElement("span");
    seconds = document.createElement("span");

    // init to zero
    if (this.options.showZeros)
      hours.innerHTML = minutes.innerHTML = seconds.innerHTML = "0";

    // Apend to Timer
    timerContent.appendChild(hours);
    timerContent.appendChild(minutes);
    timerContent.appendChild(seconds);
  }

}());

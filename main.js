var Segment, segment, start, stop;

Segment = (function() {
  var $minutes, $seconds, $tminutes, $tseconds, classMap, countdown, refreshSegment, self, stepCountdown, timeout;

  classMap = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", ""];

  $tminutes = null;

  $minutes = null;

  $tseconds = null;

  $seconds = null;

  countdown = null;

  timeout = null;

  self = null;

  function Segment() {
    $tminutes = $("#tens-minutes");
    $minutes = $("#minutes");
    $tseconds = $("#tens-seconds");
    $seconds = $("#seconds");
    self = this;
    this.paused = false;
  }

  refreshSegment = function($segment, number) {
    $segment.removeClass();
    return $segment.addClass(classMap[number]);
  };

  Segment.prototype.setDisplay = function(minutes, seconds) {
    var mins, secs, tensMins, tensSecs;
    mins = minutes % 10;
    tensMins = (minutes - mins) / 10;
    secs = seconds % 10;
    tensSecs = (seconds - secs) / 10;
    refreshSegment($tminutes, tensMins);
    refreshSegment($minutes, mins);
    refreshSegment($tseconds, tensSecs);
    return refreshSegment($seconds, secs);
  };

  Segment.prototype.clearDisplay = function() {
    refreshSegment($tminutes, 10);
    refreshSegment($minutes, 10);
    refreshSegment($tseconds, 10);
    return refreshSegment($seconds, 10);
  };

  stepCountdown = function() {
    var minutes, seconds;
    if (countdown < 0) {
      clearInterval(timeout);
      return;
    }
    minutes = Math.floor(countdown / 60);
    seconds = countdown - minutes * 60;
    self.setDisplay(minutes, seconds);
    return countdown--;
  };

  Segment.prototype.startCountdown = function(seconds) {
    clearInterval(timeout);
    if (seconds > 3600) {
      return;
    }
    countdown = seconds;
    stepCountdown();
    timeout = window.setInterval(stepCountdown, 1000);
  };

  Segment.prototype.clearCountdown = function() {
    return clearInterval(timeout);
  };

  Segment.prototype.pauseContinue = function() {
    if (!this.paused) {
      this.paused = true;
      return this.clearCountdown();
    } else {
      this.paused = false;
      return timeout = window.setInterval(stepCountdown, 1000);
    }
  };

  return Segment;

})();

segment = new Segment;

start = function() {
  return segment.startCountdown(900);
};

stop = function() {
  segment.clearDisplay();
  return segment.clearCountdown();
};

$(document).keypress(function(e) {
  switch (e.which) {
    case 114:
      return start();
    case 99:
      return stop();
    case 32:
      return segment.pauseContinue();
  }
});

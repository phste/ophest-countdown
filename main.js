var Segment, blind, doBlind, segment, start, stop;

Segment = (function() {
  var $colon, $minutes, $seconds, $tminutes, $tseconds, blinkColon, classMap, countdown, interval, refreshSegment, self, stepCountdown, timeout;

  classMap = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", ""];

  $tminutes = null;

  $minutes = null;

  $tseconds = null;

  $seconds = null;

  $colon = null;

  countdown = null;

  interval = null;

  timeout = null;

  self = null;

  function Segment() {
    $tminutes = $("#tens-minutes");
    $minutes = $("#minutes");
    $tseconds = $("#tens-seconds");
    $seconds = $("#seconds");
    $colon = $(".colon > .colon");
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
    refreshSegment($seconds, 10);
    return $colon.removeClass("active");
  };

  blinkColon = function() {
    $colon.removeClass("active");
    return timeout = setTimeout((function() {
      return $colon.addClass("active");
    }), 500);
  };

  stepCountdown = function() {
    var minutes, seconds;
    if (countdown < 0) {
      clearInterval(interval);
      return;
    }
    minutes = Math.floor(countdown / 60);
    seconds = countdown - minutes * 60;
    self.setDisplay(minutes, seconds);
    blinkColon();
    return countdown--;
  };

  Segment.prototype.startCountdown = function(seconds) {
    clearInterval(timeout);
    if (seconds > 3600) {
      return;
    }
    countdown = seconds;
    stepCountdown();
    interval = window.setInterval(stepCountdown, 1000);
  };

  Segment.prototype.clearCountdown = function() {
    clearInterval(interval);
    clearTimeout(timeout);
    return this.clearDisplay();
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

doBlind = true;

blind = function() {
  $("#blind").fadeIn(100);
  return $('#blind').fadeOut(100);
};

start = function() {
  if (doBlind) {
    blind();
  }
  return segment.startCountdown(900);
};

stop = function() {
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
    case 100:
      return doBlind = !doBlind;
  }
});

class Segment

  classMap = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", ""]

  $tminutes = null
  $minutes = null
  $tseconds = null
  $seconds = null
  $colon = null
  countdown = null
  interval = null
  timeout = null
  self = null

  constructor: () ->
    $tminutes = $("#tens-minutes")
    $minutes = $("#minutes")
    $tseconds = $("#tens-seconds")
    $seconds = $("#seconds")
    $colon = $(".colon > .colon")
    self = @
    @paused = false

  refreshSegment = ($segment, number) ->
    $segment.removeClass()
    $segment.addClass(classMap[number])

  setDisplay: (minutes, seconds) ->
    mins = minutes % 10
    tensMins = (minutes - mins) / 10
    secs = seconds % 10
    tensSecs = (seconds - secs) / 10
    refreshSegment($tminutes, tensMins)
    refreshSegment($minutes, mins)
    refreshSegment($tseconds, tensSecs)
    refreshSegment($seconds, secs)

  clearDisplay: () ->
    refreshSegment($tminutes, 10)
    refreshSegment($minutes, 10)
    refreshSegment($tseconds, 10)
    refreshSegment($seconds, 10)
    $colon.removeClass("active")

  blinkColon = () ->
    $colon.removeClass("active")
    timeout = setTimeout((() ->
      $colon.addClass("active")), 500)

  stepCountdown = () ->
    if countdown < 0
      clearInterval(interval)
      return

    minutes = Math.floor(countdown / 60)
    seconds = countdown - minutes*60
    self.setDisplay(minutes, seconds)
    blinkColon()
    countdown--

  startCountdown: (seconds) ->
    clearInterval(timeout)
    if seconds > 3600
      return

    countdown = seconds
    stepCountdown()
    interval = window.setInterval(stepCountdown, 1000)
    return

  clearCountdown: () ->
    clearInterval(interval)
    clearTimeout(timeout)
    @clearDisplay()

  pauseContinue: () ->
    if !@paused
      @paused = true
      @clearCountdown()
    else
      @paused = false;
      timeout = window.setInterval(stepCountdown, 1000)

segment = new Segment

doBlind = true

blind = () ->
  $("#blind").fadeIn(100);
  $('#blind').fadeOut(100);

start = () ->
  if (doBlind)
     blind()

  segment.startCountdown(900)

stop = () ->
  segment.clearCountdown()

$(document).keypress((e) ->
  switch e.which
    when 114 then start()
    when 99 then stop()
    when 32 then segment.pauseContinue()
    when 100 then doBlind = !doBlind
)

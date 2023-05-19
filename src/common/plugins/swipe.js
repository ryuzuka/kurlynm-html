/** swipe.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'swipe'

  $.extend({
    bodySwipe: function (options = {}, value) {
      let $documentBody= $(document).find('body')

      if (typeof options === 'string') {
        $.plugin.call($documentBody, options, value)
      } else {
        options.direction = options.direction || 'vertical'
        $documentBody.swipe(options)
      }
      return this
    }
  })

  $.fn.extend({
    swipe: function (options = {}, value) {
      if (typeof options === 'string') {
        $.plugin.call(this, options, value)
      } else {
        this.each((_index, _el) => {
          if (!$(_el).attr('applied-plugin')) {
            options.direction = options.direction || 'horizontal'
            $.plugin.add($(_el), pluginName, new Swipe($(_el), options))
          }
        })
      }
      return this
    }
  })

  class Swipe {
    constructor ($this, options) {
      this.target = $this.get(0)
      this.direction = options.direction // horizontal, vertical
      this.callback = {
        down: options.down,
        move: options.move,
        up: options.up
      }

      this.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion)
      this.hasTouch = 'ontouchstart' in window && !this.isTouchPad

      this.DOWN_EV = this.hasTouch ? 'touchstart' : 'mousedown'
      this.MOVE_EV = this.hasTouch ? 'touchmove' : 'mousemove'
      this.UP_EV = this.hasTouch ? 'touchend' : 'mouseup'

      this.init()
    }

    init () {
      this.DOWNX = 0
      this.DOWNY = 0
      this.dragDist = 0
      this.dragDir = -1

      this.eventHandler = {
        down: this.eventHandlers().down,
        move: this.eventHandlers().move,
        up: this.eventHandlers().up
      }

      this.on()
    }

    eventHandlers () {
      return {
        down: e => {
          this.target.addEventListener(this.MOVE_EV, this.eventHandler.move)
          this.target.addEventListener(this.UP_EV, this.eventHandler.up)

          this.dragDist = 0
          let point = this.hasTouch ? e.touches[0] : e

          if (this.direction === 'horizontal') {
            this.DOWNX = point.clientX
            this.DOWNY = point.clientY
          } else if (this.direction === 'vertical') {
            this.DOWNX = point.clientY
            this.DOWNY = point.clientX
          }

          if (this.callback.down) {
            this.callback.down()
          }
        },
        move: e => {
          let point = this.hasTouch ? e.touches[0] : e

          if (this.direction === 'horizontal') {
            if (Math.abs(point.clientY - this.DOWNY) < Math.abs(point.clientX - this.DOWNX)) {
              this.dragDist = point.clientX - this.DOWNX
            }
          } else if (this.direction === 'vertical') {
            if (Math.abs(point.clientX - this.DOWNY) < Math.abs(point.clientY - this.DOWNX)) {
              this.dragDist = point.clientY - this.DOWNX
            }
          }

          if (this.callback.move) {
            this.callback.move()
          }
        },
        up: e => {
          this.target.removeEventListener(this.MOVE_EV, this.eventHandler.move)
          this.target.removeEventListener(this.UP_EV, this.eventHandler.up)

          if (Math.abs(this.dragDist) < 80) return false

          if (this.dragDist < 0) {
            this.dragDir = 1
          } else {
            this.dragDir = -1
          }

          if (this.callback.up) {
            this.callback.up(this.dragDir, this.dragDist)
          }
        }
      }
    }

    on () {
      this.target.addEventListener(this.DOWN_EV, this.eventHandler.down)
    }

    off () {
      this.target.removeEventListener(this.DOWN_EV, this.eventHandler.down)
      this.target.removeEventListener(this.MOVE_EV, this.eventHandler.move)
      this.target.removeEventListener(this.UP_EV, this.eventHandler.up)
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */

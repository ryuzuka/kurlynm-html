/** countdown.js ********************************************************************************************************** */
;(($, $moment) => {
  let pluginName = 'countdown'

  $.fn.extend({
    countdown: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Countdown($(el), options))
          }
        }
      })
      return this
    }
  })

  class Countdown {
    constructor ($this, options) {
      this.$countdown = $this

      this.options = options
      this.options.format = options.format || 'mm:ss'
      this.options.start = options.start || 60

      this.inteval = null
      this.time = null

      this.init()
    }

    init () {
      let minute = this.formatNumber(parseInt(this.options.start / 60, 10))
      let seconds = this.formatNumber(parseInt(this.options.start % 60, 10))
      this.time = $moment(minute + ':' + seconds, 'mm:ss')
      this.seconds = this.options.start || 0

      this.$countdown.find('.time').text(this.time.format(this.options.format))
    }

    formatNumber (num) {
      num = String(num).length < 2 ? '0' + num : num
      return num
    }

    start () {
      if (this.interval) {
        return
      }
      this.interval = setInterval(() => {
        this.seconds--
        this.$countdown.find('.time').text(this.time.subtract(1, 'second').format(this.options.format))
        if (this.seconds === 0) {
          this.stop()
          this.$countdown.triggerHandler({type: 'complete'})
        }
      }, 1000)
    }

    stop () {
      if (!this.interval) {
        return
      }
      clearInterval(this.interval)
      this.interval = null
    }

    clear () {
      this.stop()
      this.time = null
      this.$countdown.find('.time').text($moment(0, this.options.format).format(this.options.format))
    }
  }
})(window.jQuery, window.moment)
/** ***************************************************************************************************************** */

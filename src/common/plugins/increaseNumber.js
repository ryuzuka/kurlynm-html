/** increaseNumber.js ********************************************************************************************************** */
;($ => {
  $.extend({
    increaseNumber ($target, options = {}) {
      /**
       * @params	{Object}
       * 				  start: Number
       * 				  end: Number
       * 				  duration: Number
       * @event		transition-end
       *
       */

      $({num: Number(options.start) }).animate({num: Number(options.end)}, {
        step () {
          let num = numberWithCommas(Math.floor(this.num))
          writeNumber($target, num)
        },
        duration: options.duration || 800,
        complete () {
          let num = numberWithCommas(Math.floor(this.num))
          writeNumber($target, num)
          $target.triggerHandler({type: 'complete'})
        },
        easing: 'easeOutCubic'
      })

      function writeNumber ($target, num) {
        if ($target[0].tagName === 'INPUT') {
          $target.val(num)
        } else {
          $target.text(num)
        }
      }

      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      return $target
    }
  })
})(window.jQuery)
/** ****************************************************************************************************************** */

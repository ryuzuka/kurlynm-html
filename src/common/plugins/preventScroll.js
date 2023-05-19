/** preventScroll.js ****************************************************************************************************** */
;($ => {
  let _plugin = null
  $.extend({
    preventScroll: function (isPrevent) {
      _plugin = _plugin || new PreventScroll()
      _plugin[isPrevent ? 'add' : 'remove']()

      return _plugin
    }
  })

  class PreventScroll {
    constructor () {
      if ($.utils.isMobile()) {
        this.scrollEvent = 'touchmove'
      } else {
        this.scrollEvent = 'wheel'
      }
    }

    preventScrollEventHandler (e) {
      e.preventDefault()
      return false
    }

    add () {
      window.addEventListener('touchmove', this.preventScrollEventHandler, {passive: false})
      window.addEventListener('wheel', this.preventScrollEventHandler, {passive: false})
      $('body').addClass('prevent-scroll')
    }

    remove () {
      window.removeEventListener('touchmove', this.preventScrollEventHandler)
      window.removeEventListener('wheel', this.preventScrollEventHandler)
      $('body').removeClass('prevent-scroll')
    }
  }
})(window.jQuery)
/** ***************************************************************************************************************** */

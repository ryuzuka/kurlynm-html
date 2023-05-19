/** tab.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'tab'

  $.fn.extend({
    tab: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Tab($(el), options))
          }
        }
      })
      return this
    }
  })

  class Tab {
    constructor ($this, options) {
      this.$tab = $this
      this.$list = this.$tab.find('> .tab-list')
      this.$button = this.$list.find('a, button')
      this.$content = this.$tab.find('> .tab-content')

      this.options = options
      this.activeIndex = (this.options.activeIndex >= 0) ? this.options.activeIndex : 0

      this.init()
    }

    init () {
      this.$button.on('click', e => {
        let idx = $(e.target).index()
        if (idx === this.activeIndex) return
        this.active(idx)
        e.preventDefault()
      })

      if (typeof this.activeIndex === 'number') {
        this.active(this.activeIndex)
      }
    }

    active (idx) {
      let $content = this.$content.find('> .content')
      this.activeIndex = idx

      this.$button.removeClass('active').attr('aria-selected', false)
      this.$button.eq(idx).addClass('active').attr('aria-selected', true)
      $content.prop('hidden', true).removeClass('active')
      $content.eq(idx).prop('hidden', false).addClass('active')

      this.$tab.triggerHandler({type: 'change', activeIndex: this.activeIndex})
    }

    clear () {
      this.$button.removeClass('active').attr('aria-selected', false).off('click')
      this.$content.find('> .content').removeClass('active').prop('hidden', true)
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */

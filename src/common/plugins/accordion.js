/** accordion.js ********************************************************************************************************** */
;($ => {
  let pluginName = 'accordion'

  $.fn.extend({
    accordion: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            $.plugin.add($(el), pluginName, new Accordion($(el), options))
          }
        }
      })
      return this
    }
  })

  class Accordion {
    constructor ($this, options) {
      this.$accordion = $this
      this.$btn = this.$accordion.find('.accordion-head > button')
      this.$content = this.$accordion.find('.accordion-content')

      this.options = options
      this.options.type = options.type || 'single'
      this.activeIndex = (this.options.activeIndex >= 0) ? this.options.activeIndex : -1

      this.init()
    }

    init () {
      let _this = this
      this.$btn.each((index, el) => {
        $(el).attr('btn-index', index)
      })

      if (typeof this.activeIndex === 'number') {
        this.active(this.activeIndex)
      }

      this.$btn.on('click', e => {
        let idx = Number($(e.currentTarget).attr('btn-index'))
        this.activeIndex = idx
        if (this.options.type === 'single') {
          this.$content.each((index, el) => {
            let $btn = _this.$btn.eq(index)
            let $content = _this.$content.eq(index)

            if (idx === index) {
              if (!$btn.hasClass('active')) {
                $btn.addClass('active').attr('aria-expanded', true)
                $content.addClass('active').prop('hidden', false)
              } else {
                $btn.removeClass('active').attr('aria-expanded', false)
                $content.removeClass('active').prop('hidden', true)
              }
            } else {
              $btn.removeClass('active').attr('aria-expanded', false)
              $content.removeClass('active').prop('hidden', true)
            }
          })
        } else if (this.options.type === 'multi') {
          let $btn = _this.$btn.eq(idx)
          let $content = _this.$content.eq(idx)

          if (!_this.$btn.eq(idx).hasClass('active')) {
            $btn.addClass('active').attr('aria-expanded', true)
            $content.addClass('active').prop('hidden', false)
          } else {
            $btn.removeClass('active').attr('aria-expanded', false)
            $content.removeClass('active').prop('hidden', true)
          }
        }
        this.$accordion.triggerHandler({type: 'open', activeIndex: this.activeIndex})
      })
    }

    active (idx) {
      this.activeIndex = idx
      this.$content.each(index => {
        if (idx === index) {
          this.$btn.eq(index).addClass('active').attr('aria-expanded', true)
          this.$content.eq(index).addClass('active').prop('hidden', false)
        } else {
          this.$btn.eq(index).removeClass('active').attr('aria-expanded', false)
          this.$content.eq(index).removeClass('active').prop('hidden', true)
        }
      })
    }

    clear () {
      this.$btn.attr('aria-expanded', false).removeClass('active').off('click')
      this.$content.prop('hidden', true).removeClass('active')
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */

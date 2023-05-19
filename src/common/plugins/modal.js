/** modal.js ******************************************************************************************************** */
;($ => {
  let _modalPlugin = {}

  $.fn.extend({
    modal: function (options = {}, callback) {
      const id = this.attr('id')
      if (typeof options === 'string') {
        _modalPlugin[id][options](callback)
      } else {
        _modalPlugin[id] = new Modal(this, options, callback)
      }
      return this
    }
  })

  class Modal {
    constructor ($this, options, callback) {
      this.$modal = $this
      this.id = $this.attr('id')
      this.callback = callback || function () {}
      this.prevScroll = 0

      const defaultOptions = {
        classes: '',
        dimmed: true,
        clickToClose: false,
        preventScroll: false,
        text: '',
        buttonText: ''
      }

      if (typeof options === 'object') {
        this.options = $.extend(defaultOptions, options)
      } else if (typeof options === 'function') {
        this.options = defaultOptions
        this.callback = options
      }

      if (this.options.dimmed) {
        this.options.classes += ' dimmed'
      }

      this.init()
    }

    init () {
      this.$modal.addClass(this.options.classes)
      let $form = $('#' + this.id).find('button, input, select, textarea')
      let $firstForm = null
      $form.each((index, el) => {
        if (index === 0) {
          $firstForm = $(el)
          setTimeout(() => {
            $firstForm.focus().focus()
          }, 1)
        } else if (index === $form.length - 1) {
          $(el).on('focusout', e => {
            $firstForm.focus()
          })
        }
      })

      // text
      if (this.options.text) {
        this.$modal.find('.layer-content').html(this.options.text)
      }

      // button
      if (this.options.buttonText) {
        this.$modal.find('button.btn').html(this.options.buttonText)
      }
      this.$modal.find('.button-wrap button').on('click', e => {
        this.close({buttonIndex: $(e.target).index()})
      })

      // dimmed close
      this.$modal.on('click', e => {
        let $target = $(e.target)
        if ($target.attr('id') === this.$modal.attr('id') && $target.hasClass('layer')) {
          if (!this.options.clickToClose) return
          this.close()
        }
      })

      // close
      this.$modal.on('keydown', e => {
        if (e.keyCode === 27) {
          this.close()
        }
      })
      this.$modal.find('.close').on('click', e => {
        this.close()
      })

      // open
      this.open()
    }

    open () {
      this.$modal.show()
      this.callback({type: 'open', $modal: this.$modal})

      if (this.options.preventScroll) {
        $.preventScroll(true)
      } else {
        $[$.utils.isMobile() ? 'preventScroll' : 'blockBodyScroll'](true)
      }
    }

    close (buttonIndex) {
      this.callback($.extend({type: 'before-close', $modal: this.$modal}, buttonIndex))
      this.$modal.find('button, input, select, textarea').off()
      this.$modal.removeClass(this.options.classes).off().hide()

      if (this.options.preventScroll) {
        $.preventScroll(false)
      } else {
        $[$.utils.isMobile() ? 'preventScroll' : 'blockBodyScroll'](false)
      }
      setTimeout(() => {
        this.callback({type: 'close', $modal: this.$modal})
        $(this.options.closedFocus).focus()
      }, 1)
    }
  }
})(window.jQuery)
/** ***************************************************************************************************************** */

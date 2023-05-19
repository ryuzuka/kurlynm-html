/** input.js ********************************************************************************************************** */
;($ => {
  $.fn.extend({
    input: function (options = {}, value) {
      this.each((index, el) => {
        if (typeof options === 'string') {
          $.plugin.call($(el), options, value)
        } else {
          if (!$(el).attr('applied-plugin')) {
            let pluginName = 'input-' + options.type
            if (options.type === 'checkbox') {
              $.plugin.add($(el), pluginName, new Checkbox($(el), options))
            } else if (options.type === 'radio') {
              $.plugin.add($(el), pluginName, new Radio($(el), options))
            } else if (options.type === 'text') {
              $.plugin.add($(el), pluginName, new Text($(el), options))
            }
          }
        }
      })
      return this
    }
  })

  /** Checkbox */
  class Checkbox {
    constructor ($this, options) {
      this.$inputGroup = $this
      this.$checkbox = $this.find('.chk-box')
      this.isCheck = []

      this.$checkbox.each((index, el) => {
        this.isCheck.push($(el).find('input').prop('checked'))
      })

      this.$checkbox.find('input:checkbox').on('change', e => {
        let $input = $(e.target)
        let index = $input.parent('.chk-box').index()
        let value = $input.val()
        let checked = $input.prop('checked')

        $input.prop('checked', checked).attr('checked', checked)
        this.isCheck[index] = checked
        this.$inputGroup.triggerHandler({type: 'change-input', index, value, checked, isCheck: this.isCheck})
      })
    }

    checked (index) {
      if (index < 0) {
        this.$checkbox.find('input:checkbox').each((index, el) => {
          this.isCheck[index] = false
          $(el).prop('checked', false).attr('checked', false)
        })
        this.$inputGroup.triggerHandler({type: 'change-input', index, value: '', checked: false, isCheck: this.isCheck})
      } else {
        let $input = this.$checkbox.eq(index).find('input:checkbox')
        let checked = !$input.prop('checked')
        $input.prop('checked', checked).trigger('change')
      }
    }
  }

  /** Radio */
  class Radio {
    constructor ($this, options) {
      this.$inputGroup = $this
      this.$radio = $this.find('.rdo-box')

      this.$radio.find('input:radio').on('change', e => {
        let $input = $(e.target)
        let index = $input.parent('.rdo-box').index()

        this.$radio.each((idx, el) => {
          let $input = $(el).find('input')
          let value = $input.val()
          let isCheck = index === idx ? true : false
          if (isCheck) this.$inputGroup.triggerHandler({type: 'change-input', index, value})
          $input.prop('checked', isCheck).attr('checked', isCheck)
        })
      })
    }

    checked (index) {
      if (index < 0) {
        this.$radio.find('input:radio').prop('checked', false).attr('checked', false)
        this.$inputGroup.triggerHandler({type: 'change-input', index, value: ''})
      } else {
        this.$radio.eq(index).find('input:radio').trigger('change')
      }
    }
  }

  /** Text */
  class Text {
    constructor ($this, options) {
      this.$this = $this
      this.$input = $this.find('input')
      this.$clear = this.$input.siblings('.btn-clear')
      this.maxlength = this.$input.attr('maxlength')

      let inputEventHandler = (e) => {
        let value = e.target.value
        if (e.type === 'focus') {
          if (value) this.$clear.show()

        } else if (e.type === 'blur') {
          this.$clear.hide()
          this.$this[e.target.value ? 'addClass' : 'removeClass']('on')

        } else if (e.type === 'keydown') {
          this.$clear[e.target.value ? 'show' : 'hide']()
        }
      }

      this.$input.on('focus blur keydown', inputEventHandler)

      if (this.$clear.length > 0) {
        this.$this.addClass('del')
        this.$clear.on('mouseenter mouseleave click', e => {
          if (e.type === 'mouseenter') {
            this.$input.off('blur', inputEventHandler)

          } else if (e.type === 'mouseleave') {
            this.$input.on('blur', inputEventHandler)

          } else if (e.type === 'click') {
            this.$clear.hide()
            this.$input.val('').focus().on('blur', inputEventHandler)
          }
        })
      }

      if ($this.hasClass('number') || $this.hasClass('only-number')) {
        this.$input.on('keydown keyup', e => {
          let value = String(e.target.value).replace(/[^\d]+/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1')
          if (e.type === 'keydown') {
            if (this.maxlength <= value.length) {
              if (e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) {
              } else {
                e.preventDefault()
              }
            }
          }
          $(e.target).val(value)

        }).on('focus blur', e => {
          if ($this.hasClass('only-number')) return false
          
          let value = e.target.value
          if (e.type === 'focus') {
            value = String(value).replace(/[^\d]+/g, '')
          } else if (e.type === 'blur') {
            value = $.utils.commaNumberFormat(String(value))
          }
          $(e.target).val(value)
        })
      }
    }
  }
})(window.jQuery)
/** ****************************************************************************************************************** */

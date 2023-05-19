/** common.js ******************************************************************************************************* */
;(($, _, $moment) => {
  let Header = () => {
    let $document = $(document)
    let $header = $('header.header')
    let $loginMenu = $header.find('.login-menu')
    let isLoginMenu = -1

    let _this = {
      loginMenu: {
        show () {
          isLoginMenu = 1
          $loginMenu.show()
          setTimeout(() => $document.on('click', hideLoginMenu), 1)
        },
        hide () {
          isLoginMenu = -1
          $loginMenu.hide()
          $document.off('click', hideLoginMenu)
        }
      }
    }

    $header.on('mouseleave', e => {
      if (isLoginMenu === 1) {
        _this.loginMenu.hide()
      }
    })

    $header.find('.login.active').on('click mouseenter', e => {
      e.preventDefault()
      if (isLoginMenu === -1) {
        _this.loginMenu.show()
      } else if (isLoginMenu === 1 && e.type === 'click') {
        _this.loginMenu.hide()
      }
    })

    function hideLoginMenu (e) {
      if (e.type === 'click') {
        if ($(e.target).closest('.login-menu').length < 1) {
          _this.loginMenu.hide()
        }
      }
    }

    return _this
  }

  let Footer = () => {
    let _this = {}

    return _this
  }

  let components = (() => {
    return {
      searchForm () {
        $('.estimate-form').each(function () {
          let $searchForm = $(this)
          let $period = $searchForm.find('.input-group')
          let $calendar = $searchForm.find('.calendar')

          let _today = new Date()
          let _date = {
            from: $.utils.urlParam('start_date') || '',
            to: $.utils.urlParam('end_date') || ''
          }
          let _prevDate = {from: '', to: ''}
          let _period = 'all'

          let _this = {
            set (calendar, date) {
              _date[calendar] = $moment(date).format(window.KurlyNextmile.DATE_FORMAT)
              $searchForm.find('.' + calendar).calendar('set', _date[calendar])
            },
            all () {
              _date.from = ''
              _date.to = ''
              $calendar.find('input').val('').attr('value', '')
            },
            check (from, to) {
              from = parseInt($moment(from).format('YYYYMMDD'))
              to = parseInt($moment(to).format('YYYYMMDD'))

              return from <= to ? true: false
            },
            error (closeFunc) {
              $('#pop-invalid-date').modal({}, e => {
                if (e.type === 'close') {
                  closeFunc()
                }
              })
            },
            trigger () {
              $searchForm.triggerHandler({type: 'change-calendar', date: _date, period: _period})
            }
          }

          // 기간
          $period.on('change-input', e => {
            _period = e.value === 'all' ? 'all' : parseInt(e.value)
            if (e.value === 'all') {
              _this.all()
            } else {
              _this.set('to', _today)
              _this.set('from', $moment(_today).add(-1 * _period, 'months'))
            }
            _this.trigger()
          })

          // calendar
          $searchForm.find('.from, .to').calendar('clear').calendar().on('select', e => {
            _period = ''
            $period.find('input').prop('checked', false).attr('checked', false)

            _.extend(_prevDate, JSON.parse(JSON.stringify(_date)))
            $(e.target).hasClass('from') ? _date.from = e.date : _date.to = e.date

            if (_date.from !== '' && _date.to !== '') {
              if (_this.check(_date.from, _date.to)) {
                _this.trigger()
              } else {
                _this.error(() => {
                  _this.set('from', $moment(_prevDate.from))
                  _this.set('to', $moment(_prevDate.to))
                })
              }
            }
          })

          // reset
          $searchForm.find('.reset').on('click', e => {
            e.preventDefault()
            $period.input('checked', 0)
          })

          // init
          setTimeout(() => {
            if (_date.from && _date.to) {
              _this.set('from', _date.from)
              _this.set('to', _date.to)
            } else {
              $period.input('checked', 0)
            }
          }, 1)
        })
      },
      transportList () {
        $('.transport-list').each(function () {
          let $transport = $(this)
          let $list = $transport.find('.area')

          let _this = {
            add (idx, isDelete) {
              $list.eq(isDelete ? idx - 1 : idx).find('.btn-add').attr('disabled', !isDelete)
              $list.eq(!isDelete ? idx + 1 : idx)[!isDelete ? 'show' : 'hide']()
            }
          }

          $list.on('click', '.btn-add, .btn-add.delete', e => {
            let $btn = $(e.target)
            _this.add($btn.closest('.area').index(), $btn.hasClass('delete'))
          })
        })
      },
      selectDate () {
        $('.select-date').each(function () {
          let $selectDate = $(this)
          let $year = $selectDate.find('.year.dropdown')
          let $month = $selectDate.find('.month.dropdown')
          let $date = $selectDate.find('.date.dropdown')
          let $input = $selectDate.find('input#release_date')

          let _today = $moment(new Date())
          let _date = {}

          let _this = {
            numberFormat (num) {
              if (num) return (num.toString().length < 2 ? '0' : '') + num
            },
            year (year) {
              let html = ''
              for (let i = 0; i < 2; ++i) {
                html += `<li role="option" aria-selected="false"><button type="button" data-value="${year + i}">${year + i}년</button></li>`
              }
              $year.dropdown('clear').find('.dropdown-list').html(html)
              $year.dropdown({activeIndex: 0})
            },
            month (month, date) {
              $month.dropdown('clear').dropdown({activeIndex: month - 1})
              this.date(month, date)
            },
            date (month, date) {
              month = _this.numberFormat(month)
              date = _this.numberFormat(date)

              let selectedDate = _date.year + month + date
              let html = ''
              let days = $moment(selectedDate).daysInMonth()

              for (let i = 1; i <= days; ++i ) {
                html += `<li role="option" aria-selected="false"><button type="button" data-value="${i}">${i}일</button></li>`
              }
              $date.dropdown('clear').find('.dropdown-list').html('')
              $date.find('.dropdown-list').html(html)
              $date.dropdown({activeIndex: parseInt(date) - 1})
            },
            trigger () {
              let date = $moment(_date.year + _this.numberFormat(_date.month) + _this.numberFormat(_date.date)).format(window.KurlyNextmile.DATE_FORMAT)
              $input.val(date).attr('value', date)
              $selectDate.triggerHandler({
                type: 'change',
                date: _date,
                dateFormat: date
              })
            }
          }

          $selectDate.find('.year, .month, .date').on('change', e => {
            let dateFormat = e.target.classList[0]
            _date[dateFormat] = e.value

            if (dateFormat === 'month') {
              _this.date(e.value, 1)
            } else {
              _this.trigger()
            }
          })

          _this.year(_today.year())
          _this.month(_today.month() + 1, _today.date())
          setTimeout(_this.trigger, 1)
        })
      },
      selectMonth () {
        $('.month-group').each(function () {
          let $selectMonth = $(this)
          let $month = $selectMonth.find('.dropdown')

          let _type = $selectMonth.data('type')
          let _month = $moment(new Date()).month() + 1

          $month.each((index, el) => {
            let $dropdown = $(el)
            let month = _month + (index - 2) > 12 ? _month + (index - 2) - 12 : _month + (index - 2)

            $selectMonth.find('input#' + _type + '_month' + (index + 1)).val(month).attr('value', month)
            $dropdown.dropdown('clear').dropdown({'activeIndex': month - 1}).on('change', e => {
              let input = 'input#' + _type + '_month' + (index + 1)
              $selectMonth.find(input).val(e.value).attr('value', e.value)
            })
          })
        })
      },
      selectTime () {
        $('.select-time').each(function () {
          let $selectDate = $(this)

          let _type = $selectDate.data('type')
          let $input = $selectDate.find('input#' + _type + '_time')

          let _time = {
            hour: 0,
            minute: 0
          }

          let _this = {
            numberFormat(num) {
              return (String(num).toString().length < 2 ? '0' : '') + num + ''
            },
            trigger () {
              let time = _this.numberFormat(_time.hour) + ':' + _this.numberFormat(_time.minute)
              $input.val(time).attr('value', time)
              $selectDate.triggerHandler({
                type: 'change',
                hour: _time.hour,
                minute: _time.minute,
                time: _time,
                timeFormat: time
              })
            }
          }

          $selectDate.find('.dropdown').on('change', e => {
            _time[e.target.classList[0]] = e.value
            _this.trigger()
          })

          setTimeout(_this.trigger, 1)
        })
      }
    }
  })()

  $(function () {
    window.KurlyNextmile.Header = Header()
    window.KurlyNextmile.Footer = Footer()
    for (let component in components) {
      components[component]()
    }
  })
})(window.jQuery, window._, window.moment)
/** ***************************************************************************************************************** */

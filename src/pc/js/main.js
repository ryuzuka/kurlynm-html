/** main.js ******************************************************************************************************* */
;(($, _) => {
  window.KurlyNextmile.Main = () => {
    let documentH = document.documentElement.clientHeight

    let $main = $('.contents')
    let $countNum = $main.find('.count-num')
    let $ani = $main.find('.ani')
    let $banner = $('.slide_top')

    let isCountAni = false
    let isGraphAni = false

    let _this = {
      countAnimate () {
        $countNum.each((idx, el) => {
          $(el).removeClass('small mid big')
          let num = $(el).data('count').toString()
          let size = ''

          if (idx === 0) {
            $(el).css({
              'width': 107 + 'px',
              'margin-left': '-22px'
            })
            $(el).siblings('.kurly-text-04').css({
              'margin-left': '30px'
            })
          } else {
            if (num.length === 1) {
              size = 'xsmall'
            } else if (num.length === 2) {
              size = 'small'
            } else if (num.length === 3) {
              size = 'mid'
            } else if (num.length > 3) {
              size = 'big'
            }
          }

          $(el).addClass(size)
          $.increaseNumber($(el), {
            start: 0,
            end: Number($(el).data('count')),
            duration: 2500 + 500 * idx,
            decimal: idx === 0 ? 1 : 0
          }).on('complete', () => {})
        })
      }
    }

    let _eventHandler = {
      scroll (e) {
        $ani.each((idx, el) => {
          if (el.getBoundingClientRect) {
            let clientRect = el.getBoundingClientRect()
            if (documentH > clientRect.top + clientRect.height / 2) {
              if (idx === 0) {
                if (!isCountAni) {
                  isCountAni = true
                  _this.countAnimate()
                }
              } else if (idx === 1) {
                if (el.className.indexOf('show') < 0) {
                  el.classList.add('show')
                }
              } else if (idx === 2) {
                if (!isGraphAni) {
                  isGraphAni = true
                  lottieGraph.play()
                  $(window).off('scroll', _eventHandler.scroll)
                }
              }
            }
          }
        })
      }
    }

    // WOW
    new WOW().init()

    // lottie
    let lottieTruck = lottie.loadAnimation({
      container: document.getElementById('main-truck'),
      renderer: 'svg',
      path: '/pc/json/main_truck.json',
      loop: false,
      autoplay: true
    })

    let lottieGraph = lottie.loadAnimation({
      container: document.getElementById('main-graph'),
      renderer: 'svg',
      path: '/pc/json/main_graph.json',
      loop: false,
      autoplay: false
    })

    // scroll
    $(window).on('scroll', _eventHandler.scroll).trigger('scroll')

    //banner
    if ($banner.length > 0) {
      $banner.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        dots: false,
        arrows: false,
      })
    }

    return _this
  }
})(window.jQuery, window._)
/** ***************************************************************************************************************** */

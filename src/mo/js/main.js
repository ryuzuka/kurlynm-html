/** main.js ******************************************************************************************************* */
;($, _ => {
  window.KurlyNextmile.Main = () => {
    let documentH = document.documentElement.clientHeight

    let $main = $('.main')
    let $countNum = $main.find('.count-num')
    let $slide = $main.find('.main_slide')
    let $ani = $main.find('.ani')
    let $banner = $('.slide_top')

    let isCountAni = false

    let _this = {
      countAnimate () {
        $countNum.each((idx, el) => {
          $(el).removeClass('small mid big')
          let num = $(el).data('count').toString()
          let size = ''
          if (num.length === 1) {
            size = 'xsmall'
          } else if (num.length === 2) {
            size = 'small'
          } else if (num.length === 3) {
            size = 'mid'
          } else if (num.length > 3) {
            size = 'big'
          }
          $(el).addClass(size)
          $.increaseNumber($(el), {
            start: 0,
            end: parseInt($(el).data('count')),
            duration: 2500 + 500 * idx
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

    // scroll
    $(window).on('scroll', _eventHandler.scroll).trigger('scroll')

    // slide
    $slide.slick({
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '70px'
    })

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

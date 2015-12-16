!function (angular, $) {
    "use strict";
    var myApp = angular.module('MyApp', ['ui.router']);

    function showChildByHoveredParent(prntClass, chldClass) {
        var $prntClass = $('.' + prntClass),
            $chldClass = $prntClass.find('.' + chldClass),
            sett;

        $prntClass.hover(function () {
            clearTimeout(sett);
            $chldClass.slideDown(200);
        }, function () {
            sett = setTimeout(function () {
                $chldClass.slideUp(200);
            }, 1000);
        })
    }

    function setStarIcons(iconName) {
        $('.' + iconName +'-set').each(function (id, item) {
            item.dataset.starscount = $(item).children('.' + iconName +'__gold').length;
        }).click(function (ev) {
            var $this = $(ev.target);
            if ($this.hasClass(iconName)) {
                $this.parent().data('starscount', $this.index() + 1);
            }

            // here must be ajax
            return false;
        });

        $('.' + iconName).hover(function () {
            var $this = $(this);
            $this.addClass(iconName + '__gold')
                .prevAll()
                .addClass(iconName + '__gold');
            $this.nextAll()
                .removeClass(iconName + '__gold');
        }, function () {
            var $this = $(this),
                $this_parent = $this.parent(),
                $this_parent_children = $this_parent.children();
            for (var i = 0, l = +$this_parent.data('starscount'); 5 > i; i++) {
                if (i < l) {
                    $this_parent_children.eq(i).addClass(iconName + '__gold');
                } else {
                    $this_parent_children.eq(i).removeClass(iconName + '__gold');
                }
            }
        });
    }

    function showSiblingByClick(el, target) {
        el = el || 'js-show-content';
        target = target || 'js-show-content-target';

        $('.' + el).click(
            function (ev) {
                var $this = $(this),
                    $target = $this.siblings('.' + target),
                    $parent = $this.parent();
                if (!$parent.hasClass('_active')) {
                    $target.slideDown('fast');
                } else {
                    $target.slideUp('fast');
                }

                $parent.toggleClass('_active');

                return false;
            }
        );
    }

    myApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/index");

            $stateProvider
                .state('index', {
                    abstract: true,
                    url: '?index',
                    views: {
                        footer: {
                            templateUrl: 'templates/footer.html',
                            controller: function () {
                                var targetYear = document.getElementById('js-footer-year'),
                                    currYear = new Date().getFullYear();

                                targetYear.innerText = currYear;
                            }
                        },
                        header: {
                            templateUrl: 'templates/header.html',
                            controller: function () {
                                var $headerTop = $('.b-header_top'),
                                    hasClass = false;

                                showSiblingByClick('js-show-content-h', 'js-show-content-target-h');

                                showChildByHoveredParent('js-hovered-menu-item', 'js-hovered-menu-item_dropdown');

                                $('.js-close-all-modals').click(function () {
                                    $('.b-modal__active').removeClass('b-modal__active');
                                    $('body').removeClass('overflow-hidden');
                                    return false;
                                });

                                $('.js-open-modal-callback').click(function () {
                                    $('.b-modal-callback, .b-modals').addClass('b-modal__active');
                                    $('body').addClass('overflow-hidden');
                                    return false;
                                });

                                $('.js-open-modal-online').click(function () {
                                    $('.b-modal-online, .b-modals').addClass('b-modal__active');
                                    $('body').addClass('overflow-hidden');
                                    return false;
                                });

                                $(window).scroll(
                                    function (ev) {
                                        if (!hasClass && $(document).scrollTop() > 100) {
                                            $headerTop.addClass('active');
                                            hasClass = true;
                                        } else if (hasClass && $(document).scrollTop() < 100) {
                                            $headerTop.removeClass('active');
                                            hasClass = false;
                                        }
                                    }
                                );

                                $('.b-header_search_icon').click(function () {
                                    var parent = $('.b-header_search'),
                                        target = $('.b-header_search_field input');

                                    if (parent.hasClass('b-header_search__active')) {
                                        if (target.val() !== '') {

                                            return true;
                                        }

                                        parent.removeClass('b-header_search__active');
                                        target.animate({
                                            width: '0'
                                        }, 100, function () {
                                            target.css('display', 'none');
                                        });
                                    } else {
                                        parent.addClass('b-header_search__active');

                                        target.css('display', 'block')
                                            .animate({
                                                width: '164px'
                                            }, 100);
                                    }

                                    return false;
                                });
                            }
                        },
                        '': {
                            template: '<div ui-view></div>'
                        }
                    }
                })
                .state('index.main', {
                    url: '/index',
                    views: {
                        '': {
                            templateUrl: 'templates/main.html',
                            controller: function () {
                                var $scrollTarget = $('.js-scroll-effect'),
                                    $viewportHeight = $(window).height(),
                                    wasScrolled = false;

                                $(window).scroll(
                                    function() {
                                        var $scrollTop = $(document).scrollTop();
                                        if (
                                            !wasScrolled &&
                                            (($(document).scrollTop() + $viewportHeight) > ($scrollTarget.offset().top + $viewportHeight/3))
                                        ) {
                                            $scrollTarget.addClass('__active');
                                            wasScrolled = true;
                                        }
                                    }
                                );
                                (function () {
                                    var sliderCount = $('.b-main-slider_wrapper li').length,
                                        pagerWrapper = $('.b-main-slider_pager ul'),
                                        pagerCache = '';

                                    if (sliderCount < 2) {
                                        $('.b-main-slider_pager').css('display', 'none');
                                    } else {
                                        for (var i = 1, l = sliderCount; l > i; i++) {
                                            pagerCache += '<li class="b-main-slider_pager_item"><a data-slide-index="' + i + '"></a></li>';
                                        }

                                        pagerWrapper.append(pagerCache);
                                    }

                                    $('.b-main-slider_wrapper').bxSlider({
                                        prevText: '',
                                        infiniteLoop: false,
                                        nextText: '',
                                        pagerCustom: pagerWrapper,
                                        nextSelector: $('.b-main-slider_pager_arrow-right'),
                                        prevSelector: $('.b-main-slider_pager_arrow-left'),
                                        speed: 400
                                    });
                                }());

                                (function () {
                                    $('.b-main-clients_holder > ul').bxSlider({
                                        pager: false,
                                        minSlides: 2,
                                        maxSlides: 6,
                                        slideWidth: 190,
                                        moveSlides: 1,
                                        speed: 300,
                                        auto: true,
                                        pause: 4000
                                    });
                                }());

                                (function () {
                                    var mainCarousel = $('.b-main-carousel_target').bxSlider({
                                        pager: false,
                                        controls: false,
                                        speed: 300,
                                        adaptiveHeight: true,
                                        onSlideNext: function ($slEl, oldId, newId) {
                                            $('.js-slide-to').each(function () {
                                                var $this = $(this);
                                                if ($this.data('slideTo') === newId) {
                                                    $this.addClass('__active');
                                                } else {
                                                    $this.removeClass('__active');
                                                }
                                            });
                                        },
                                        onSlidePrev: function ($slEl, oldId, newId) {
                                            $('.js-slide-to').each(function () {
                                                var $this = $(this);
                                                if ($this.data('slideTo') === newId) {
                                                    $this.addClass('__active');
                                                } else {
                                                    $this.removeClass('__active');
                                                }
                                            });
                                        }
                                    });

                                    $('.js-slide-to').click(function () {
                                        var $this = $(this);
                                        mainCarousel.goToSlide($this.data('slideTo'));
                                        $this.siblings().removeClass('__active');
                                        $this.addClass('__active');
                                        return false;
                                    });
                                }());

                                setStarIcons('icon-star');
                            }
                        }
                    }
                })
                .state('index.catalog', {
                    url: '/cat',
                    views: {
                        '': {
                            templateUrl: 'templates/catalog.html',
                            controller: function () {
                                setStarIcons('icon-star');
                            }
                        }
                    }
                })
                .state('index.catalog_additional', {
                    url: '/cat-additional',
                    views: {
                        '': {
                            templateUrl: 'templates/catalog_additional.html'
                        }
                    }
                })
                .state('index.catalog_item', {
                    url: '/cat-item',
                    views: {
                        '': {
                            templateUrl: 'templates/catalog_item.html',
                            controller: function () {
                                setStarIcons('icon-star-big');
                                showChildByHoveredParent('js-hovered-parent', 'js-hovered-parent_dropdown');

                                $('.js-change-count').click(function() {
                                    var target_input = $(this).parents('.js-change-count_parent').find('input');
                                    if ($(this).data('changeCount') === 'up') {
                                        target_input.val(+target_input.val() + 1);
                                    } else if (target_input.val() > 0) {
                                        target_input.val(+target_input.val() - 1);
                                    }
                                });
                            }
                        }
                    }
                })
                .state('index.news', {
                    url: '/news',
                    views: {
                        '': {
                            templateUrl: 'templates/news_list.html'
                        }
                    }
                })
                .state('index.news_item', {
                    url: '/news-item',
                    views: {
                        '': {
                            templateUrl: 'templates/news_item.html'
                        }
                    }
                })
                .state('index.contacts', {
                    url: '/contacts',
                    views: {
                        '': {
                            templateUrl: 'templates/contacts.html'
                        }
                    }
                })
                .state('index.reviews', {
                    url: '/reviews',
                    views: {
                        '': {
                            templateUrl: 'templates/reviews.html'
                        }
                    }
                })
                .state('index.services', {
                    url: '/services',
                    views: {
                        '': {
                            templateUrl: 'templates/services.html',
                            controller: function () {
                                showSiblingByClick();
                            }
                        }
                    }
                })
                .state('index.vacancies', {
                    url: '/vacancies',
                    views: {
                        '': {
                            templateUrl: 'templates/vacancies.html',
                            controller: function () {
                                showSiblingByClick();
                            }
                        }
                    }
                });
        }
    ]);
}(angular, $);
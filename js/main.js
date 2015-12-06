!function (angular, $) {
    "use strict";
    var myApp = angular.module('MyApp', ['ui.router']);

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
                            controller: function ($scope) {

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
                                        speed: 300
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



                                (function () {
                                    $('.icon-star-set').each(function (id, item) {
                                        item.dataset.starscount = $(item).children('.icon-star__gold').length;
                                    }).click(function (ev) {
                                        var $this = $(ev.target);
                                        if ($this.hasClass('icon-star')) {
                                            $this.parent().data('starscount', $this.index() + 1);
                                        }

                                        // here must be ajax
                                        return false;
                                    });

                                    $('.icon-star').hover(function () {
                                        var $this = $(this);
                                        $this.addClass('icon-star__gold')
                                            .prevAll()
                                            .addClass('icon-star__gold');
                                        $this.nextAll()
                                            .removeClass('icon-star__gold');
                                    }, function () {
                                        var $this = $(this),
                                            $this_parent = $this.parent(),
                                            $this_parent_children = $this_parent.children();
                                        for (var i = 0, l = +$this_parent.data('starscount'); 5 > i; i++) {
                                            if (i < l) {
                                                $this_parent_children.eq(i).addClass('icon-star__gold');
                                            } else {
                                                $this_parent_children.eq(i).removeClass('icon-star__gold');
                                            }
                                        }
                                    });
                                }());



                            }
                        }
                    }
                });
        }
    ]);
}(angular, $);
!function (angular, $) {
    "use strict";
    var myApp = angular.module('MyApp', ['ui.router']);

    myApp.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('index', {
                    abstract: true,
                    url: '?index',
                    views: {
                        footer: {
                            templateUrl: 'templates/footer.html'
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
                                        }, 200, function () {
                                            target.css('display', 'none');
                                        });
                                    } else {
                                        parent.addClass('b-header_search__active');

                                        target.css('display', 'block')
                                            .animate({
                                                width: '164px'
                                            }, 200);
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
                    url: '/',
                    views: {
                        '': {
                            templateUrl: 'templates/main.html',
                            controller: function ($scope) {
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
                                    nextText: '',
                                    pagerCustom: pagerWrapper,
                                    nextSelector: $('.b-main-slider_pager_arrow-right'),
                                    prevSelector: $('.b-main-slider_pager_arrow-left'),
                                    speed: 400
                                });


                            }
                        }
                    }
                });
        }
    ]);
}(angular, $);
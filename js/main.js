!function (angular) {
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
                            templateUrl: 'templates/header.html'
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
                            templateUrl: 'templates/main.html'
                        }
                    }
                });
        }
    ]);
}(angular);
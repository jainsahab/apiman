/// <reference path="../apimanPlugin.ts"/>
module Apiman {

    export var ConsumerOrgsController = _module.controller("Apiman.ConsumerOrgsController",
        ['$q', '$location', '$scope', 'ApimanSvcs', 'PageLifecycle', 'Logger', 'CurrentUser',
        ($q, $location, $scope, ApimanSvcs, PageLifecycle, Logger, CurrentUser) => {
            var params = $location.search();
            if (params.q) {
                $scope.orgName = params.q;
            }
            
            $scope.searchOrg = function(value) {
                $location.search('q', value);
            };
            
            var pageData = {
                orgs: $q(function(resolve, reject) {
                    if (params.q) {
                        var body:any = {};
                        body.filters = [];
                        body.filters.push( {"name": "name", "value": "*" + params.q + "*", "operator": "like"});
                        var searchStr = angular.toJson(body);
                        ApimanSvcs.save({ entityType: 'search', secondaryType: 'organizations' }, searchStr, function(result) { 
                            resolve(result.beans);
                        }, reject);
                    } else {
                        resolve([]);
                    }
                })
            };

            function loadAllEntries() {
                if ($scope.orgs.length == 0) {
                    $scope.searchOrg('*');
                }
                $('#apiman-search').val(function (index, value) {
                    return value.replace('*','');
                });
            }

            PageLifecycle.loadPage('ConsumerOrgs', undefined, pageData, $scope, function() {
                PageLifecycle.setPageTitle('consumer-orgs');
                loadAllEntries();
                $scope.$applyAsync(function() {
                    angular.forEach($scope.orgs, function(org) {
                        org.isMember = CurrentUser.isMember(org.id);
                    });
                    $('#apiman-search').focus();
                });
            });
        }]);

}

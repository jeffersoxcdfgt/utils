(function () {
  app.controller('providerStreamCtrl', ['$scope', 'newAngularIframe','$routeParams',
      function ($scope, newAngularIframe,$routeParams) {
          newAngularAppInit();
          $scope.newAngularAppDomain = undefined;
          function newAngularAppInit() {  
          
          const equal = '='
          const separator = '&'
          const listparams= Object.entries($routeParams).map((params) =>[params.join(equal)])
                                     .join(separator)
            
          newAngularIframe.route('/provider-stream?'+listparams).then(res => {
                    $scope.newAngularAppDomain = res;
                    $scope.$apply();
           });
          }
      }])
})();

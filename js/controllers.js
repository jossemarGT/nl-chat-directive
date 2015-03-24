(function(angular){
  'use strict';

  angular.module('directiveExample')
  .controller('TestController', function($scope, $log){
    $scope.mensajes =
    [ {username: 'Paco', text: 'Lorem ipsum, dolorem?', ts: new Date()} ];

    $scope.enviar = function(mensaje){
      $scope.$apply(function(){
        $scope.mensajes.push({username: 'Pedro', text: mensaje, ts: new Date()});
        $scope.$broadcast('nlChat:newMessage');
        $log.info(mensaje);
      });
    }
  });
})(window.angular);

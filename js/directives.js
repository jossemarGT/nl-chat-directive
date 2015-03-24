(function(angular){
  'use strict';

  angular.module('directiveExample')
  .directive('nlChat', function($timeout, $window){
    return {
      restrict: 'A',
      transclude: true,
      scope: { onMessageEntered : '&' },
      template: '<div ng-transclude></div> <div class="chat-message-form"><div class="form-group"><textarea type="text" class="form-control" placeholder="Escriba su mensaje" nl-chat-input></textarea></div> <input type="button" value="Enviar" class="sr-only"></div>',
      controller: function($scope){
        this.sendMessage =  function ( msg ) {
          $scope.onMessageEntered({message:msg});
        };
      },
      link: function(scope, element){
        var $body = angular.element('body');

        $body.addClass('has-chat');

        scope.$on('$destroy', function(){
          $body.removeClass('has-chat');
        });

        scope.$on('nlChat:newMessage', function(e){
          $timeout(function(){
            var $chatDiscussion = $('.chat-discussion', element);
            var $scrollWrap = $('.chat-scroll-wrap', $chatDiscussion);

            if( $chatDiscussion.height() < $scrollWrap.height() )
              $chatDiscussion.animate({scrollTop : $scrollWrap.height() });
            });
          });

          // NASTY resize
          var $w = angular.element($window);

          function resize (){
            // Resize .chat-view
            var viewHeight = Math.floor( $w.height());

            element.css({height: viewHeight});

            // Resize Chat wrap
            var t = $('.chat-message-form', element );

            $('.chat-view', element).css({height: viewHeight});
            $('.chat-discussion', element).css({height: viewHeight  - t.height()});
          }

          $w.on('resize', function(){
            resize();
          });

          $timeout(function(){
            resize();
          }, 400);
        }
      }
    })
    .directive('nlChatInput', function(){
      return {
        restrict: 'A',
        require: '^nlChat', // Parent controller
        link: function( scope, element, __, chatCtrl ) {
          var focus = false;

          element.on('focus', function(){
            focus = true;
          })
          .on('blur', function(){
            focus = false;
          })
          .on('keydown', function(e){
            if(focus && e.keyCode == 13){
              if(element.val().trim().length > 0) {
                chatCtrl.sendMessage(element.val());
              }
              element.val('');
              e.preventDefault();
            }
          });
        }
      };
    });
})(window.angular);

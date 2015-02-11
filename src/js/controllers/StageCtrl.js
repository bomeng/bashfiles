/* ==================================================

  StageCtrl

  keeps the view in sync with the Session object on
  Firebase

  exposes controls to change the "stage" & "step"
  exposes the partials object and the current partial

  use `StageCtrl.next()` & `StageCtrl.prev()` to
  step forward or backward in the flow.

================================================== */

controllers.controller("StageCtrl", ["$scope", "$state", "$timeout", "TemplateConfig", "Session", "Clientstream", StageCtrl_]);

function StageCtrl_($scope, $state, $timeout, Templates, Session, Client) {
  var vm,
      session_ref,
      stage,
      step,
      state_ref,
      session_stream,
      waiting;

  stage = 0;
  step  = 0;
  waiting = false;

  vm = this;
  vm.next = next;
  vm.prev = prev;
  vm.waiting = isWaiting;
  vm.startOver = startOver;
  vm.jumpToStep = jumpToStep;
  vm.jumpToStage = jumpToStage;
  vm.spinIt = waiting;
  vm.partial = Templates.partial(stage, step);
  vm.partials = flattenPartialsArray(Templates.partials);
  vm.currentStep = currentStep;

  function currentStep (step) {
    return step === step;
  }

  // register listeners for stage, step, and start over events
  Client.listen('jump to step', jumpToStep);
  Client.listen('jump to stage', jumpToStage);
  Client.listen('stage', stageListen);
  Client.listen('step', stepListen);
  Client.listen('start over', startOver);
  Client.listen('spin it', setWaiting);

  // view_sync helps flow control for async // TODO: more stream-like
  $scope.view_sync = true;

  Client.listen('Session >> Stage: New Session', function (ds) {

    // now a stream from firebase
    session_stream = Session.stream()
      .map(function(x){
        return x.val() || x;
      })
      .subscribe(handleSessionStream);
  })

  function handleSessionStream (data) {
    if ($scope.view_sync) {
      // lock the view if you're making changes
      $scope.view_sync = false;

      if (data.stage !== stage) {
        Client.emit('stage', data);
      }
      else if (data.step !== step) {
        Client.emit('step', data.step);
      }
    }
  }

  function isWaiting () {
    return waiting;
  }

  function setWaiting (data) {
    waiting = data;
    $timeout(function(){
      $scope.$apply();
    }, 0);
  }

  // listen for stage change requests from ui-router
  function startOver (data) {
    console.log('heard that startover', data)
    Client.emit('erase area', data);
    /* jshint -W030 */
    $scope.view_sync && Client.emit('stage', {
      stage: 1,
      step: 0
    });
    /* jshint +W030 */
  }

  var counter = 0;  // HACK: DEV: session provider
  function stageListen (target_state) {
    if (counter++ < 1) return; // HACK: DEV: session provider
    console.log('heard that stage emission');
    var name;
    if (target_state === "next") {
      next();
    } else if (target_state === "back") {
      prev();
    } else if ($scope.view_sync) {
      target_state = !!target_state.state ? target_state.state : target_state;
      stage = target_state.stage;
      name = Templates.config[stage].name;
      $state.go(name).then(function(){
        // trigger step changes afterwards
        Client.emit('step', target_state.step)
      });
    }
  }

  function stepListen (target_step) {
    console.log('heard that step emission');
    step = target_step;
    $timeout( function () {
      // unlock the view
      $scope.view_sync = true;
      $scope.$apply();
    }, 1);
    // update the view
    // vm.partial = Templates.partials[stage][step];
    vm.partial = Templates.partial(stage, step);
    // update firebase
    /* jshint -W030 */
    $scope.view_sync && Session.ref().child('state').update({
      stage: stage,
      step: step
    });
    /* jshint +W030 */
  }

  // user flow controls
  function next () {
    if ( step + 1 < Templates.config[stage].steps.length ) {
      Client.emit('step', step + 1);
    } else if (stage + 1 < Templates.config.length ) {
      Client.emit('stage', {
        stage: stage + 1,
        step:  0,
      })
    }
  }

  function prev () {
    if ( step - 1 >= 0 ) {
      Client.emit('step', step - 1);
    } else if (stage - 1 >= 0 ) {
      Client.emit('stage', {
        stage: stage - 1,
        step:  Templates.config[stage - 1].steps.length -1,
      })
    }
  }

  function jumpToStep (target) {
    console.log('trying to jump to:', target, 'step');
    var steps = Templates.config[stage].steps;
    for (var i = 0; i < steps.length; i++) {
      if ( target === steps[i].step ) {
        Client.emit('step', i);
      }
    }
  }

  function jumpToStage (target) {
    console.log('trying to jump to:', target, 'stage');
    var stages = Templates.config;
    for (var i = 0; i < stages.length; i++) {
      if ( target !== i && target === Templates.config[i].name) {
        Client.emit('stage', {
          stage: i,
          step: 0
        });
      }
    }
  }

  function flattenPartialsArray (array) {
    var partials,
        stages_count,
        steps_count,
        this_partial;

    partials = [];
    stages_count = array.length;

    for (var i = 0; i < stages_count; i++) {
      steps_count = array[i].length;
      for (var j = 0; j < steps_count; j++) {
        this_partial = array[i][j];
        if (typeof this_partial !== "undefined") {
          partials.push(this_partial);
        }
      }
    }

    return partials;
  }
}

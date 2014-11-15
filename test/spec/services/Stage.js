describe('Unit: StageService', function() {

  beforeEach(module('flannel'));

  var ctrl, scope;

  beforeEach(inject(function (_StageService_, $state) {
    stageService = _StageService_;
    state = $state;
  }));

  it("StageService' .next() should initially return 0.",
    function() {
      expect(stageService.syncObj().next()).toEqual(0);
  });

})

$(document).ready(function() {

  module("EmperorViewControllerABC", {
  });

  /**
   *
   * Test that the constructor for EmperorViewControllerABC.
   *
   */
  test("Constructor tests", function(assert) {

    var container = $('<div id="does-not-exist"></div>');
    var controller = new EmperorViewControllerABC(container, 'foo', 'bar');

    equal(controller.title, 'foo', 'Check the title is correctly set');
    equal(controller.description, 'bar', 'Check the description is correctly'+
                                        ' set');
    equal(controller.$container.id, container.id, 'Check the id of the '+
                                                  'parent is correct');
    equal(controller.active, false, 'Check the active property');
    equal(controller.identifier.slice(0, 7), 'EMPtab-', 'Check the identifier'+
                                                        ' property');
    parseFloat(controller.identifier.slice(7));
    equal(controller.enabled, true, 'Check the enabled property');

    // check all the elements were successfully created
    assert.ok(controller.$canvas.length);
    assert.ok(controller.$header.length);
    assert.ok(controller.$body.length);

    assert.ok($.contains(controller.$canvas, controller.$header));
    assert.ok($.contains(controller.$canvas, controller.$body));
  });

  /**
   *
   * Test the enabled method
   *
   */
  test('Test the enabled method works', function(){

    var container = $('<div id="does-not-exist"></div>');
    var controller = new EmperorViewControllerABC(container, 'foo', 'bar');

    equal(controller.enabled, true);
    controller.setEnabled(false);
    equal(controller.enabled, false);

    throws(function(){
      controller.setEnabled('shenanigans');
    }, Error, 'setEnabled can only take a boolean');
  });

  /**
   *
   * Test the enabled method
   *
   */
  test('Test the setActive method works', function(){

    var container = $('<div id="does-not-exist"></div>');
    var controller = new EmperorViewControllerABC(container, 'foo', 'bar');

    equal(controller.active, false);
    controller.setActive(true);
    equal(controller.active, true);

    throws(function(){
      controller.setActive('shenanigans');
    }, Error, 'setActive can only take a boolean');
  });

  /**
   *
   * Test the resize, toJSON and fromJSON methods raise the appropriate errors.
   *
   */
  test('Test resize, toJSON and fromJSON methods', function(){

    var container = $('<div id="does-not-exist"></div>');
    var controller = EmperorViewControllerABC(container, 'foo', 'bar');
    throws(function(){
      controller.resize(10, 10);
    }, Error, 'Cannot call this abstract method');

    throws(function(){
      controller.fromJSON('{foo:11}');
    }, Error, 'Cannot call this abstract method');

    throws(function(){
      controller.toJSON();
    }, Error, 'Cannot call this abstract method');
  });


  module("EmperorAttributeABC", {

    setup: function(){
      sharedDecompositionViewDict = {}
      var $slickid = $('<div id="fooligans"></div>');
      $slickid.appendTo(document.body);

      // setup function
      name = "pcoa";
      ids = ['PC.636', 'PC.635'];
      coords = [
        [-0.276542, -0.144964, 0.066647, -0.067711, 0.176070, 0.072969,
         -0.229889, -0.046599],
        [-0.237661, 0.046053, -0.138136, 0.159061, -0.247485, -0.115211,
         -0.112864, 0.064794]];
      pct_var = [26.6887048633, 16.2563704022, 13.7754129161, 11.217215823,
                 10.024774995, 8.22835130237, 7.55971173665, 6.24945796136];
      md_headers = ['SampleID', 'LinkerPrimerSequence', 'Treatment', 'DOB'];
      metadata = [['PC.636', 'YATGCTGCCTCCCGTAGGAGT', 'Control', '20070314'],
                  ['PC.635', 'YATGCTGCCTCCCGTAGGAGT', 'Fast', '20071112']];
      decomp = new DecompositionModel(name, ids, coords, pct_var, md_headers,
                                      metadata);
      var dv = new DecompositionView(decomp);
      sharedDecompositionViewDict['pcoa'] = dv;

      name = "biplot";
      ids = ['tax_1', 'tax_2'];
      coords = [
        [-1, -0.144964, 0.066647, -0.067711, 0.176070, 0.072969,
         -0.229889, -0.046599],
        [-0.237661, 0.046053, -0.138136, 0.159061, -0.247485, -0.115211,
         -0.112864, 0.064794]];
      pct_var = [26.6887048633, 16.2563704022, 13.7754129161, 11.217215823,
                 10.024774995, 8.22835130237, 7.55971173665, 6.24945796136];
      md_headers = ['SampleID', 'Gram'];
      metadata = [['tax_1', '1'],
                  ['tax_2', '0']];
      decomp = new DecompositionModel(name, ids, coords, pct_var, md_headers,
                                      metadata);
      dv = new DecompositionView(decomp);
      sharedDecompositionViewDict['biplot'] = dv;

      // Slickgrid
      var columns = [
        {id: "pc1", name: "pc1", field: "pc1"},
        {id: "pc2", name: "pc2", field: "pc2"},
        {id: "pc3", name: "pc3", field: "pc3"},
      ];

      var options = {
        enableCellNavigation: true,
        enableColumnReorder: false
      };
      var data = [];
      data.push({'pc1':1, 'pc2':1, 'pc3':1});
      data.push({'pc1':1, 'pc2':1, 'pc3':2});

      grid = new Slick.Grid("#fooligans", data, columns, options);
    },
    teardown: function(){
      sharedDecompositionViewDict = undefined;
      $("#fooligans").remove();
      decomp=undefined;
    }
  });

  /**
   *
   * Test that the constructor for EmperorViewControllerABC.
   *
   */
  test("Constructor tests", function(assert) {
    console.log(decomp)
    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');

    // verify the subclassing was set properly
    assert.ok(EmperorAttributeABC.prototype instanceof
              EmperorViewControllerABC);
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       sharedDecompositionViewDict);

    assert.ok(EmperorAttributeABC.prototype instanceof
              EmperorViewControllerABC);

    throws(function(){
      new EmperorAttributeABC(container, 'foo', 'bar',
                              {1:1, 2:2});
      attr.setActive('shenanigans');
    }, Error, 'The decomposition view dictionary' +
              'can only have decomposition views');

    // FIXME: We need tests :(
  });

  /**
   *
   * Test the enabled method
   *
   */
  test('Test the enabled method works', function(){

    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv});

    equal(attr.enabled, true);
    attr.setEnabled(false);
    equal(attr.enabled, false);

    throws(function(){
      attr.setEnabled('shenanigans');
    }, Error, 'setEnabled can only take a boolean');
  });

  /**
   *
   * Test the enabled method
   *
   */
  test('Test the setActive method works', function(){

    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv});

    equal(attr.active, false);
    attr.setActive(true);
    equal(attr.active, true);

    throws(function(){
      attr.setActive('shenanigans');
    }, Error, 'setActive can only take a boolean');
  });

  /**
   *
   * Test the resize, toJSON and fromJSON methods raise the appropriate errors.
   *
   */
  test('Test resize, toJSON and fromJSON methods', function(){

    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv});
    throws(function(){
      attr.resize(10, 10);
    }, Error, 'Cannot call this abstract method');

    throws(function(){
      attr.fromJSON('{foo:11}');
    }, Error, 'Cannot call this abstract method');

    throws(function(){
      attr.toJSON();
    }, Error, 'Cannot call this abstract method');
  });
  
  /**
   *
   * Test set metadata field
   *
   */
  test('Test setMetadataField', function(){
    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv});
    attr.setMetadataField('cheese');
    equal(attr.metadataField, 'cheese');
  });

  /**
   *
   * Test get active decomposition view key
   *
   */
  test('Test getActiveDecompViewKey', function(){
    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv});
    equal(attr.getActiveDecompViewKey(), 'scatter');
  });

  /**
   *
   * Test set active decomposition view key
   *
   */
  test('Test setActiveDecompViewKey', function(){
    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv, 'biplot': dv},
                                       'butter');
    equal(attr.getActiveDecompViewKey(), 'scatter');
    attr.setActiveDecompViewKey('biplot')
    equal(attr.getActiveDecompViewKey(), 'biplot');
  });

  /**
   *
   * Test set slick grid dataset
   *
   */
  test('Test setSlickGridDataset', function(){
    var dv = new DecompositionView(decomp);
    var container = $('<div id="does-not-exist"></div>');
    var attr = new EmperorAttributeABC(container, 'foo', 'bar',
                                       {'scatter': dv, 'biplot': dv});
    attr.setSlickGridDataset([{'pc1':1, 'pc2':2, 'pc3':3},
                              {'pc1':1, 'pc2':1, 'pc3':2}])
    deepEqual(attr.getSlickGridDataset(), [{'pc1':1, 'pc2':2, 'pc3':3},
                                           {'pc1':1, 'pc2':1, 'pc3':2}]);
  });
});
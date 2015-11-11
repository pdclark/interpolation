var typeArray = {
  rgb: d3.interpolateRgb,
  hsl: d3.interpolateHsl,
  hcl: d3.interpolateHcl
};

var $start = $('#start'),
    $end = $('#end'),
    $list = $('.list'),
    $numSteps = $('.numSteps');
    $color = $('.color');
    $interpolationType = $('input[name=interpolationType]');

var interpolateColor = function(rgbColor1, rgbColor2, steps, type) {
  type = type || 'rgb';
  steps = steps || 8;

  var funcStorage, i = 0, amt = 1/steps, result = [];

  funcStorage = d3.scale.linear().domain([0, 1])
    .interpolate(typeArray[type])
    .range([rgbColor1, rgbColor2]);
  while (i++ < steps) {
    result.push(funcStorage(i * amt));
  }

  return result;
};

var onSubmit = function () {
  $list.find('li').remove();

  var rgbColor1 = $start.val();
  var rgbColor2 = $end.val();
  var steps = $numSteps.val();
  var type = $interpolationType.filter(':checked').val();

  var colorArray = interpolateColor(rgbColor1, rgbColor2, steps, type);
  
  for (i = 0; i<colorArray.length; i++) {
    $list.append('<li class="interim"><span class="colorRgb"></span></li>');
  }

  $('.num').html($numSteps.val());
  
  var j = 0;

  $('li').each(function (step) {
    $(this).css('background-color', colorArray[j]);
    $(this).find('.colorRgb').text(colorArray[j]);
    j = j+1;
  });
};

$numSteps.on('change', onSubmit).trigger('change');

$interpolationType.on('change', onSubmit).trigger('change');

$color.on('change', onSubmit);

var hexToRgb = function(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result !== null) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  } else {
    return null;
  }
};

var rgbToHex = function(rgb) {
  var str = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  return str;
};

var interpolateColor = function(rgbColor1, rgbColor2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }

  var result = rgbColor1.slice();
  for (var i=0; i<3; i++) {
    result[i] = Math.round(result[i] + factor*(rgbColor2[i]-rgbColor1[i]));
  }
  return result;
};

var $start = $('#start'),
    $mid = $('#mid'),
    $end = $('#end'),
    $list = $('#list'),
    $numSteps = $('#numSteps'),
    $numColors,
    colorArray = [];

var generateColorArray = function () {
  numSteps = parseInt($numSteps.val());
  numColors = parseInt($numColors);

  var amount,
      startColor = hexToRgb($start.val()),
      midColor = hexToRgb($mid.val()),
      endColor = hexToRgb($end.val()),
      i;

  if (numColors === 2) {
    amount = 1/(numSteps+1);
    for (i = 0; i<=numSteps+1; i++) {
      var icol1 = interpolateColor(startColor, endColor, amount * i),
          hexcol1 = rgbToHex(icol1);
      colorArray.push(hexcol1);
    }
  }
  else if (numColors === 3) {
    var icol2, hexcol2, arrA = [], arrB = [];
    for (i = 0; i <= numSteps+1; i++) {
      amount = 1/(numSteps+1);
      icol2 = interpolateColor(startColor, midColor, amount * i),
      hexcol2 = rgbToHex(icol2);
      arrA.push(hexcol2);
      icol2 = interpolateColor(midColor, endColor, amount * i),
      hexcol2 = rgbToHex(icol2);
      arrB.push(hexcol2);
    }
    arrA.pop();
    colorArray = arrA.concat(arrB);
  }
};

var onSubmit = function () {
  $list.find('li.interim').remove();
  colorArray = [];

  generateColorArray();

  $('textarea').val(colorArray);
  
  for (i = 0; i<colorArray.length; i++) {
    $list.append('<li class="interim"><span></span></li>');
  }

  var j = 0;
  $('.interim').each(function (step) {
    $(this).css('background-color', colorArray[j]);
    $(this).find('span').text(colorArray[j]);
    j = j+1;
  });
};


//change # of colors
$('input[name=numColors]').on('change', function () {
  $numColors = parseInt($('input[name=numColors]:checked').val());
  if ($numColors===3) {
    $('input[type="color"]').removeAttr('hidden');
   } else {
    $('input#mid').attr('hidden', 'hidden');
   }

  $numColors = parseInt($('input[name=numColors]:checked').val());
  onSubmit();

}).trigger('change');

$('#numSteps').on('change', function () {
  onSubmit();
}).trigger('change');

// input hexcolors instead
$('#usehex').on('change', function() {
  var inputColorField = $('input[type=color]').eq(0).attr('type');
  
  $('input.colors').attr('type', (inputColorField === 'color') ? 'text' : 'color');
});

$('input[type=color]').on('change', function () {
  onSubmit();
});
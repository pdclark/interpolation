  // getColorPalette: function (colorArray, steps, type) {
  //   var typeArray = [d3.interpolateRgb, d3.interpolateHsl];
  //   var funcStorage, i = 0, amt = 1/steps, result = [];

  //   if (type === undefined || type === null ) type = this.DEFAULT_INTERPOLATION_TYPE;
  //   if (steps === undefined || steps === null) steps = this.DEFAULT_INTERPOLATION_STEPS;
  //   if (colorArray === undefined) colorArray = this.DEFAULT_COLOR_SCHEMES['default'];

  //   if (colorArray.length === 2) {
  //     funcStorage = d3.scale.linear().domain([0, 1])
  //       .interpolate(typeArray[type])
  //       .range([colorArray[1], colorArray[0]]);
  //   } else if (colorArray.length === 3) {
  //     funcStorage = d3.scale.linear().domain([0, 0.5, 1])
  //       .interpolate(typeArray[type])
  //       .range([colorArray[2], colorArray[1], colorArray[0]]);
  //   }

  //   while (i++ < steps) result.push(funcStorage(i * amt));
  //   return result;
  // },

var typeArray = [d3.interpolateRgb, d3.interpolateHsl, d3.interpolateHcl]

// var hexToRgb = function(hex) {
//   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//   if (result !== null) {
//     return [
//       parseInt(result[1], 16),
//       parseInt(result[2], 16),
//       parseInt(result[3], 16)
//     ];
//   } else {
//     return null;
//   }
// };

// var rgbToHex = function(rgb) {
//   var str = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
//   return str;
// };

var interpolateColor = function(rgbColor1, rgbColor2, steps, type) {
  type = type || 'rgb';
  steps = steps || 8;

  var funcStorage, i = 0; amt = 1/steps, result = [];

  funcStorage = d3.scale.linear().domain([0, 1])
    .interpolate()
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

  if (numSteps < 2) {
    alert('GTFO');
  } else if (numSteps % 2 === 0) {
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
        icol2 = interpolateColor(startColor, midColor, amount * i);
        hexcol2 = rgbToHex(icol2);
        arrA.push(hexcol2);
        icol2 = interpolateColor(midColor, endColor, amount * i);
        hexcol2 = rgbToHex(icol2);
        arrB.push(hexcol2);
      }
      arrA.pop();
      colorArray = arrA.concat(arrB);
    }
  } else {
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
  }

};

var rgbToHsl = function(color) {
  var r = color[0]/255;
  var g = color[1]/255;
  var b = color[2]/255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

var hslToRgb = function(color) {
  var l = color[2];

  if (color[1] == 0) {
    l = Math.round(l*255);
    return [l, l, l];
  } else {
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var s = color[1];
    var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    var p = 2 * l - q;
    var r = hueToRgb(p, q, color[0] + 1/3);
    var g = hueToRgb(p, q, color[0]);
    var b = hueToRgb(p, q, color[0] - 1/3);
    return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
  }
};

var interpolateHSL = function(color1, color2, factor) {
  if (arguments.length < 3) { factor = 0.5; }
  var hsl1 = rgbToHsl(color1);
  var hsl2 = rgbToHsl(color2);
  for (var i=0;i<3;i++) {
    hsl1[i] += factor*(hsl2[i]-hsl1[i]);
  }
  return hslToRgb(hsl1);
};

var onSubmit = function () {
  $list.find('li.interim').remove();
  colorArray = [];

  generateColorArray();
  
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

$('#usehsl').on('change', function () {
  
  //if checked
    //clear spans
    //rgb to hsl
    //interpolate hsl
    //hsl to rgb
    //create array
    //create new spans with colors
  //else
    //remove the attribute

})

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
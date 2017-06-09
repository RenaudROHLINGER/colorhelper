angular
    .module('colorHelper', [])
    .factory('colorHelper', colorHelper);

function colorHelper() {
    
    var $this = {
        shadeColor: function (color, percent) {   
            var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
            return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
        },
        blendColors: function (c0, c1, p) {
            var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
            return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
        },     
        getLuminance: function (color) {
            var c = color.substring(1);
            var rgb = parseInt(c, 16);
            var r = (rgb >> 16) & 0xff;
            var g = (rgb >>  8) & 0xff;
            var b = (rgb >>  0) & 0xff;

            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

            if (luma < 40) {
            // black
            return true
            } else {
            // white
            return false
            }
        },
        shadeColorsAuto: function(hex, amount) { 
            return $this.getLuminance(hex) ? $this.shadeColor(hex, amount) : $this.shadeColor(hex, -amount);
        },		
        shadeColorsAutoRgba: function(hex, amount, opacity) { 
            var color = $this.getLuminance(hex) ? $this.shadeColor(hex, amount) : $this.shadeColor(hex, -amount); 
            return $this.hexToRgba(color, opacity);
        },
        gradientColor: function (color) {
            return 'linear-gradient(90deg, ' + 
                (color) + ',' +
                ($this.shadeColorsAuto(color, -0.05)) + ',' +
                ($this.shadeColorsAuto(color, 0.05)) + 
                ')';
        },
        hexToRgba: function (hex, opacity) {
            var hexInt = hex.replace('#','');
            var bigint = parseInt(hexInt, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;

            var rgb = r + "," + g + "," + b;
            var result = 'rgba(' + rgb + ',' + opacity + ')';
            return result;
        },
        invertColor: function (hex) {
            function padZero(str, len) {
                len = len || 2;
                var zeros = new Array(len).join('0');
                return (zeros + str).slice(-len);
            }

            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            // invert color components
            var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
                g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
                b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
            // pad each with zeros and return
            return '#' + padZero(r) + padZero(g) + padZero(b);
        }
    }

    return $this;
}

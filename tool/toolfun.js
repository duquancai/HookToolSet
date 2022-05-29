//工具相关函数 
(function(global) {
    var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', hex_RM = "0123456789abcdefghijklmnopqrstuvwxyz",
        base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

	global.stringToBase64 = function(e) {
		var r, a, c, h, o, t;
		for (c = e.length, a = 0, r = ''; a < c;) {
			if (h = 255 & e.charCodeAt(a++), a == c) {
				r += base64EncodeChars.charAt(h >> 2),
				r += base64EncodeChars.charAt((3 & h) << 4),
				r += '==';
				break
			}
			if (o = e.charCodeAt(a++), a == c) {
				r += base64EncodeChars.charAt(h >> 2),
				r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
				r += base64EncodeChars.charAt((15 & o) << 2),
				r += '=';
				break
			}
			t = e.charCodeAt(a++),
			r += base64EncodeChars.charAt(h >> 2),
			r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
			r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
			r += base64EncodeChars.charAt(63 & t)
		}
		return r
	}

	global.stringToHex = function(str) {
		var val = "";
		for (var i = 0; i < str.length; i++) {
			if (val == "") val = str.charCodeAt(i).toString(16);
			else val += str.charCodeAt(i).toString(16);
		}
		return val
	}

	global.stringToBytes = function(str) {
		var ch, st, re = [];
		for (var i = 0; i < str.length; i++) {
			ch = str.charCodeAt(i);
			st = [];
			do {
				st.push(ch & 0xFF);
				ch = ch >> 8;
			}
			while (ch);
			re = re.concat(st.reverse());
		}
		return re;
	}

	global.base64ToString = function(e) {
		var r, a, c, h, o, t, d;
		for (t = e.length, o = 0, d = ''; o < t;) {
			do
			r = base64DecodeChars[255 & e.charCodeAt(o++)];
			while (o < t && r == -1);
			if (r == -1) break;
			do
			a = base64DecodeChars[255 & e.charCodeAt(o++)];
			while (o < t && a == -1);
			if (a == -1) break;
			d += String.fromCharCode(r << 2 | (48 & a) >> 4);
			do {
				if (c = 255 & e.charCodeAt(o++), 61 == c) return d;
				c = base64DecodeChars[c]
			} while (o < t && c == -1);
			if (c == -1) break;
			d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
			do {
				if (h = 255 & e.charCodeAt(o++), 61 == h) return d;
				h = base64DecodeChars[h]
			} while (o < t && h == -1);
			if (h == -1) break;
			d += String.fromCharCode((3 & c) << 6 | h)
		}
		return d
	}

	global.base64ToBytes = function(e) {
		var r, a, c, h, o, t, d;
		for (t = e.length, o = 0, d = []; o < t;) {
			do
			r = base64DecodeChars[255 & e.charCodeAt(o++)];
			while (o < t && r == -1);
			if (r == -1) break;
			do
			a = base64DecodeChars[255 & e.charCodeAt(o++)];
			while (o < t && a == -1);
			if (a == -1) break;
			d.push(r << 2 | (48 & a) >> 4);
			do {
				if (c = 255 & e.charCodeAt(o++), 61 == c) return d;
				c = base64DecodeChars[c]
			} while (o < t && c == -1);
			if (c == -1) break;
			d.push((15 & a) << 4 | (60 & c) >> 2);
			do {
				if (h = 255 & e.charCodeAt(o++), 61 == h) return d;
				h = base64DecodeChars[h]
			} while (o < t && h == -1);
			if (h == -1) break;
			d.push((3 & c) << 6 | h)
		}
		return d
	}

	global.base64ToHex = function(s) {
		var ret = ""
		var i;
		var k = 0; // b64 state, 0-3
		var slop;
		for (i = 0; i < s.length; ++i) {
			if (s.charAt(i) == "=") break;
			v = base64EncodeChars.indexOf(s.charAt(i));
			if (v < 0) continue;
			if (k == 0) {
				ret += hex_RM.charAt(v >> 2);
				slop = v & 3;
				k = 1;
			} else if (k == 1) {
				ret += hex_RM.charAt((slop << 2) | (v >> 4));
				slop = v & 0xf;
				k = 2;
			} else if (k == 2) {
				ret += hex_RM.charAt(slop);
				ret += hex_RM.charAt(v >> 2);
				slop = v & 3;
				k = 3;
			} else {
				ret += hex_RM.charAt((slop << 2) | (v >> 4));
				ret += hex_RM.charAt(v & 0xf);
				k = 0;
			}
		}
		if (k == 1) ret += hex_RM.charAt(slop << 2);
		return ret;
	}

	global.bytesToHex = function(arr) {
		var str = '';
		var k, j;
		for (var i = 0; i < arr.length; i++) {
			k = arr[i];
			j = k;
			if (k < 0) {
				j = k + 256;
			}
			if (j < 16) {
				str += "0";
			}
			str += j.toString(16);
		}
		return str;
	}

	global.bytesToBase64 = function(e) {
		var r, a, c, h, o, t;
		for (c = e.length, a = 0, r = ''; a < c;) {
			if (h = 255 & e[a++], a == c) {
				r += base64EncodeChars.charAt(h >> 2),
				r += base64EncodeChars.charAt((3 & h) << 4),
				r += '==';
				break
			}
			if (o = e[a++], a == c) {
				r += base64EncodeChars.charAt(h >> 2),
				r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
				r += base64EncodeChars.charAt((15 & o) << 2),
				r += '=';
				break
			}
			t = e[a++],
			r += base64EncodeChars.charAt(h >> 2),
			r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
			r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
			r += base64EncodeChars.charAt(63 & t)
		}
		return r
	}

	global.bytesToString = function(arr) {
		if (typeof arr === 'string') {
			return arr;
		}
		var str = '',
			_arr = arr;
		for (var i = 0; i < _arr.length; i++) {
			var one = _arr[i].toString(2),
				v = one.match(/^1+?(?=0)/);
			if (v && one.length == 8) {
				var bytesLength = v[0].length;
				var store = _arr[i].toString(2).slice(7 - bytesLength);
				for (var st = 1; st < bytesLength; st++) {
					store += _arr[st + i].toString(2).slice(2);
				}
				str += String.fromCharCode(parseInt(store, 2));
				i += bytesLength - 1;
			} else {
				str += String.fromCharCode(_arr[i]);
			}
		}
		return str;
	}

	global.hexToBase64 = function(h) {
		var i;
		var c;
		var ret = "";
		for (i = 0; i + 3 <= h.length; i += 3) {
			c = parseInt(h.substring(i, i + 3), 16);
			ret += base64EncodeChars.charAt(c >> 6) + base64EncodeChars.charAt(c & 63);
		}
		if (i + 1 == h.length) {
			c = parseInt(h.substring(i, i + 1), 16);
			ret += base64EncodeChars.charAt(c << 2);
		} else if (i + 2 == h.length) {
			c = parseInt(h.substring(i, i + 2), 16);
			ret += base64EncodeChars.charAt(c >> 2) + base64EncodeChars.charAt((c & 3) << 4);
		}
		while ((ret.length & 3) > 0)
		ret += "=";
		return ret;
	}

	global.hexToBytes = function(str) {
		var pos = 0;
		var len = str.length;
		if (len % 2 != 0) {
			return null;
		}
		len /= 2;
		var hexA = new Array();
		for (var i = 0; i < len; i++) {
			var s = str.substr(pos, 2);
			var v = parseInt(s, 16);
			hexA.push(v);
			pos += 2;
		}
		return hexA;
	}

	global.hexToString = function(hexstr) {
		var temp = '';
		for (var j = 0; j < hexstr.length;) {
			temp += '%' + hexstr.substring(j, j + 2);
			j += 2;
		}
		var numChars = temp.length;
		var sb = "";
		var i = 0;
		var c = "";
		var bytes = null;
		while (i < numChars) {
			c = temp.charAt(i);
			switch (c) {
				case '+':
					sb.append(' ');
					i++;
					break;
				case '%':
					if (bytes == null) bytes = new Array((numChars - i) / 3);
					var pos = 0;

					while (((i + 2) < numChars) && (c == '%')) {
						var v = parseInt(temp.substring(i + 1, i + 3), 16);
						if (v >= 0) bytes[pos++] = v;
						i += 3;
						if (i < numChars) c = temp.charAt(i);
					}
					sb += decodeUtf8(bytes);
					break;
				default:
					sb += c;
					i++;
					break;
			}
		}

		return sb;
	}

    function decodeUtf8(bytes) {
        var encoded = "";
        for (var i = 0; i < bytes.length; i++) {
            encoded += '%' + bytes[i].toString(16);
        }
        return decodeURIComponent(encoded);
    }
})(this);

//stringToBase64 stringToHex stringToBytes
//base64ToString base64ToHex base64ToBytes
//*hexToString    hexToBase64  hexToBytes
//bytesToBase64 bytesToHex   byteToString
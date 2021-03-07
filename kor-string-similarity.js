/*Copyright (c) [2018], [Jaeyoung Lee]*/
/*From https://github.com/jaeleeps/kor-string-similarity*/

var rCho =
        [ "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ",
            "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ" ];
var rJung =
        [ "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ",
            "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ" ];
var rJong =
        [ "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ",
            "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ",
            "ㅍ", "ㅎ" ];

var replaceAll = function (strTemp, strValue1, strValue2){
  while(1){
    if( strTemp.indexOf(strValue1) != -1 ) strTemp = strTemp.replace(strValue1, strValue2);
    else break;
  }
  return strTemp;
}

var korToUni = function(str) {
  return escape(replaceAll(str, "\\", "%"));
}

var uniToKor = function(str) {
  return unescape(replaceAll(str, "\\", "%"));
}

var handleSyllables = function(str) {
  var cho, jung, jong;
  var tempStr = str.charCodeAt(0) - 0xAC00;
  var arr = [];
  jong = tempStr % 28; // ??
  jung = ((tempStr - jong) / 28 ) % 21;  // ??
  cho = (((tempStr - jong) / 28 ) - jung ) / 21; // ??
  // console.log("??:" + rCho[cho] + " ??:" + rJung[jung] + " ??:" + rJong[jong]);
  (rCho[cho] != (null||undefined||"")) ? arr.push(rCho[cho]) : arr.push("empt");
  (rJung[jung] != (null||undefined||"")) ? arr.push(rJung[jung]) : arr.push("empt");
  (rJong[jong] != (null||undefined||"")) ? arr.push(rJong[jong]) : arr.push("empt");
  return arr;
}

var strSeparator = function(str) {
  var arr = [];
  var index = -1, length = str.length;
  while (++index < length) {
    // console.log("index: " + index);
    var tempStr = str[index];
    var asciiDec = tempStr.charCodeAt(0);
    var tempArr;
    // console.log(asciiDec); // ascii dec
    if (44032 <= asciiDec && asciiDec <= 55215) {
      // console.log("Hangul Syllables");
      handleSyllables(tempStr).forEach((item) => arr.push(item));
    } else {
      arr.push(tempStr);
    }
  }
  // console.log("finalArr: " + arr);
  return arr;
}

var getStrArr = function(str) {
  var arr = strSeparator(str);
  var resultarr = [];
  var index = -1, length = arr.length;
  if (length == 0) {
    resultarr = ["empt"+"undefined"]
    return resultarr;
  } else if (length == 1) {
    resultarr = [arr[0]+"undefined"]
    return resultarr;
  }
  while (++index < length) {
    resultarr.push(""+arr[index]+arr[index+1]);
  }
  return resultarr;
}

function diceCoefficient(target, compared) {
  var left = strSeparator(String(target).toLowerCase());
  var right = strSeparator(String(compared).toLowerCase());
  var rightLength = right.length;
  var length = left.length;
  var index = -1;
  var intersections = 0;
  var rightPair;
  var leftPair;
  var offset;

  while (++index < length) {
    leftPair = left[index];
    offset = -1;

    while (++offset < rightLength) {
      rightPair = right[offset];

      if (leftPair === rightPair) {
        intersections++;
        right[offset] = '';
        break;
      }
    }
  }

  return 2 * intersections / (left.length + rightLength);
}

var compareTwoStrings = function(target, comparedStr) {
  if (typeof target != "string" || typeof comparedStr != "string") {
    return new Error("INVALID INPUTTYPE for compareTwoStrings");
  } else {
    return diceCoefficient(target, comparedStr);
  }
}

var findBestMatch = function(target, comparedArr) {
  if (typeof target != "string" || typeof comparedArr != "object") {
    return new Error("INVALID INPUTTYPE for findBestMatch");
  } else {
    var possibleStringsArr = [] , resultArr = [], count = 0;
    for (var i = 0; i < comparedArr.length; i++) {
      if (1) {
        count++;
        var item;
        item = { "_text" : comparedArr[i], "similarity" : diceCoefficient(target, comparedArr[i])}
        possibleStringsArr.push(item);
      }
    }
    resultArr = possibleStringsArr.sort((a, b) => b.similarity - a.similarity)
    return(resultArr[0]);
  }
}

var arrangeBySimilarity = function(target, comparedArr) {
  if (typeof target != "string" || typeof comparedArr != "object") {
    return new Error("INVALID INPUTTYPE for arrangeBySimilarity");
  } else {
    var possibleStringsArr = [] , resultArr = [], count = 0;
    for (var i = 0; i < comparedArr.length; i++) {
      if (1) {
        count++;
        var item;
        item = { "_text" : comparedArr[i], "similarity" : diceCoefficient(target, comparedArr[i])}
        possibleStringsArr.push(item);
      }
    } // terminate for loop
    resultArr = possibleStringsArr.sort((a, b) => b.similarity - a.similarity)
    return(resultArr);
  }
}


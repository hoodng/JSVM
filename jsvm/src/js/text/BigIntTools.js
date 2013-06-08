/**
 * Copyright (c) Jinfonet Inc. 2000-2012, All rights reserved.
 * 
 * @File: BigIntTools.js
 * @Create: 2012/10/16 01:18:28
 * @Author: zhouhong.su@china.jinfonet.com
 */

$package("js.text");

/**
 * 
 */
js.text.BigIntTools = function(){
    var CLASS = js.text.BigIntTools,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;
    
    /**
     * parse the BigInt from string
     * @param str :   string which you want to parse BigInt
     * @return     :  BigInt (see js.text.BigInt.js)
     */
    thi$.parse = function(str){
        return this.parseBigInt( str );
    };
    
    /**
     * format the BigInt type to a String by pattern
     * @param obj :   BigInt (see js.text.BigInt.js)
     * @return     :  String
     */
    thi$.format = function(obj){
        if( !Class.isBigInt(obj) ) return NaN;
        
        var str = this.patternM.prefix.join("");
        str = str + _toString.call(this, obj);
        str = str + this.patternM.suffix.join(str);
        
        return str;
    };
    
    /**
     * Set the pattern which is used to format BigInt
     * @param pattern :  Like this "####", "#,###", "$##,#.00%" etc.
     */
    thi$.setPattern = function(pattern){
        if(pattern.replace(this.reg.all, "") !== "")
            throw "The pattern is illegal !";
        
        _initPatternM.call(this);
        
        var prePart = pattern.match(this.reg.prefix);
        var sufPart = pattern.match(this.reg.suffix);
        var middle = pattern.replace(this.reg.prefix,"");
        var fix = pattern.split(middle);
        middle = middle.replace(/,(?=.*,\.?[#|0])/g,"");
        middle = middle.replace(/,(?!\.?[#|0])/g,"");
        
        _preparePatternM.call(this, fix, middle);

    };
    
    var _preparePatternM = function(fix, middle){
        
        var allFix = fix.join("");
        var prefix = fix[0].replace("%","");
        var suffix = fix[fix.length - 1].replace("%","");
        
        if( allFix.indexOf("%") != -1 ){
            this.patternM.percent = true;
        }

        var c = middle.indexOf(","),
        d = middle.indexOf("."),
        cLen = middle.replace(".","").length,
        dLen = middle.replace(/.*\./,"").replace(/[^0]/g,"").length;
        if(c !== -1 && d !== -1){
            if(c < d){
                this.patternM.commaInterval = d - c - 1;
                this.patternM.decimal = dLen;
            }
            else{
                this.patternM.decimal = dLen;
            }
        }
        else if(c !== -1 && d === -1){
            this.patternM.commaInterval = cLen - c - 1;
        }
        else if(c ===-1 && d !== -1){
            this.patternM.decimal = dLen;
        }
        
        this.patternM.prefix.push(prefix);
        this.patternM.suffix.push(suffix);
    };
    
    //BigInt to format string
    var _toString = function(obj){
        
        var str = "", array, negative = obj.negative,
        c = this.patternM.commaInterval, d = this.patternM.decimal;
        
        array = this.patternM.percent ? [0,0].concat(obj.array) : obj.array;
        
        for(var i=array.length-1; i>-1; i--){
            if( (i+1)%c === 0 && i !== array.length - 1 && i !== 0){
                str += ",";
            }
            str += array[i];
        }
        
        if(d > -1){
            str += ".";
            for(var j = 0; j<d; j++){
                str += "0";
            }
        }
        
        if(this.patternM.percent){
            str += "%";
        }
        
        return str==="0" ? str
            : negative ? "-"+str : str;
    };
    
    thi$.parseBigInt = function( obj ){

        if( Class.isBigInt(obj) ){
            return obj;
        }
        else if( Class.isString(obj) ){
            obj.trim();
        }
        
        return new js.text.BigInt( obj );
    };
    
    /**
     * calculate by expression and variables
     * You can use this function by 3 forms:
     *     1: calculate( expression<string>, variable1, variable2..., variableN )
     *     2: calculate( expression<string>, {varName1:variable1, varName2:variable2... N} )
     *     3: calculate( expression<array> ) the expression is display by polish style
     * @param expression :String or array
     *        String like this: "(a+b)*c-d"
     *        array like this : ["-", ["*", ["+",a,b], c], d]
     * @return  :  BigInt (see js.text.BigInt)
     */
    thi$.calculate = function(expression){
        
        
        if(Class.typeOf(expression) === "array")  return _calculate.call(this, expression);
        if(Class.typeOf(expression) !== "string")  return NaN;
        
        var result = expression.replace(/\s/g,""), _expression;

        if(Class.typeOf(arguments[1]) === "object"){
            var params = arguments[1];
            for(var paramName in params){
                result = result.replace(new RegExp(paramName, "g"), params[paramName]);
            }
        }
        else if(arguments[1] !== undefined){
            
            var _caller = arguments.callee.caller;
            if(this.calMap[_caller] === undefined){
                // pattern: /\/\*(\*(?!\/)|[^\*])*\*\//g === pattern: /\/\*[\s\S]*?\*\//g
                var callerStr = _caller.toString().replace(/\/\*(\*(?!\/)|[^\*])*\*\//g,"");
                callerStr = callerStr.replace(/\/\/.*/g,"");
                callerStr = _findTopLevelNested.call(this, callerStr, "{", "}")[0].slice(1,-2);
                var func = _findFunction.call(this, callerStr);
                for(var i in func){
                    callerStr = callerStr.replace(func[i],"");
                }
                callerStr = callerStr.replace(/\s/g,"").match(/\.calculate\("[^"]*"(,\w+)+/g);
                this.calMap[_caller] = callerStr;
            }

            var calExp = this.calMap[_caller], temp, varList;
            
            for(var k = 0; k < calExp.length; k++){
                temp = calExp[k].replace(/\.calculate\(|\s/g,"").split(",");
                if(temp.shift().replace(/"/g,"") === result){
                    varList = [null].concat(temp);
                    calExp.splice(k,1);
                    break;
                }
            }

            if(arguments.length > 1){
                for(var i = 1, len = arguments.length; i< len; i++){
                    result = result.replace(new RegExp(varList[i], "g"), arguments[i]);
                }
            }
            
            if(this.calMap[_caller].length === 0){
                this.calMap[_caller] = undefined;
                delete this.calMap[_caller];
            }
            
        }

        result = _transToPolish.call(this, result);
        
        return _calculate.call(this, result);
    };
    
    //the expression is The Polish expression
    // like this ["+", a, b]
    var _calculate = function(expression){
        
        if(Class.typeOf(expression) === "string")  return this.parseBigInt(expression);
        if(expression.length < 3)  throw "The expression is not right!";
        
        var e0 = expression[0], e1 = expression[1];
        var ret = Class.typeOf(e1) === "array"?
            _calculate.call(this, e1) : e1 ;
        
        switch(e0){
        case "+":
            for(var i = 2, len = expression.length; i<len; i++){
                if( Class.typeOf(expression[i]) === "array"){
                    ret = this.plus(ret ,_calculate.call(this, expression[i]));
                }
                else{
                    ret = this.plus(ret, expression[i]);
                }
            }
            break;
        case "-":
            for(i = 2, len = expression.length; i<len; i++){
                if( Class.typeOf(expression[i]) === "array"){
                    ret = this.minus(ret ,_calculate.call(this, expression[i]));
                }
                else{
                    ret = this.minus(ret, expression[i]);
                }
            }
            break;
        case "*":
            for(i = 2, len = expression.length; i<len; i++){
                if( Class.typeOf(expression[i]) === "array"){
                    ret = this.multiply(ret ,_calculate.call(this, expression[i]));
                }
                else{
                    ret = this.multiply(ret, expression[i]);
                }
            }
            break;
        case "/":
            for(i = 2, len = expression.length; i<len; i++){
                if( Class.typeOf(expression[i]) === "array"){
                    ret = this.divid(ret ,_calculate.call(this, expression[i]));
                }
                else{
                    ret = this.divid(ret, expression[i]);
                }
            }
            break;
        default: break;
        }
        
        return ret;
    };
    
    var _transToPolish = function(expression){
        var s1 = [], s2 = [], temp, ret, _char, _number = "", k;
        
        for(var i = expression.length - 1; i > -1; i--){
            
            _char = expression.charAt(i);
            
            if(isNaN(+_char) && !_isNegative.call(this, _char, i, expression) && _char !== "."){
                
                if(_number !== ""){
                    s1.unshift(_number);
                    _number = "";
                }
                
                switch(_char){
                case "(":
                    k = 0;
                    while(true && k<100){
                        if(s2[0] === ")"){
                            s2.shift();
                            break;
                        }
                        else{
                            s1.unshift( [s2.shift(), s1.shift(), s1.shift()] );
                        }
                        k++;
                    }
                    break;
                case ")":
                    s2.unshift(_char);
                    break;
                case "*":
                case "/":
                    s2.unshift(_char);
                    break;
                case "+":
                case "-":
                    k = 0;
                    while(true && k<100){
                        if(s2[0] === "*" || s2[0] === "/"){
                            s1.unshift( [s2.shift(), s1.shift(), s1.shift()] );
                        }
                        else{
                            s2.unshift(_char);
                            break;
                        }
                        k++;
                    }
                    break;
                }
            }
            else{
                _number = _char + _number;
                if(i === 0)  s1.unshift(_number);
            }
            
        }
        
        i = 0;
        while(s2.length !== 0 && i<100){
            if(!ret){
                ret = [s2.shift(), s1.shift(), s1.shift()];
            }else{
                ret = [s2.shift(), ret, s1.shift()];
            }
            i++;
        }
        
        if(s1.length === 1)  return s1.shift();
        
        return ret;
    };
    
    var _isNegative = function(_char, index, expression){
        if(_char !== "-") return false;
        if(index === 0)  return true;
        
        var preChar = expression.charAt( index - 1 );
        
        if(preChar === "+" || preChar === "-" || preChar === "*" 
           || preChar === "/")  return true;
        
        return false;
    };
    
    var _findFunction = function(str){
        var ret = [], s = "\\\{", e = "\\\}";
        var func = "function.*\\\(.*\\\)";
        var pattern = s + "[^" + s + e + "]*" + e, flag = true, temp = [] , i = 0;
        
        while(flag){
            temp = str.match(new RegExp(func + pattern + ";?","g"));
            if(temp && temp.join("") !== ret.join("")){
                ret = temp;
                pattern = s + "([^" + s + e + "]|" + pattern + ")*" + e;
            }
            else{
                flag = false;
            }
        }
        
        return ret;
    };
    
    var _findTopLevelNested = function(str, startSymbol, endSymbol){
        var ret = [], reg = new RegExp(),
        s = _checkPattern(startSymbol), e = _checkPattern(endSymbol);
        var pattern = s + "[^" + s + e + "]*" + e, flag = true, temp = [] , i = 0;
        
        while(flag){
            reg.compile(pattern, "g");
            temp = str.match( reg );
            if(temp && temp.join("") !== ret.join("")){
                ret = temp;
                pattern = s + "([^" + s + e + "]|" + pattern + ")*" + e;
            }
            else{
                flag = false;
            }
        }
        
        return ret;
    };
    
    var _checkPattern = function(pattern){
        
        pattern = pattern.replace(/\\/g, "\\\\");
        pattern = pattern.replace(/\//g, "\\\/");
        pattern = pattern.replace(/\./g, "\\\.");
        pattern = pattern.replace(/\*/g, "\\\*");
        pattern = pattern.replace(/\+/g, "\\\+");
        pattern = pattern.replace(/\?/g, "\\\?");
        pattern = pattern.replace(/\$/g, "\\\$");
        pattern = pattern.replace(/\[/g, "\\\[");
        pattern = pattern.replace(/\]/g, "\\\]");
        pattern = pattern.replace(/\(/g, "\\\(");
        pattern = pattern.replace(/\)/g, "\\\)");
        pattern = pattern.replace(/\{/g, "\\\{");
        pattern = pattern.replace(/\}/g, "\\\}");
        
        return pattern;
    };
    
    /**/
    thi$.test = function(){
        var ret, tools = this ,v0 = 11111111, v1 = 2, time = 3;
        
        /* test time cost */
        var s = new Date(), e;
        for(var i = 0; i<1000; i++)
            ret = tools.calculate("(v0*time + v1)*((v0-v1)/time - v0)", v0, v1, time);
        e = new Date();
        System.out.println( ret + "" );
        System.out.println( e - s );
        
        s = new Date();
        for(i = 0; i<1000; i++)
            ret = tools.calculate("(v0*time + v1)*( (v0-v1)/time - v0)",{v0:v0,v1:v1,time:time});
        e = new Date();
        System.out.println( ret + "" );
        System.out.println( e - s );
        
        s = new Date();
        for(i = 0; i<1000; i++)
            ret = tools.calculate(["*",["+",["*",v0,time],v1],["-",["/",["-",v0,v1],time],v0]]);
        e = new Date();
        System.out.println( ret + "" );
        System.out.println( e - s );
        
        s = new Date();
        v0 = tools.parseBigInt(v0);
        for(i = 0; i<1000; i++)
            ret = v0.multiply(time).plus(v1).multiply(v0.minus(v1).divid(time).minus(v0));
        e = new Date();
        System.out.println( ret + "" );
        System.out.println( e - s );
        /**/
        
    };
    /**/
    
    /**
     * calculate like this: a+b
     * if you need more detail you can see js.text.BigInt.plus()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.plus = function(a, b){
        
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.plus(y);
    };
    
    /**
     * calculate like this: a-b
     * if you need more detail you can see js.text.BigInt.minus()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.minus = function(a, b){
        
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.minus(y);
    };
    
    /**
     * calculate like this: a*b
     * if you need more detail you can see js.text.BigInt.multiply()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.multiply = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.multiply(b);
    };
    
    /**
     * calculate like this: a/b
     * if you need more detail you can see js.text.BigInt.divid()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.divid = function(a, b){
        
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.divid(y);
    };
    
    /**
     * calculate like this: parseInt( a/b )
     * if you need more detail you can see js.text.BigInt.divisible()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.divisible = function(a, b){
        
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.divisible(y);
    };
    
    /**
     * calculate like this: a%b
     * if you need more detail you can see js.text.BigInt.mod()
     * @param a :   can be string or BigInt or Number
     * @param b :   can be string or BigInt or Number
     * @return  :  BigInt (see js.text.BigInt.js)
     */
    thi$.mod = function(a, b){
        
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        
        return x.mod(y);
    };
    
    thi$.round = function(obj){
        
        var o = this.parseBigInt(obj + "");
        
        return o.round();
    };
    
    thi$.floor = function(obj){
        
        var o = this.parseBigInt(obj + "");
        
        return o.floor();
    };
    
    thi$.ceil = function(obj){
        
        var o = this.parseBigInt(obj + "");
        
        return o.ceil();
    };
    
    /**
     * @param btArray : array like this 
     *                  [BigInt0,BigInt1, ..., BigIntn]
     *                  [str0,str1, ..., strn],  [0,1,2, ...., n]
     * @param desc    : false: sort by ascending   true: sort by descending
     * @return        : array by sort
     */
    thi$.sort = function(array, desc){
        
        var temp;
        for(var i = 0,j = array.length; i<j; i++){
            if( i === j-1){
                i = -1;
                j--;
                continue;
            }
            if( this.moreThan(array[i], array[i+1]) && !desc ){
                temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
            }
            else if( this.lessThan(array[i], array[i+1]) && desc ){
                temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
            }
        }
        
        return array;
    };
    
    thi$.a_LessThan_b = function(){
        System.err.println("This method is not deprecated!");
        this.lessThan();
    };

    thi$.a_MoreThan_b = function(){
        System.err.println("This method is deprecated!");
        this.moreThan();
    };
    
    thi$.a_Equals_b = function(){
        System.err.println("This method is deprecated!");
        this.equals();
    };
    
    thi$.a_LessOrEqual_b = function(){
        System.err.println("This method is deprecated!");
        this.lessOrEqual();
    };
    
    thi$.a_MoreOrEqual_b = function(){
        System.err.println("This method is deprecated!");
        this.moreOrEqual();
    };
    
    thi$.lessThan = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        return x.lessThan(b);
    };
    
    thi$.moreThan = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        return x.moreThan(b);
    };
    
    thi$.equals = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        return x.equal(b);
    };
    
    thi$.lessOrEqual = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        return x.lessOrEqual(b);
    };
    
    thi$.moreOrEqual = function(a, b){
        var x = this.parseBigInt(a),
        y = this.parseBigInt(b);
        return x.moreOrEqual(b);
    };
    
    var _initPatternM = function(){
        this.patternM = {
            prefix:[],
            commaInterval:0,
            decimal:-1,
            percent:false,
            suffix:[]
        };
    };
    
    thi$._init = function(pattern){
        
        this.reg = {
            prefix: /[^(#|0|,|\.)]*/g,
            suffix: /[^(#|0|,|\.)]*/g,
            middle: /[#|0|,]*\.?[#|0|,]*/,
            all:    /[^(#|0|,|\.)]*[#|0|,]*\.?[#|0|,]*[^(#|0|,|\.)]*/
        };
        this.calMap = {};
        _initPatternM.call(this);
        this.setPattern(pattern || "####");
        
    };
    
    this._init.apply(this, arguments);
};






/**
 *  
 */
js.text.BigInt = function( data ){
    
    var CLASS = js.text.BigInt,
    thi$ = CLASS.prototype;
    
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;
    
    var Class = js.lang.Class, System = J$VM.System;
    
    thi$.toString = function(){
        
        return this.valueOf();
        
    }.$override(this.toString);
    
    thi$.valueOf = function(){
        
        var str = "", array = this.array, negative = this.negative,
        decArray = this.decArray;
        
        for(var i=array.length-1; i>-1; i--){
            str += array[i];
        }
        
        if(decArray.length !== 0){
            str += ".";
            for(var j=decArray.length-1; j>-1; j--){
                str += decArray[j];
            }
        }

        return str==="0" ? str
            : negative ? "-"+str : str;
        
    }.$override(this.valueOf);
    
    thi$.parseBigInt = function(data){
        
        if(data === undefined){
            return new js.text.BigInt();
        }
        else if( Class.isBigInt(data) ){
            var _new = new js.text.BigInt();
            _new.array = data.array.slice();
            _new.decArray = data.decArray.slice();
            _new.negative = data.negative;
            return _new;
        }
        
        return new js.text.BigInt(data);
    };
    
    thi$.plus = function( b ){
        
        var x = this.parseBigInt(this),
        y = this.parseBigInt(b);
        var result = this.parseBigInt();
        
        /** for decimal support **/
        var decLength = 0,temp;
        if(x.isDecimal() || y.isDecimal()){
            decLength = Math.max(x.decArray.length, y.decArray.length);
            for(var i = 0; i < decLength; i++){
                temp = x.decArray.pop();
                x.array.unshift(temp ? temp : 0);
                temp = y.decArray.pop();
                y.array.unshift(temp ? temp : 0);
            }
            checkZero(x.array);
            checkZero(y.array);
        }
        /****/
        
        if(x.negative == y.negative){
            result.array = _plus(x.array, y.array);
            result.negative = x.negative;
        }
        else{
            if( a_LessThan_b(x.array, y.array) ){
                result.array = _minus(y.array, x.array);
                result.negative = y.negative;
            }
            else{
                result.array = _minus(x.array, y.array);
                result.negative = x.negative;
            }
        }
        
        /** for decimal support **/
        for(var j = 0, len = decLength; j < len; j++){
            temp = result.array.shift();
            result.decArray.push( temp?temp:0 );
        }
        if(result.array.length === 0)  result.array.push(0);
        checkDecArray.call(this, result.decArray);
        /****/
        
        return result;
    };
    
    // x: array y: array
    var _plus = function(x, y){

        var ret = [], carry = 0, sum;
        
        if(x.length < y.length){
            ret = _plus(y, x);
            return ret;
        }
        
        for(var i=0; i<y.length; i++){
            sum = x[i] + y[i] + carry;

            if(sum > 9){
                carry = 1;
                ret.push( sum-10 );
            }
            else{
                carry = 0;
                ret.push( sum );
            }
        }
        for( ; i<x.length; i++){
            sum = x[i] + carry;
            if(sum > 9){
                carry = 1;
                ret.push( sum-10 );
            }
            else{
                carry = 0;
                ret.push( sum );
            }
        }
        
        if(carry) ret.push(carry);
        
        checkZero(ret);
        
        return ret;

    };
    
    // a: BigInt b: BigInt calculate a-b
    thi$.minus = function(b){
        
        var y = this.parseBigInt( b + "" );
        
        y.negative = !y.negative;
        
        return this.plus(y);
    };
    
    // calculate x-y
    var _minus = function(x, y){
        var ret = [], borrow = false, _x, _y;
        
        for(var i = 0, len = y.length; i<len; i++){
            
            _x = borrow ? x[i]-1 : x[i] ;
            _y = y[i];
            
            if(_y > _x){
                borrow = true;
                ret.push( 10 + _x - _y );
            }
            else{
                borrow = false;
                ret.push( _x - _y );
            }
            
        }
        for( len = x.length; i<len ; i++){
            if(borrow){
                if(x[i] > 0){
                    borrow = false;
                    ret.push( x[i]-1 );
                }
                else{
                    borrow = true;
                    ret.push( 10 + x[i] - 1 );
                }
            }
            else{
                ret.push( x[i] );
            }
        }
        
        checkZero(ret);
        return ret;
    };
    
    thi$.multiply = function(b){
        
        var x = this.parseBigInt(this),
        y = this.parseBigInt(b);
        var result = this.parseBigInt(), 
        negative = x.negative == y.negative ? false : true;
        
        /** for decimal support **/
        var decLength = 0,temp;
        if(x.isDecimal() || y.isDecimal()){
            decLength = Math.max(x.decArray.length, y.decArray.length);
            for(var i = 0; i < decLength; i++){
                temp = x.decArray.pop();
                x.array.unshift(temp ? temp : 0);
                temp = y.decArray.pop();
                y.array.unshift(temp ? temp : 0);
            }
            checkZero(x.array);
            checkZero(y.array);
        }
        /****/
        
        if(a_MoreOrEqual_b(x.array, y.array)){
            result.array = _multiply(x.array, y.array);
        }
        else{
            result.array = _multiply(y.array, x.array);
        }
        
        /** for decimal support **/
        for(var j = 0, len = decLength*2; j < len; j++){
            temp = result.array.shift();
            result.decArray.push( temp?temp:0 );
        }
        if(result.array.length === 0)  result.array.push(0);
        checkDecArray.call(this, result.decArray);
        /****/
        
        result.negative = negative;
        return result;
    };
    
    var _multiply = function(x, y){
        
        var array = [0], innerArray, temp, carry = 0;
        
        for(var i = 0; i<y.length; i++){
            
            innerArray = [];
            if(y[i] === 0) continue;
            
            for(var k = 0; k<i ; k++){
                innerArray.push(0);
            }
            for(var j = 0; j<x.length; j++){
                temp = y[i]*x[j] + carry;
                if( temp>9 ){
                    carry = parseInt(temp/10, 10);
                    innerArray.push( temp%10 );
                }
                else{
                    carry = 0;
                    innerArray.push(temp);
                }
            }
            if(carry){
                innerArray.push(carry);
                carry = 0;
            }
            array = _plus(array, innerArray);
            
        }
        
        return array;
    };
    
    thi$.divid = function(b){
        var y = this.parseBigInt(b);
        
        if( isZero(this) && isZero(y) )  return NaN;
        if( isZero(y) )
            return !this.negative === y.negative 
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY;
        if( isZero(this) ) return this.parseBigInt(0);
        
        var result = this.divid_mod(y), modStr = result.mod.toString(),
        x = result.mod;
        
        /** for decimal support **/
        var decLength = 0,temp;
        if(x.isDecimal() || y.isDecimal()){
            decLength = Math.max(x.decArray.length, y.decArray.length);
            for(var i = 0; i < decLength; i++){
                temp = x.decArray.pop();
                x.array.unshift(temp ? temp : 0);
                temp = y.decArray.pop();
                y.array.unshift(temp ? temp : 0);
            }
            checkZero(x.array);
            checkZero(y.array);
        }
        /****/
        
        if( modStr !== "0"){
            
            var decPart = this.parseBigInt( x + "0000000000000000" );
            
            temp = decPart.divisible(y).array;
            
            for(var i = 0,len = temp.length; i < 16 - len; i++){
                temp.push(0);
            }
            
            result.ret.decArray = temp;
            checkDecArray.call(this, result.ret.decArray);
        }
        
        return result.ret;
    };
    
    thi$.divisible = function(b){
        return this.divid_mod(b).ret;
    };
    
    thi$.mod = function(b){
        return this.divid_mod(b).mod;
    };
    
    thi$.divid_mod = function(b){
        
        var x = this.parseBigInt(this),
        y = this.parseBigInt(b);
        var result, mod, negative, flag = true;
        
        /** for decimal support **/
        var decLength = Math.max(x.decArray.length, y.decArray.length), temp;
        if(x.isDecimal() || y.isDecimal()){
            for(var i = 0; i < decLength; i++){
                temp = x.decArray.pop();
                x.array.unshift(temp ? temp : 0);
                temp = y.decArray.pop();
                y.array.unshift(temp ? temp : 0);
            }
            checkZero(x.array);
            checkZero(y.array);
        }
        /****/
        
        if(x.negative == y.negative){
            negative = false;
        }
        else{
            negative = true;
        }
        
        if( isZero(x) && isZero(y) )  return {ret:NaN, mod:NaN};
        if( isZero(y) ) 
            return negative? {ret:Number.NEGATIVE_INFINITY, mod:NaN}
        : {ret:Number.POSITIVE_INFINITY, mod:NaN} ;
        if( isZero(x) ) return {ret:this.parseBigInt(0), mod:this.parseBigInt(0)};
        
        if( a_LessThan_b(x.array, y.array) ){
            result = this.parseBigInt("0");
            result.negative = negative;
            mod = this.parseBigInt(x.toString());
        }
        else{
            
            var xObj, xArray = x.array.slice();
            var index, length, yLength = y.array.length, dividRet;
            result =  this.parseBigInt();
            
            //flag = false;
            while(flag){
                
                if(mod){
                    xArray = xArray.concat( mod );
                    length = mod.length + 1;
                }
                else{
                    length = 1;
                }
                
                index = xArray.length - length;
                
                if(index < 1){
                    flag = false;
                    dividRet = _divid(xArray, y.array);
                    result.array.unshift( dividRet.ret );
                    mod = this.parseBigInt( dividRet.mod.reverse().join("") );
                    mod.negative = negative;
                    continue;
                }
                else{
                    xObj = xArray.splice(index, length);
                    dividRet = _divid(xObj, y.array);
                    mod = dividRet.mod.length == 1 && dividRet.mod[0] === 0 ? undefined 
                        : dividRet.mod ;
                    result.array.unshift( dividRet.ret );
                }

            }
            
            result.negative = negative;
        }
        
        /** for decimal support **/
        for(var j = 0, len = decLength; j < len; j++){
            temp = mod.array.shift();
            mod.decArray.push( temp?temp:0 );
        }
        if(result.array.length === 0)  result.array.push(0);
        checkDecArray.call(this, mod.decArray);
        /****/
        
        checkZero(result.array);
        
        return {ret:result, mod: mod};
        
    };
    
    var _divid = function(x, y){

        var result = { ret:0, mod:[0] },
        temp = x, flag = true;
        
        //flag = false;
        while(flag){
            if( a_LessThan_b(temp, y) ){
                flag = false;
                result.mod = isZero(temp) ? result.mod : temp;
            }
            else{
                temp = _minus(temp, y);
                result.ret++;
            }
        }
        
        return result;
    };
    
    thi$.round = function(){
        
        if(this.decArray.length === 0) return this;
        
        var round = [];
        
        for(var i = 0; i < this.decArray.length; i++){
            if(i === 0){
                round.unshift(5);
                continue;
            }
            round.unshift(0);
        }
        
        if( !this.negative && a_MoreOrEqual_b( this.decArray, round) ){
            this.array = _plus(this.array, [1]);
        }
        else if( this.negative && a_MoreThan_b( this.decArray, round) ){
            this.array = _plus(this.array, [1]);
        }
        //this.decArray.splice(0);
        this.decArray = [];
        
        return this;
    };
    
    thi$.floor = function(){
        
        if(this.decArray.length === 0) return this;
        
        if(this.decArray.length !== 0 && this.negative){
            this.array = _plus(this.array, [1]);
        }
        
        //this.decArray.splice(0);
        this.decArray = [];
        return this;
    };
    
    thi$.ceil = function(){
        
        if(this.decArray.length === 0) return this;
        
        if(this.decArray.length !== 0 && !this.negative){
            this.array = _plus(this.array, [1]);
        }
        
        //this.decArray.splice(0);
        this.decArray = [];
        return this;
    };
    
    thi$.lessThan = function(b){
        var x = this,
        y = this.parseBigInt(b);
        
        if(y.negative < x.negative){
            return true;
        }
        else if(y.negative > x.negative){
            return false;
        }

        switch(arrayComparison(x.array, y.array)){
        case 0:
            return x.negative ? false : true;
        case 1:
            return false;
        case 2:
        default:
            return x.negative ? true : false;
        }
    };
    
    thi$.equal = function(b){
        var x = this,
        y = this.parseBigInt(b);
        return x.negative === y.negative && a_Equals_b(x.array, y.array);
    };
    
    thi$.moreThan = function(b){
        return !this.lessThan(b) && !this.equal(b);
    };
    
    thi$.lessOrEqual = function(b){
        return !this.moreThan(b);
    };
    
    thi$.moreOrEqual = function(b){
        return !this.lessThan(b);
    };
    
    var isZero = function(a){
        return a.toString() === "0";
    };
    
    // a: array b: array
    var a_LessThan_b = function(a, b){
        return !(arrayComparison(a, b) && true);
    };
    
    var a_Equals_b = function(a, b){
        return arrayComparison(a, b) === 1;
    };
    
    var a_MoreThan_b = function(a, b){
        return arrayComparison(a, b) === 2;
    };
    
    var a_LessOrEqual_b = function(a, b){
        return !a_MoreThan_b(a,b);
    };
    
    var a_MoreOrEqual_b = function(a, b){
        return !a_LessThan_b(a,b);
    };
    
    //@return   0: x<y,    1: x=y,     2: x>y
    var arrayComparison = function(x, y){
        
        var arrayA = x,arrayB = y,
        aLen = arrayA.length, bLen = arrayB.length;
        
        if(aLen > bLen){
            return 2;
        }
        else if(aLen < bLen){
            return 0;
        }
        
        //aLen == bLen
        for(var i = aLen - 1; i > -1; i--){
            if(arrayA[i] < arrayB[i]){
                return 0;
            }
            else if(arrayA[i] > arrayB[i]){
                return 2;
            }
        }

        // a == b
        return 1;
    };
    
    var createBigInt = function(str){
        
        var ret = this, i = 0;
        var arr = str.split("."), intArr = arr[0],
        decArr = arr.length > 1 ? arr[1] : [];
        
        if(intArr.charAt(0) == "-"){
            i = 1;
            ret.negative = true;
        }
        //make integer array
        for(var len = intArr.length; i<len; i++){
            ret.array.unshift( +intArr.charAt(i) );
        }
        
        //make decimal array
        if(decArr.length !== 0){
            for(var j = 0; j < decArr.length; j++){
                ret.decArray.unshift( +decArr.charAt(j) );
            }
        }
        
        checkZero(ret.array);
        checkDecArray.call(this, ret.decArray);
        
        return ret;
        
    };
    
    var isNeed2BigInt = function(str){
        return str.length > 15;
    };
    
    var checkZero = function(array){
        var flag = true;
        for(var i = array.length - 1; i>0; i--){
            if(flag && array[i] !== 0){
                flag = false;
            }
            if(flag){
                array.pop();
            }
        }
    };
    
    var checkDecArray = function(decArray){
        var decLen = decArray.length;
        
        if(decLen > this.decMaxLen)  decArray.splice(0, decLen - this.decMaxLen);
        
        decLen = decArray.length;
        for(var i = 0; i < decLen; ){
            if(decArray[i] !== 0) break;
            decArray.shift();
        }
    };
    
    thi$.isDecimal = function(){
        return this.decArray.length !== 0;
    };
    
    thi$.isDecMaxLen = function(){
        return this.decArray.length === this.getDecMaxLen();
    };
    
    thi$.getDecMaxLen = function(){
        return this.decMaxLen;
    };
    
    thi$._init = function(data){
        
        this.array = [0];
        this.decArray = []; // decimal part
        this.decMaxLen = 16;
        this.negative = false;
        this.pattern = "####";
        this.objTypeIsBigIntType = true;
        
        if(!data) return;
        
        switch(Class.typeOf(data)){
        case "string":
            if( Class.isNumber(+data) ){
                createBigInt.call(this, data);
            }
            else{
                throw "This data type can not parse to BigInt type.";
            }
            break;
        case "number":
            createBigInt.call(this, "" + data);
            break;
        default:
            throw "This data type can not parse to BigInt type.";
        }
        
    };
    
    this._init.apply(this, arguments);
    
}.$extend(js.lang.Object);

js.text.BigIntTools.BigInt = js.text.BigInt;

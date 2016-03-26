/**
 * Author: mucong.zhao
 */

$package("js.util");

/**
 * When window has no sessionStorage or localStorage, we use a
 * memory storage instead.
 */
$import("js.util.HashMap");

js.util.StringBreaker = function(){
    var CLASS = js.util.StringBreaker, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;
    var C = js.lang.Class,DOM = J$VM.DOM;
    
    /**
     * Original String
     */
    this.orgString;
    
    /**
     * String styles
     */
    this.styles;
    
    /**
     * css font string for calculate string size.
     */
    this.cssFont;
    
    /**
     * boolean , cutWithEllipsis
     */
    this.cutWithEllipsis;
    
    /**
     *   {
     *     'pre' : the pre block
     *     'next' : the next block
     *     'str' : block string
     *     'cwArray' :  each char width in array
     *     'w' : width,
     *     'h' : height,
     *     'type' : 's'(normal string), 'b'(white space), 't'(tab), 'r'(enter)
     *     'isE' : boolean , is english
     *   }
     */
    this.firstBlock;
    
    /**
     * String max height
     */
    this.custMaxHeight;
    
    /**
     * the width of "."
     */
    this.singleEllipsisW;
    
    /**
     * the max char width
     */
    this.maxCharWidth;
    
    /**
     * is String Cut
     */
    this.isStrCut;
    
    /**
     * 
     */
    this.isWholeBlank;
    
    /**
     * All English characters.
     */
    var EC = {'A':true,'B':true,'C':true,'D':true,'E':true,'F':true,'G':true,'H':true,'I':true,'J':true,'K':true,'L':true,'M':true,'N':true,'O':true,'P':true,'Q':true,'R':true,'S':true,'T':true,'U':true,'V':true,'W':true,'X':true,'Y':true,'Z':true,
              'a':true,'b':true,'c':true,'d':true,'e':true,'f':true,'g':true,'h':true,'i':true,'j':true,'k':true,'l':true,'m':true,'n':true,'o':true,'p':true,'q':true,'r':true,'s':true,'t':true,'u':true,'v':true,'w':true,'x':true,'y':true,'z':true,
              '0':true,'1':true,'2':true,'3':true,'4':true,'5':true,'6':true,'7':true,'8':true,'9':true,
              '`':true,'~':true,'!':true,'@':true,'#':true,'$':true,'%':true,'^':true,'&':true,'*':true,'(':true,')':true,'-':true,'_':true,'=':true,'+':true,'[':true,']':true,'{':true,'}':true,'\\':true,'|':true,';':true,':':true,'\'':true,'"':true ,',':true,'<':true,'>':true,'.':true,'/':true,'?':true};
    
    /**
     * Re-calculate break info by new string information
     */
    thi$.refreshBreakInfo = function() {
        this.cssFont = this.getCSSFont(this.styles);
        this.maxCharWidth = this.getStringSize("R", this.styles, this.cssFont).width;
        this.singleEllipsisW = this.getStringSize(".", this.styles, this.cssFont).width;
        this.firstBlock = undefined;
        this.custMaxHeight = 0;
        this.fillBlockChain();
        this.isStrCut = false;
    };
    
    /**
     * @param str String, the text
     * @param firstLineWidth int, the width of first line, it may have some indent of first line.
     *            if not specify, it will be as same as width.
     * @param width int, the break width.
     * @param height int, the usable height.
     * @return Array, the element is Object 
     * [
     *   {
     *     str : the element string
     *     w : the width of string
     *     h : the height of string
     *     isStop : boolean, the whole word in this line but it can't display complete.
     *     cutInex : if isStop, the index that cut begin.
     *   }
     * 
     * ]
     */
    thi$.doBreak = function(firstLineWidth, firstLineHeight, width, height) {
        if (height == undefined || isNaN(height)) {
            height = 999999;
        }
        /* handle invalid space */
        firstLineWidth = Math.max(0,firstLineWidth);
        width = Math.max(0, width);
        var rst = {};
        var blocks = [];
        rst.blocks = blocks;
        /* handle invalid string */
        if (this.orgString === undefined || this.orgString == "" ) {
            return rst;
        }
        /* small width */
        if (width < this.maxCharWidth) {
            return rst;
        }
        var lineStr = "";
        var lineW = 0;
        var curBlock = this.firstBlock;
        var isBrokeFirst = true;
        var usableWidth = firstLineWidth;
        var breakInfo;
        var preBreakInfo;
        while(curBlock) {
        	if (lineW + curBlock.w <= usableWidth) {
        	    // the current str can put into current line
        	    lineStr += curBlock.str;
        	    lineW += curBlock.w;
        	} else {
        	    if (_getBlocksHeight(rst.blocks) + this.custMaxHeight > height) {
        	        _dockLastBreakerWhenNoVerSpace.call(this, rst, lineStr);
        	        break;
        	    } else {
        	        // can do line break
        	        if (lineStr == "" && usableWidth == width) {
        	            // first whole blank line
        	        } else {
        	            var removeInfo = {
        	                'str' : lineStr,
        	                'removeW' : 0
        	            };
        	            if (!this.isWholeBlank) {
        	                removeInfo = this.removeWhiteSpace(lineStr, true);
        	            }
        	            var block = {
	        	            str : removeInfo.str,
	            	        w : lineW - removeInfo.removeW,
	            	        h : this.custMaxHeight,
	            	        usableW : usableWidth - lineW
            	        };
            	        blocks.push(block);
        	        	rst = {
        	        			isStrCut:this.isStrCut,
        	        			blocks:blocks
                    	};
        	        	
        	        }
        	        if (isBrokeFirst) {
        	            if (blocks.length > 0 && blocks[0].str == "") {
        	                blocks[0].w = firstLineWidth;
        	                blocks[0].isSpace = true;
        	            }
            	        isBrokeFirst = false;
            	        usableWidth = width;
            	    }
//            	    lineStr = "";
//    	            lineW = 0;
    	            // there is enough vertical space but no hor space for one word.
        	        if (usableWidth < curBlock.w && curBlock.type == 's' && curBlock.cwArray.length > 1) {
        	        	//cut string block when string block overtop usableWidth
                        curBlock = _cutStrBlockToEllips.call(this,curBlock,usableWidth);
            	        continue;
            	    } else {
                        //avoid blank space at the front of line.
            	        lineStr = curBlock.str;
            	        lineW = curBlock.w;
            	    }
        	    }
        	}
        	curBlock = curBlock.next;
        }
        if (lineW > 0) {
            if (_getBlocksHeight(rst.blocks) + this.custMaxHeight > height) {
    	        _dockLastBreakerWhenNoVerSpace.call(this, rst, lineStr);
    	    } else {
               	var removeInfo = {
	                'str' : lineStr,
	                'removeW' : 0
	            };
	            if (!this.isWholeBlank) {
	                removeInfo = this.removeWhiteSpace(lineStr, true);
	            }
	        	var block = {
        	            str : removeInfo.str,
            	        w : lineW - removeInfo.removeW,
            	        h : this.custMaxHeight,
            	        usableW : usableWidth - lineW
            	        };
        	    blocks.push(block);
    	    	rst = {
    	    			isStrCut:this.isStrCut,
	        			blocks:blocks
            	};
            }
        }
        if (firstLineHeight != undefined && !isNaN(firstLineHeight) && rst.blocks.length > 1) {
            rst[0].h = firstLineHeight;
        }
        /* check if there is blank line */
        rst.blocks = _removeBlankLine(rst.blocks)
        return rst;
    };
    
    /**
     * @return Object
     *  {
     *    str : 
     *    removedW :
     *  }
     */
    thi$.removeWhiteSpace = function(str, left, right) {
        var rst = {};
        if (str.match(/\S/) == null) {
            rst.str = "";
            rst.removeW = this.singleEllipsisW * str.length;
            return rst;
        }
        var matchObj;
        if (left) {
            matchObj = str.match(/^\s*/g);
            if (matchObj != null) {
                rst.str = str.replace(/^\s*/g,"");
                rst.removeW = this.singleEllipsisW * matchObj[0].length;
            }
        }
        if (right) {
            matchObj = str.match(/\s*$/g);
            if (matchObj != null) {
                rst.str = str.replace(/\s*$/g,"");
                rst.removeW = this.singleEllipsisW * matchObj[0].length;
            }
        }
        return rst;
    };
    
    /**
     * @return {
     *   str : 
     *   w :
     * }
     */
    thi$.getFitWidthStrInfo = function(w, str, styles, cssFont) {
        w = Math.floor(w);
        var rst = "";
        var realW = 0;
        for(var i=0, leni=str.length; i<leni; i++){
        	var c = str.charAt(i);
        	var sizeInfo = this.getStringSize(c, styles, cssFont);
        	if (realW + sizeInfo.width > w) {
        	    break;
        	}
        	rst += c;
        	realW += sizeInfo.width;
        }
        return {'str' : rst , 'w' : realW};
    };
    
    /**
     * 
     */
    thi$.fillBlockChain = function() {
        this.custMaxHeight = 0;
        var oneChar;
        var info;
        var tempStr = "";
        var curBlock = undefined;
        if (this.orgString.match(/\S/) == null) {
            this.isWholeBlank = true;
        } else {
            this.isWholeBlank = false;
        }
        for(var i=0, leni=this.orgString.length; i<leni; i++){
        	oneChar = this.orgString.charAt(i);
        	if (_isBlockChar(oneChar)) {
        	    if (tempStr.length > 0) {
        	        var preChar = tempStr.charAt(tempStr.length-1);
        	        if (preChar == oneChar) {
        	            //temp str has same block chart
        	            tempStr += oneChar;
        	        } else {
        	            //finish before temp str, new one temp str with block char
        	            curBlock = _createBlockInfo.call(this, tempStr, curBlock);
        	            this.custMaxHeight = Math.max(this.custMaxHeight, curBlock.h);
        	            tempStr = oneChar;
        	        }
        	    } else {
        	        //first block chart
        	        tempStr = oneChar;
        	    }
        	} else {
        	    // current char is not block char
        	    if (tempStr.length > 0) {
        	        var preChar = tempStr.charAt(tempStr.length-1);
        	        if (_isBlockChar(preChar)) {
        	            // the pre str is blcok char
        	            //finish before temp str, new one temp str with block char
        	            curBlock = _createBlockInfo.call(this, tempStr, curBlock);
        	            this.custMaxHeight = Math.max(this.custMaxHeight, curBlock.h);
        	            tempStr = oneChar;
        	        } else {
        	            tempStr += oneChar;
        	        }
        	    } else {
        	        tempStr += oneChar;
        	    }
        	}
        }
        if (tempStr.length > 0) {
        	curBlock = _createBlockInfo.call(this, tempStr, curBlock);
            this.custMaxHeight = Math.max(this.custMaxHeight, curBlock.h);
        }
    };
    
    var _getBlocksHeight = function(blocks) {
        var rst = 0;
        for(var i=0, leni=blocks.length; i<leni; i++){
        	var block = blocks[i];
        	if (block.w != 0){
        	    rst += block.h;
        	} else if (block.w == 0 && block.usableW == 0 && block.str == "") {
        	    // break line, there is no any space in first line
        	    rst += block.h;
        	}
        }
        return rst;
    };
    
    var _removeBlankLine = function(rst, width) {
        var newRst = [];
        for(var i=0, leni=rst.length; i<leni; i++){
        	var block = rst[i];
        	if (block.w != 0) {
        	    newRst.push(block);
        	} else if (block.w == 0 && block.usableW == 0 && block.str == "") {
        	    // break line, there is no any space in first line
        	    newRst.push(block);
        	}
        }
        return newRst;
    };
    
    /**
     * line break but no enough space
     * if we create new breaker but the breaker height is great than height, it will handle cut logic
     * current condition is: there no enough space to create new breaker.
     * but we will chect the space in pre breaker, and put current block str to the space.
     */
    var _dockLastBreakerWhenNoVerSpace = function(breakers, lineStr) {
        if (breakers.length > 0) {
            var preBreakInfo = breakers[breakers.length -1];
            if (false){//(this.cutWithEllipsis) {
                // handle ellipsis logic
                if (preBreakInfo.usableW > this.singleEllipsisW*3) {
                    // there is enough sapce for "..."
                    // cutIndex-3 mesns reserve space for "..."
                    var cuttedStr = lineStr.substring(0, cutIndex-3+1);
                    cuttedStr += "...";
                    preBreakInfo.str += cuttedStr;
                } else {
                    // there is no enough space for ellipsis cut in preBlock space, so we should cut pre block str  
                    _dockEllipsis(preBreakInfo);
                }
                this.isStrCut = true;
            } else {
                // put current block str to the end of pre break directly
            	// see _dockLastBrekerDirect()
            }
        }
    };
    
    /**
     * line break but no enough space
     * put current block str to the end of pre break directly
     */
    var _dockLastBrekerDirect = function(breakers, lineStr){
		var fitWidthStrInfo = this.getFitWidthStrInfo(preBreakInfo.usableW, lineStr, this.styles, this.cssFont);
		preBreakInfo.str += fitWidthStrInfo.str;
		preBreakInfo.w += fitWidthStrInfo.w;
		preBreakInfo.usableW -= fitWidthStrInfo.w;
    }
    
    /**
     * 
     */
    var _dockEllipsis = function(blockInfo) {
        var usableW = blockInfo.usableW;
        var str = blockInfo.str;
        var ell="";
        var i = 0;
        while (usableW > this.singleEllipsisW) {
        	 ell+='.';
        	 i++;
        	 usableW -= this.singleEllipsisW;
        }
        while(i <=3) {
            if (str.length >0) {
                str = str.substring(0, str.length-1);
            }
            ell+='.';
        	i++;
        }
        blockInfo.str = str + ell;
        blockInfo.w += usableW;
    };
    
    /**
     * Cut String Block To Ellips String
     * To cut string chcaracters when usebaleWidth is not enough
     * Algorithm: Compare to string space be able to put in each single line while usableWidth is enough
     * cut to extra chars with overtop the userbleWidth 
     * put '...' at the end of chars
     * @return String
     */
    var _cutStrBlockToEllips = function(block,usableWidth) {
        var str = block.str;
        var strW = 0;
        var cSpcElips;//save char space for ellipse
        var cwArray = block.cwArray;
        var iSpace = 0;
        var useableWidth = usableWidth;
        var cutIndex = 0;
        var ellipseW = this.singleEllipsisW*3
        var cutFlag=true;
        
        iSpace = cwArray[cutIndex];
        //add iSpace(chars space) 
        while(iSpace <= useableWidth){
        	cutIndex = cutIndex + 1;
        	iSpace+=cwArray[cutIndex];
        }
        //get cutString width
        //1. iSpace > useableWidth means overlap one more time to add cutIndex&iSpace
        if(iSpace > useableWidth){
        	strW = iSpace - cwArray[cutIndex];
        	cutIndex--;
        }else{
        	strW = iSpace;
        }
        this.isStrCut = true;
        
        if (this.cutWithEllipsis) {
            // handle ... logic
            if(strW-cwArray[0] < ellipseW){
                //no enough space put '...', returen blank
            	block.str = "";
            	block.w = strW;
            }else{
            	//get end char size from cutString 
            	cSpcElips = cwArray[cutIndex];
            	//if end char no more space size put '...', it will go to previous char
            	while(cSpcElips < ellipseW){
            		cSpcElips+=cwArray[--cutIndex];
            	}
                var reStr = str.substr(0,cutIndex);
                reStr += '...';
                block.str = reStr;
                block.w = strW;
            }
        } else {
            // keep string after cut
            var reStr = str.substr(0,cutIndex);
            block.str = reStr;
            block.w = strW;
        }
        return block;
    }
    
    /**
     *  UnPack String Block To Ellips
     *
     */
    var _unPackStrBlockToEllips = function(block,usableWidth) {
        var str = block.str;
        var cwArray = block.cwArray;
        var firstB;
        var endB;
        var preBlock;
        var iSpace = 0;
        var useableWidth = usableWidth;
        var cutIndex;
        var cutFlag=true;
        var replaceNode;
        for(cutIndex=0,iSpace=cwArray[cutIndex];iSpace<useableWidth;cutIndex++){
            iSpace+=cwArray[cutIndex];
        }
        if(cutIndex-- <= 2){
        	block.str = "";
        	block.w = 0;
            return block;
        }else{
            for(var i=0,iSpace=cwArray[i]; iSpace < useableWidth;i++){
                var cblock = {
                    'str' : str.charAt(i),
                    'cwArray' : [cwArray[i]],
                    'w' : cwArray[i],
                    'h' : block.h,
                    'type' : block.type,
                    'isE' : block.isE
                }
                if (preBlock) {
                    preBlock.next = cblock;
                    cblock.pre = preBlock;
                }
                preBlock = cblock;
                if (i == 0) {
                    firstB = cblock;
                }
                //if (iSpace == 20 || iSpace == 17) {
                endB = cblock;
                //}
                iSpace += cwArray[i+1];
            }
            replaceNode = endB;
            replaceNode.str = '.';
            replaceNode.w = this.singleEllipsisW;
            replaceNode = replaceNode.pre;
            replaceNode.str = '..';
            replaceNode.w = this.singleEllipsisW;
            firstB.pre = block.pre;
            if (firstB.pre) {
                firstB.pre.next = firstB;
            }
            endB.next = block.next;
            if (endB.next) {
                endB.next.pre = endB;
            }
            return firstB;
        }
        
    }
   
    /**
     * unPack Str Block To Char Block and insert new blocks to str position
     */
    var _unPackStrBlockToCharBlock = function(block) {
        var str = block.str;
        var cwArray = block.cwArray;
        var firstB;
        var endB;
        var preBlock;
        for(var i=0, leni=cwArray.length; i<leni; i++){
            var cblock = {
                'str' : str.charAt(i),
                'cwArray' : [cwArray[i]],
                'w' : cwArray[i],
                'h' : block.h,
                'type' : block.type,
                'isE' : block.isE
            }
            if (preBlock) {
                preBlock.next = cblock;
                cblock.pre = preBlock;
            }
            preBlock = cblock;
            if (i == 0) {
                firstB = cblock;
            }
            if (i == cwArray.length-1) {
                endB = cblock;
            }
            
        }
        firstB.pre = block.pre;
        if (firstB.pre) {
            firstB.pre.next = firstB;
        }
//        block.pre = undefined;
        
        endB.next = block.next;
        if (endB.next) {
            endB.next.pre = endB;
        }
//		block.next = undefined;
        this.isStrCut = true;
        return firstB;
    };
    
    /**
     * 
     */
    var _getCutIndex = function(blockInfo, uasbleW) {
        var cwArray = blockInfo.cwArray;
        var curW = 0
        var index = -1;
        for(var i=0, leni=cwArray.length; i<leni; i++){
        	curW += cwArray[i]
        	if (curW > uasbleW) {
        	    break;
        	}
        	index = i;
        }
        return index;
    };
    
    /**
     * 'type' : 's'(normal string), 'b'(white space), 't'(tab), 'r'(enter)
     */
    var _getChartType = function(c) {
        var rst;
        switch (c) {
        	case ' ':
        		rst = 'b';
        		break;
        	case '\t':
        		rst = 't';
        		break;
        	case '\r':
        		rst = 'r';
        		break;
        	default:
        		rst = 's';
        }
        return rst;
    };
    
    var _createBlockInfo = function(str, preBlock){
        /* for calculate size, replace white space to '.' */
        var newStr = str.replace(/ /g , '.');
        var firstChart = str.charAt(0);
        var maxHeight = 0;
        var totalW = 0;
        var c;
        var sizeInfo;
        var cwArray = [];
        for(var i=0, leni=str.length; i<leni; i++){
        	c = str.charAt(i);
        	sizeInfo = this.getStringSize(c, this.styles, this.cssFont);
        	cwArray.push(sizeInfo.width);
        	maxHeight = Math.max(sizeInfo.height, maxHeight);
        	totalW += sizeInfo.width;
        }
        var rst = {
            'str' : str,
            'cwArray' : cwArray,
            'w' : totalW,
            'h' : maxHeight,
            'type' : _getChartType(firstChart),
            'isE' : _isEnglish(firstChart)
        };
        if (preBlock) {
            preBlock.next = rst;
            rst.pre = preBlock;
        }
        if (this.firstBlock == undefined) {
            this.firstBlock = rst;
        }
        return rst;
    };
    
    /**
     * If Browser can support Canvas, it will use canvas to measure text size.
     * else it will use dom.
     */
    thi$.getStringSize = function(str , styles, cssFont) {
        if (J$VM.supports.canvas) {
            var rst = {};
            var canvas = document.getElementById("calSizeCanvas");
            if (canvas == undefined) {
                canvas = document.createElement("Canvas");
                canvas.id = 'calSizeCanvas';
    		    canvas.style.visibility = 'hidden';
    		    canvas.style.width = '0px';
    		    canvas.style.height = '0px';
    		    DOM.appendTo(canvas, document.body);
            }
            var ctx=canvas.getContext("2d");
            var fontInfo = cssFont;
            if (fontInfo == undefined) {
                fontInfo = this.getCSSFont(styles);
            }
            ctx.font = fontInfo.css;
            rst.width = ctx.measureText(str).width;
            rst.height = fontInfo.intFontSize + 3;
            return rst;
        } else {
            return DOM.getStringSize(str, styles);
        }
    };
    
    /**
     * 
     */
    thi$.getCSSFont = function(styles) {
        var fontFamily = styles.fontFamily || 'Arial';
        var fontVariant = styles.fontVariant || 'normal';
        var fontSize = (styles.fontSize === undefined) ? '12px' : styles.fontSize;
        var intFontSize = parseInt(fontSize.replace('px', ''));
        var fontStyle = styles.fontStyle || 'normal';
        var fontWeight = styles.fontWeight || 'normal';
        var font = new (C.forName('js.awt.Font'))(fontFamily, fontSize, fontStyle, fontWeight, fontVariant);
        return {
            css : font.toString(),
            intFontSize : intFontSize
        };
    };
    
    /**
     * 
     */
    var _isEnglish = function(c) {
        if (EC[c] !== undefined) {
            return EC[c];
        } else {
            return false;
        }
    };
    
     var _isBlockChar = function(c) {
         if (!_isEnglish(c)) {
             return true;
         } else {
             if (c.match(/\s/)) {
                 return true;
             } else {
                 return false;
             }
         }
     };
};


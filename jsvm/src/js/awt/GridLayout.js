/**

 Copyright 2010-2011, The JSVM Project. 
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without modification, 
 are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice, 
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice, 
 this list of conditions and the following disclaimer in the 
 documentation and/or other materials provided with the distribution.
 
 3. Neither the name of the JSVM nor the names of its contributors may be 
 used to endorse or promote products derived from this software 
 without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.

 *
 * Author: Lv xianhao
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 * 
 * Jul 1, 2012: Rewrote layout algorithm by Hu Dong by introduce js.awt.Grid class 
 */

$package("js.awt");

/**
 * A Grid layout lays out a container's components in a rectangular grid. 
 * The container is divided into many rectangles, and one component is placed 
 * in each rectangle. 
 * 
 * @param def :{
 *     classType : the layout class
 *     rowNum: m,
 *     colNum: n,
 *     rows:[{index, measure, rigid, weight, visible},{}...],
 *     cols:[{index, measure, rigid, weight, visible},{}...],
 *     cells:[
 *       {rowIndex, colIndex, rowSpan, colSpan, paddingTop...},
 *       ...
 *     ]
 * } 
 */
js.awt.GridLayout = function (def){

    var CLASS = js.awt.GridLayout, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM,
    System = J$VM.System;
    
    /** 
     * Lays out the specified container using this layout. 
     * This method reshapes the components in the specified target 
     * container in order to satisfy the constraints of the GridLayout. 
     * The grid layout determines the size of individual 
     * components by dividing the free space in the container into 
     * equal-sized portions according to the number of rows and columns 
     * in the layout. The container's free space equals the container's 
     * size minus any insets and any specified horizontal or vertical 
     * gap. All components in a grid layout are given the same size. 
     */    
    thi$.layoutContainer = function(container){
        var bounds = container.getBounds(), MBP = bounds.MBP, 
        grid = this.grid, items = container.items0(), comp, 
        constraints, rIdx, cIdx, cell, x, y, w, h, compz;
        
        grid.layout(MBP.paddingLeft, MBP.paddingTop, 
                    bounds.innerWidth, bounds.innerHeight);

        for(var i=0, len=items.length; i<len; i++){
            comp = container[items[i]];
            if(!comp.isVisible()) continue;

            constraints = comp.def.constraints;
            cell = grid.cell(constraints.rowIndex, constraints.colIndex);
            if(cell && cell.visible){
                compz = comp.getPreferredSize();
                x = cell.x + cell.paddingLeft;
                y = cell.y + cell.paddingTop;

                if(comp.isRigidWidth()){
                    x += (cell.innerWidth - compz.width)*comp.getAlignmentX();
                    w = compz.width;
                }else{
                    w = cell.innerWidth;
                }

                if(comp.isRigidHeight()){
                    y += (cell.innerHeight- compz.height)*comp.getAlignmentY();
                    h = compz.height;
                }else{
                    h = cell.innerHeight;
                }
                
                comp.setBounds(x, y, w, h, 3);
            }else{
                comp.display(false);
            }
        }

    }.$override(this.layoutContainer);

    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.GridLayout";
        arguments.callee.__super__.apply(this, arguments);
        
        this.grid = new (Class.forName("js.awt.Grid"))(def);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


/**
 Copyright 2007-2015, The JSVM Project.
 All rights reserved.

 *
 * Author: Hu Dong
 * Contact: hoodng@hotmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/hoodng/JSVM
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
            constraints, rIdx, cIdx, cell, x, y, w, h, compz,
            padding = [0,0,0,0], innerW, innerH;
        
        grid.layout(MBP.paddingLeft, MBP.paddingTop, 
                    bounds.innerWidth, bounds.innerHeight);

        for(var i=0, len=items.length; i<len; i++){
            comp = container[items[i]];
            if(!comp.isVisible()) continue;

            constraints = comp.def.constraints;
            cell = grid.cell(constraints.rowIndex, constraints.colIndex);
            if(cell && cell.visible){
                compz = comp.getPreferredSize();
                x = cell.x + padding[3];
                y = cell.y + padding[0];

                innerW = cell.width - padding[1] - padding[3];
                if(comp.isRigidWidth()){
                    x += (innerW - compz.width)*comp.getAlignmentX();
                    w = compz.width;
                }else{
                    w = innerW;
                }

                innerH = cell.height- padding[0] - padding[2];
                if(comp.isRigidHeight()){
                    y += (innerH- compz.height)*comp.getAlignmentY();
                    h = compz.height;
                }else{
                    h = innerH;
                }
                
                comp.setBounds(x, y, w, h, 3);
            }else{
                comp.display(false);
            }
        }

    };

    thi$._init = function(def){
        def = def || {};

        def.classType = "js.awt.GridLayout";
        arguments.callee.__super__.apply(this, arguments);
        
        this.grid = new (Class.forName("js.awt.GridEx"))(def);

    }.$override(this._init);

    this._init.apply(this, arguments);

}.$extend(js.awt.AbsoluteLayout);


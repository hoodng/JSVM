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
 * Author: Lv Xianhao
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.awt");

/**
 * 
 * The GridBagLayout is a flexible layout manager that aligns components vertically, 
 * horizontally without requiring that the components be of the same size. Each 
 * GridBagLayout object maintains a dynamic, rectangular grid of cells, with each 
 * component occupying one or more cells, called its display area. Each component 
 * managed by a GridBagLayout is associated with an instance of GridBagConstraints. 
 * The constraints object specifies where a component's display area should be 
 * located on the grid and how the component should be positioned within its display 
 * area. In addition to its constraints object, the GridBagLayout also considers each 
 * component's minimum and preferred sizes in order to determine a component's size. 
 * The GridBagLayout just supports currently horizontal left-to-right orientations, 
 * grid coordinate (0,0) is in the upper left corner of the container with x increasing 
 * to the right and y increasing downward. To use a grid bag layout effectively, you 
 * must customize one or more of the GridBagConstraints objects that are associated with 
 * its components. 
 * 
 */
js.awt.GridBagLayout = function(def) {

	var CLASS = js.awt.GridBagLayout, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}

	var Class = js.lang.Class, Event = js.util.Event, DOM = J$VM.DOM, System = J$VM.System;

	CLASS.__defined__ = true;
	CLASS.__MINSIZE__ = 1;
	CLASS.__PREFERREDSIZE__ = 2;
	CLASS.__EMPIRICMULTIPLIER__ = 2;

	var GridBagConstraints = js.awt.GridBagConstraints;

	thi$.addLayoutComponent = function(comp, constraints) {
		arguments.callee.__super__.apply(this, arguments);

	}.$override(this.addLayoutComponent);

	thi$.removeLayoutComponent = function(comp) {
		// Implements by sub class
	}.$override(this.removeLayoutComponent);

	thi$.invalidateLayout = function(container) {
		// Implements by sub class
	}.$override(this.invalidateLayout);

	var _locateComponents = function(container) {
		var box = container.getBounds();
		var info = _getLayoutInfo.call(this, container, CLASS.__PREFERREDSIZE__);
		var i, t = 0, diffw, diffh;
		var components = container.getAllComponents();
		var compX, compY, compWidth, compHeight, weight, m, comp;

		for (i = 0; i < info.width; i++)
			t += info.minWidth[i];
		compWidth = t;
		t = 0;
		for (i = 0; i < info.height; i++)
			t += info.minHeight[i];
		compHeight = t;

		if (box.innerWidth < compWidth || box.innerHeight < compHeight) {
			t = 0;
			info = _getLayoutInfo.call(this, container, CLASS.__MINSIZE__);
			for (i = 0; i < info.width; i++)
				t += info.minWidth[i];
			compWidth = t;

			t = 0;
			for (i = 0; i < info.height; i++)
				t += info.minHeight[i];
			compHeight = t;
		}

		diffw = box.innerWidth - compWidth;
		if (diffw != 0) {
			weight = 0.0;
			for (i = 0; i < info.width; i++)
				weight += info.weightX[i];
			if (weight > 0.0) {
				for (i = 0; i < info.width; i++) {
					var dx = Math.round((diffw * info.weightX[i]) / weight);
					info.minWidth[i] += dx;
					compWidth += dx;
					if (info.minWidth[i] < 0) {
						compWidth -= info.minWidth[i];
						info.minWidth[i] = 0;
					}
				}
			}
			diffw = box.innerWidth - compWidth;
		} else {
			diffw = 0;
		}

		diffh = box.innerHeight - compHeight;
		if (diffh != 0) {
			weight = 0.0;
			for (i = 0; i < info.height; i++)
				weight += info.weightY[i];
			if (weight > 0.0) {
				for (i = 0; i < info.height; i++) {
					var dy = Math.round((diffh * info.weightY[i]) / weight);
					info.minHeight[i] += dy;
					compHeight += dy;
					if (info.minHeight[i] < 0) {
						compHeight -= info.minHeight[i];
						info.minHeight[i] = 0;
					}
				}
			}
			diffh = box.innerHeight - compHeight;
		} else {
			diffh = 0;
		}

		for (m = 0; m < components.length; m++) {
			comp = components[m];
			if (!comp.isVisible()) {
				continue;
			}
			var constraints = comp.def.constraints;

			compX = info.startx;
			for (i = 0; i < constraints.tempX; i++)
				compX += info.minWidth[i];

			compY = info.starty;
			for (i = 0; i < constraints.tempY; i++)
				compY += info.minHeight[i];

			compWidth = 0;
			for (i = constraints.tempX; i < (constraints.tempX + constraints.tempWidth); i++) {
				compWidth += info.minWidth[i];
			}

			compHeight = 0;
			for (i = constraints.tempY; i < (constraints.tempY + constraints.tempHeight); i++) {
				compHeight += info.minHeight[i];
			}

			// adjustForGravity(constraints, r);
			var diffx, diffy;
			var cellY = compY;
			var cellHeight = compHeight;

			compX += constraints.insets.left;

			compWidth -= (constraints.insets.left + constraints.insets.right);
			compY += constraints.insets.top;
			compHeight -= (constraints.insets.top + constraints.insets.bottom);

			diffx = 0;
			if ((constraints.fill != GridBagConstraints.__horizontal__ && constraints.fill != GridBagConstraints.__both__)
					&& (compWidth > (constraints.minWidth + constraints.ipadx))) {
				diffx = compWidth - (constraints.minWidth + constraints.ipadx);
				compWidth = constraints.minWidth + constraints.ipadx;
			}

			diffy = 0;
			if ((constraints.fill != GridBagConstraints.__vertical__ && constraints.fill != GridBagConstraints.__both__)
					&& (compHeight > (constraints.minHeight + constraints.ipady))) {
				diffy = compHeight
						- (constraints.minHeight + constraints.ipady);
				compHeight = constraints.minHeight + constraints.ipady;
			}

			switch (constraints.anchor) {
			case GridBagConstraints.__center__:
				compX += diffx / 2;
				compY += diffy / 2;
				break;
			case GridBagConstraints.__page_start__:
			case GridBagConstraints.__north__:
				compX += diffx / 2;
				break;
			case GridBagConstraints.__northeast__:
			case GridBagConstraints.__first_line_end__:
				compX += diffx;
				break;
			case GridBagConstraints.__east__:
			case GridBagConstraints.__line_end__:
				compX += diffx;
				compY += diffy / 2;
				break;
			case GridBagConstraints.__southeast__:
			case GridBagConstraints.__last_line_end__:
				compX += diffx;
				compY += diffy;
				break;
			case GridBagConstraints.__page_end__:
			case GridBagConstraints.__south__:
				compX += diffx / 2;
				compY += diffy;
				break;
			case GridBagConstraints.__southwest__:
			case GridBagConstraints.__last_line_start__:
				compY += diffy;
				break;
			case GridBagConstraints.__west__:
			case GridBagConstraints.__line_start__:
				compY += diffy / 2;
				break;
			default:
				throw 'unsupported anchor value';
			}

			if (compX < 0) {
				compWidth += compX;
				compX = 0;
			}

			if (compY < 0) {
				compHeight += compY;
				compY = 0;
			}

			/*
			 * If the window is too small to be interesting then unmap it.
			 * Otherwise configure it and then make sure it's mapped.
			 */
			if ((compWidth <= 0) || (compHeight <= 0)) {
				comp.setBounds(0, 0, 0, 0, 3);
			} else {
				if (comp.def.x != compX || comp.def.y != compY
						|| comp.def.width != compWidth
						|| comp.def.height != compHeight) {
					comp.setBounds(compX, compY, compWidth, compHeight, 3);
				}
			}
		}
	};

	var _getLayoutInfo = function(container, sizeFlag) {
		var constraints, layoutWidth = layoutHeight = 0, curRow = curCol = -1, nextSize;
		var components = container.getAllComponents();
		var curX, curY, curWidth, curHeight, preMaximumArrayXIndex = preMaximumArrayYIndex = 0;
		var maximumArrayXIndex = maximumArrayYIndex = 0;
		var xMaxArray, yMaxArray;

		/*
		 * Step 1: Calculate maximum array sizes to allocate arrays without
		 * ensureCapacity we may use preCalculated sizes in whole class because
		 * of upper estimation of maximumArrayXIndex and maximumArrayYIndex.
		 */
		for (i = 0; i < components.length; i++) {
			comp = components[i];
			if (!comp.isVisible()) {
				continue;
			}

			constraints = comp.def.constraints;
			curX = constraints.gridx;
			curY = constraints.gridy;
			curWidth = constraints.gridwidth;
			curHeight = constraints.gridheight;

			if (curX < 0) {
				curX = ++preMaximumArrayYIndex;
			}
			if (curY < 0) {
				curY = ++preMaximumArrayXIndex;
			}

			if (curWidth <= 0) {
				curWidth = 1;
			}
			if (curHeight <= 0) {
				curHeight = 1;
			}

			preMaximumArrayXIndex = Math.max(curY + curHeight,
					preMaximumArrayXIndex);
			preMaximumArrayYIndex = Math.max(curX + curWidth,
					preMaximumArrayYIndex);
		}

		maximumArrayXIndex = (CLASS.__EMPIRICMULTIPLIER__
				* preMaximumArrayXIndex > Number.MAX_VALUE) ? Number.MAX_VALUE
				: CLASS.__EMPIRICMULTIPLIER__ * preMaximumArrayXIndex;
		maximumArrayYIndex = (CLASS.__EMPIRICMULTIPLIER__
				* preMaximumArrayYIndex > Number.MAX_VALUE) ? Number.MAX_VALUE
				: CLASS.__EMPIRICMULTIPLIER__ * preMaximumArrayYIndex;

		xMaxArray = new Array(maximumArrayXIndex);
		yMaxArray = new Array(maximumArrayYIndex);

		for (m = 0; m < components.length; m++) {
			comp = components[m];
			if (!comp.isVisible())
				continue;
			constraints = comp.def.constraints;
			curX = constraints.gridx;
			curY = constraints.gridy;
			curWidth = constraints.gridwidth;
			if (curWidth <= 0)
				curWidth = 1;
			curHeight = constraints.gridheight;
			if (curHeight <= 0)
				curHeight = 1;

			/* If x or y is negative, then use relative positioning: */
			if (curX < 0 && curY < 0) {
				if (curRow >= 0)
					curY = curRow;
				else if (curCol >= 0)
					curX = curCol;
				else
					curY = 0;
			}
			if (curX < 0) {
				px = 0;
				for (i = curY; i < (curY + curHeight); i++) {
					px = Math.max(px, xMaxArray[i]);
				}

				curX = px - curX - 1;
				if (curX < 0)
					curX = 0;
			} else if (curY < 0) {
				py = 0;
				for (i = curX; i < (curX + curWidth); i++) {
					py = Math.max(py, yMaxArray[i]);
				}
				curY = py - curY - 1;
				if (curY < 0)
					curY = 0;
			}

			px = curX + curWidth;
			if (layoutWidth < px) {
				layoutWidth = px;
			}
			py = curY + curHeight;
			if (layoutHeight < py) {
				layoutHeight = py;
			}

			/* Adjust xMaxArray and yMaxArray */
			for (i = curX; i < (curX + curWidth); i++) {
				yMaxArray[i] = py;
			}
			for (i = curY; i < (curY + curHeight); i++) {
				xMaxArray[i] = px;
			}

			/* Cache the current slave's size. */
			if (sizeFlag === CLASS.__PREFERREDSIZE__) {
				d = comp.getPreferredSize();
				constraints.minWidth = d.width;
				constraints.minHeight = d.height;
			}

			constraints.ascent = -1;

			/*
			 * Zero width and height must mean that this is the last item (or
			 * else something is wrong).
			 */
			if (constraints.gridheight == 0 && constraints.gridwidth == 0)
				curRow = curCol = -1;

			/* Zero width starts a new row */
			if (constraints.gridheight == 0 && curRow < 0)
				curCol = curX + curWidth;
			/* Zero height starts a new column */
			else if (constraints.gridwidth == 0 && curCol < 0)
				curRow = curY + curHeight;
		} // for (components) loop

		if (sizeFlag === CLASS.__MINSIZE__) {
			var bounds = container.getBounds();
			var cellWidth = Math.round(bounds.innerWidth / layoutWidth);
			var cellHeight = Math.round(bounds.innerHeight / layoutHeight);

			for (m = 0; m < components.length; m++) {
				comp = components[m];
				if (!comp.isVisible())
					continue;
				constraints = comp.def.constraints;
				constraints.minWidth = cellWidth;
				constraints.minHeight = cellHeight;
			}
		}

		var layoutInfo = new js.awt.GridBagLayoutInfo(layoutWidth, layoutHeight);

		curRow = curCol = -1;

		xMaxArray = new Array(maximumArrayXIndex);
		yMaxArray = new Array(maximumArrayYIndex);

		for (m = 0; m < components.length; m++) {
			comp = components[m];
			if (!comp.isVisible())
				continue;
			constraints = comp.def.constraints;

			curX = constraints.gridx;
			curY = constraints.gridy;
			curWidth = constraints.gridwidth;
			curHeight = constraints.gridheight;

			/* If x or y is negative, then use relative positioning: */
			if (curX < 0 && curY < 0) {
				if (curRow >= 0)
					curY = curRow;
				else if (curCol >= 0)
					curX = curCol;
				else
					curY = 0;
			}

			if (curX < 0) {
				if (curHeight <= 0) {
					curHeight += layoutInfo.height - curY;
					if (curHeight < 1)
						curHeight = 1;
				}

				px = 0;
				for (i = curY; i < (curY + curHeight); i++)
					px = Math.max(px, xMaxArray[i]);

				curX = px - curX - 1;
				if (curX < 0)
					curX = 0;
			} else if (curY < 0) {
				if (curWidth <= 0) {
					curWidth += layoutInfo.width - curX;
					if (curWidth < 1)
						curWidth = 1;
				}

				py = 0;
				for (i = curX; i < (curX + curWidth); i++) {
					py = Math.max(py, yMaxArray[i]);
				}

				curY = py - curY - 1;
				if (curY < 0)
					curY = 0;
			}

			if (curWidth <= 0) {
				curWidth += layoutInfo.width - curX;
				if (curWidth < 1)
					curWidth = 1;
			}

			if (curHeight <= 0) {
				curHeight += layoutInfo.height - curY;
				if (curHeight < 1)
					curHeight = 1;
			}

			px = curX + curWidth;
			py = curY + curHeight;

			for (i = curX; i < (curX + curWidth); i++) {
				yMaxArray[i] = py;
			}
			for (i = curY; i < (curY + curHeight); i++) {
				xMaxArray[i] = px;
			}

			/* Make negative sizes start a new row/column */
			if (constraints.gridheight == 0 && constraints.gridwidth == 0)
				curRow = curCol = -1;
			if (constraints.gridheight == 0 && curRow < 0)
				curCol = curX + curWidth;
			else if (constraints.gridwidth == 0 && curCol < 0)
				curRow = curY + curHeight;

			/* Assign the new values to the gridbag slave */
			constraints.tempX = curX;
			constraints.tempY = curY;
			constraints.tempWidth = curWidth;
			constraints.tempHeight = curHeight;

			anchor = constraints.anchor;
		}

		layoutInfo.weightX = new Array(maximumArrayYIndex);
		layoutInfo.weightY = new Array(maximumArrayXIndex);
		layoutInfo.minWidth = new Array(maximumArrayYIndex);
		layoutInfo.minHeight = new Array(maximumArrayXIndex);

		for (i = 0; i < maximumArrayYIndex; i++) {
			layoutInfo.weightX[i] = 0.0;
			layoutInfo.minWidth[i] = 0;
		}
		for (i = 0; i < maximumArrayXIndex; i++) {
			layoutInfo.weightY[i] = 0.0;
			layoutInfo.minHeight[i] = 0;
		}

		var MAX_INT = 2147483647;
		nextSize = MAX_INT;

		for (i = 1; i != MAX_INT; i = nextSize, nextSize = MAX_INT) {
			for (m = 0; m < components.length; m++) {
				comp = components[m];
				if (!comp.isVisible())
					continue;
				constraints = comp.def.constraints;
				if (constraints.tempWidth == i) {
					px = constraints.tempX + constraints.tempWidth;
					weight_diff = constraints.weightx;
					for (k = constraints.tempX; k < px; k++) {
						weight_diff -= layoutInfo.weightX[k];
					}
					if (weight_diff > 0.0) {
						weight = 0.0;
						for (k = constraints.tempX; k < px; k++)
							weight += layoutInfo.weightX[k];
						for (k = constraints.tempX; weight > 0.0 && k < px; k++) {
							var wt = layoutInfo.weightX[k];
							var dx = (wt * weight_diff) / weight;
							layoutInfo.weightX[k] += dx;
							weight_diff -= dx;
							weight -= wt;
						}
						/* Assign the remainder to the rightmost cell */
						layoutInfo.weightX[px - 1] += weight_diff;
					}

					/*
					 * Calculate the minWidth array values. First, figure out
					 * how wide the current slave needs to be. Then, see if it
					 * will fit within the current minWidth values. If it will
					 * not fit, add the difference according to the weightX
					 * array.
					 */

					pixels_diff = constraints.minWidth + constraints.ipadx
							+ constraints.insets.left
							+ constraints.insets.right;

					for (k = constraints.tempX; k < px; k++)
						pixels_diff -= layoutInfo.minWidth[k];
					if (pixels_diff > 0) {
						weight = 0.0;
						for (k = constraints.tempX; k < px; k++)
							weight += layoutInfo.weightX[k];
						for (k = constraints.tempX; weight > 0.0 && k < px; k++) {
							var wt = layoutInfo.weightX[k];
							var dx = (wt * pixels_diff) / weight;
							layoutInfo.minWidth[k] += dx;
							pixels_diff -= dx;
							weight -= wt;
						}
						/* Any leftovers go into the rightmost cell */
						layoutInfo.minWidth[px - 1] += pixels_diff;
					}
				} else if (constraints.tempWidth > i
						&& constraints.tempWidth < nextSize)
					nextSize = constraints.tempWidth;

				if (constraints.tempHeight == i) {
					py = constraints.tempY + constraints.tempHeight; 
					
					/*
					 * Figure out if we should use this slave's weight. If the
					 * weight is less than the total weight spanned by the
					 * height of the cell, then discard the weight. Otherwise
					 * split it the difference according to the existing
					 * weights.
					 */
					weight_diff = constraints.weighty;
					for (k = constraints.tempY; k < py; k++)
						weight_diff -= layoutInfo.weightY[k];
					if (weight_diff > 0.0) {
						weight = 0.0;
						for (k = constraints.tempY; k < py; k++)
							weight += layoutInfo.weightY[k];
						for (k = constraints.tempY; weight > 0.0 && k < py; k++) {
							var wt = layoutInfo.weightY[k];
							var dy = (wt * weight_diff) / weight;
							layoutInfo.weightY[k] += dy;
							weight_diff -= dy;
							weight -= wt;
						}
						/* Assign the remainder to the bottom cell */
						layoutInfo.weightY[py - 1] += weight_diff;
					}

					/*
					 * Calculate the minHeight array values. First, figure out
					 * how tall the current slave needs to be. Then, see if it
					 * will fit within the current minHeight values. If it will
					 * not fit, add the difference according to the weightY
					 * array.
					 */
					pixels_diff = -1;

					if (pixels_diff == -1) {
						pixels_diff = constraints.minHeight + constraints.ipady
								+ constraints.insets.top
								+ constraints.insets.bottom;
					}
					for (k = constraints.tempY; k < py; k++)
						pixels_diff -= layoutInfo.minHeight[k];
					if (pixels_diff > 0) {
						weight = 0.0;
						for (k = constraints.tempY; k < py; k++)
							weight += layoutInfo.weightY[k];
						for (k = constraints.tempY; weight > 0.0 && k < py; k++) {
							var wt = layoutInfo.weightY[k];
							var dy = (wt * pixels_diff) / weight;
							layoutInfo.minHeight[k] += dy;
							pixels_diff -= dy;
							weight -= wt;
						}
						/* Any leftovers go into the bottom cell */
						layoutInfo.minHeight[py - 1] += pixels_diff;
						var t = py - 1;
					}
				} else if (constraints.tempHeight > i
						&& constraints.tempHeight < nextSize)
					nextSize = constraints.tempHeight;
			}
		}
		return layoutInfo;
	};

	thi$.layoutContainer = function(container) {
		_locateComponents.call(this, container);
	}.$override(this.layoutContainer);
    

	thi$._init = function(def) {
        def = def || {};
        
        def.classType = "js.awt.GridBagLayout";

		arguments.callee.__super__.apply(this, arguments);

	}.$override(this._init);

	this._init.apply(this, arguments);

}.$extend(js.awt.AbstractLayout);


/**
 * The GridBagConstraints specifies constraints for components that are laid out using the GridBagLayout.
 * 
 * @param gridx: Specifies the cell containing the leading edge of the component'sdisplay area, where the
 *        first cell in a row has gridx=0. gridx should be a non-negative value.
 *        
 * @param gridy: Specifies the cell at the top of the component's display area, where the topmost cell has
 *        gridy=0. gridy should be a non-negative value.
 *        
 * @param gridwidth: Specifies the number of cells in a row for the component's display area. gridwidth
 *        should be non-negative and the default value is 1.
 *        
 * @param gridheight: Specifies the number of cells in a column for the component's display area. gridheight
 *        should be non-negative and the default value is 1.
 *        
 * @param weightx: Specifies how to distribute extra horizontal space. The grid bag layout manager calculates
 *        the weight of a column to be the maximum weightx of all the components in a column. If the resulting
 *        layout is smaller horizontally than the area it needs to fill, the extra space is distributed to each
 *        column in proportion to its weight. A column that has a weight of zero receives no extra space. If 
 *        all the weights are zero, all the extra space appears between the grids of the cell and the left and 
 *        right edges. The default value of this field is 0. weightx should be a non-negative value.
 *         
 * @param weighty: Specifies how to distribute extra vertical space. The grid bag layout manager calculates 
 *        the weight of a row to be the maximum weighty of all the components in a row. If the resulting layout 
 *        is smaller vertically than the area it needs to fill, the extra space is distributed to each row in  
 *        proportion to its weight. A row that has a weight of zero receives no extra space. If all the weights
 *        are zero, all the extra space appears between the grids of the cell and the top and bottom edges. The 
 *        default value of this field is 0. weighty should be a non-negative value.
 *        
 * @param ipadx: This field specifies the internal padding of the component, how much space to add to the minimum 
 *        width of the component. The width of the component is at least its minimum width plus ipadx pixels.The 
 *        default value is 0. 
 *        
 * @param ipady: This field specifies the internal padding, that is, how much space to add to the minimum height of
 *        the component. The height of the component is at least its minimum height plus ipady pixels. The default 
 *        value is 0.
 *         
 * @param anchor: This field is used when the component is smaller than its display area. It determines where, within
 *        the display area, to place the component. There are two kinds of possible values: orientation relative, 
 *        and absolute. Orientation relative values are interpreted relative to the container's component orientation 
 *        property, baseline relative values are interpreted relative to the baseline and absolute values are not. The 
 *        absolute values are: CENTER, NORTH, NORTHEAST, EAST, SOUTHEAST, SOUTH, SOUTHWEST, WEST and NORTHWEST. The 
 *        orientation relative values are: PAGE_START, PAGE_END,LINE_START, LINE_END, FIRST_LINE_START, FIRST_LINE_END, 
 *        LAST_LINE_START and LAST_LINE_END. Not supports baseline relative currently.
 *        
 * @param fill: This field is used when the component's display area is larger than the component's requested size. It determines 
 *        whether to resize the component, and if so, how. The following values are valid for fill:
 *        NONE: Do not resize the component. 
 *        HORIZONTAL: Make the component wide enough to fill its display area horizontally, but do not change its height.
 *        VERTICAL: Make the component tall enough to fill its display area vertically, but do not change its width.
 *        BOTH: Make the component fill its display area entirely.
 *        The default value is NONE.
 *        
 * @param insets: This field specifies the external padding of the component, the minimum amount of space between the component
 *        and the edges of its display area. The default value is {top:0, bottom:0, left:0, right:0}. 
 */
js.awt.GridBagConstraints = function(gridx, gridy, gridwidth, gridheight,
		weightx, weighty, ipadx, ipady, anchor, fill, insets) {
	var CLASS = js.awt.GridBagConstraints, thi$ = CLASS.prototype;
	if (CLASS.__defined__) {
		this._init.apply(this, arguments);
		return;
	}

	CLASS.__defined__ = true;
	CLASS.__horizontal__ = 'horizontal';
	CLASS.__both__ = 'both';
	CLASS.__dvertical__ = 'vertical';
	CLASS.__none__ = 'none';
	CLASS.__center__ = 'center';
	CLASS.__north__ = 'north';
	CLASS.__northeast__ = 'northeast';
	CLASS.__east__ = 'east';
	CLASS.__southeast__ = 'southeast';
	CLASS.__south__ = 'south';
	CLASS.__southwest__ = 'southwest';
	CLASS.__west__ = 'west';
	CLASS.__page_start__ = 'page_start';
	CLASS.__page_end__ = 'page_end';
	CLASS.__line_start__ = 'line_start';
	CLASS.__line_end__ = 'line_end';
	CLASS.__first_line_end__ = 'first_line_end';
	CLASS.__last_line_start__ = 'last_line_start';
	CLASS.__last_line_end__ = 'last_line_end';

	thi$._init = function(gridx, gridy, gridwidth, gridheight, weightx,
			weighty, ipadx, ipady, anchor, fill, insets) {

		var Class = js.lang.Class;
		this.gridx = gridx;
		this.gridy = gridy;
		this.gridwidth = Class.typeOf(gridwidth) == "number" ? gridwidth : 1;
		this.gridheight = Class.typeOf(gridheight) == "number" ? gridheight : 1;
		this.weightx = Class.typeOf(weightx) == "number" ? weightx : 0.0;
		this.weighty = Class.typeOf(weighty) == "number" ? weighty : 0.0;
		this.ipadx = Class.typeOf(ipadx) == "number" ? ipadx : 0;
		this.ipady = Class.typeOf(ipady) == "number" ? ipady : 0;
		this.anchor = Class.typeOf(anchor) == "number" ? anchor : 10;
		this.minWidth = this.minHeight = 0;
		this.insets = Class.typeOf(insets) == "object" ? insets : {
			top : 0,
			bottom : 0,
			left : 0,
			right : 0
		};
		this.fill = Class.typeOf(fill) == "string" ? fill : CLASS.__both__;
		this.anchor = Class.typeOf(anchor) == "string" ? anchor
				: CLASS.__center__;
	};

	this._init.apply(this, arguments);

}.$extend(js.lang.Object);

/**
 * The GridBagLayoutInfois an utility class for GridBagLayout layout manager.
 * It stores align, size, etc for every component within a container.
 */
js.awt.GridBagLayoutInfo = function(width, height) {
	this.width = width;
	this.height = height;
	this.startx = 0;
	this.starty = 0;
	this.minWidth = [];
	this.minHeight = [];
	this.weightX = [];
	this.weightY = [];
}.$extend(js.lang.Object);


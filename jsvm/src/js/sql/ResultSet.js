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
 * Author: Hu Dong
 * Contact: jsvm.prj@gmail.com
 * License: BSD 3-Clause License
 * Source code availability: http://jzvm.googlecode.com
 */

$package("js.sql");

$import("js.sql.ResultSetMetaData");

js.sql.ResultSet = function (){

    var CLASS = js.sql.ResultSet, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System, 
    SQLTypes = Class.forName("js.sql.Types");

    thi$.setMetaData = function(metaData){
        if(!(metaData instanceof js.sql.ResultSetMetaData))
            throw "SQLException: metaData is not an "
            + "instance of js.sql.ResultSetMetaData";

        this.metaData = metaData;
    };

    /**
     * Retrieves the  number, types and properties of
     * this <code>ResultSet</code> object's columns.
     *
     * @return the description of this <code>ResultSet</code> object's columns
     * @exception SQLException
     */
    thi$.getMetaData = function(){
        return this.metaData;
    };    

    /**
     * Maps the given <code>ResultSet</code> column label to its
     * <code>ResultSet</code> column index.
     *
     * @param columnLabel the name for the column  
     * @return the column index of the given column name
     * 
     * @exception SQLException
     */
    thi$.findColumn = function(columnName){
        var metaData = this.getMetaData(), 
        col = metaData.findColumn(columnName);
        if(col){
            return col.colIndex;
        }

        throw "SQLException: Can't found column ["+columnName+"]";
    };
    
    /**
     * Returns the number of rows in this <code>ResultSet</code> object.
     *
     * @return the number of rows
     * @exception SQLException
     */
    thi$.getRowCount = function(){
        return 0;
    };
    
    /**
     * Retrieves whether the cursor is before the first row in
     * this <code>ResultSet</code> object.
     *
     * @return <code>true</code> if the cursor is before the first row;
     * <code>false</code> if the cursor is at any other position or the
     * result set contains no rows
     * @exception SQLException
     */
    thi$.isBeforeFirst = function(){
        return this.cursor === 0;
    };
    
    /**
     * Retrieves whether the cursor is on the first row of
     * this <code>ResultSet</code> object.
     * 
     * @return <code>true</code> if the cursor is on the first row;
     * <code>false</code> otherwise
     * @exception SQLException
     */
    thi$.isFirst = function(){
        return this.cursor === 1;
    };

    /**
     * Retrieves whether the cursor is after the last row in
     * this <code>ResultSet</code> object.
     *
     * @return <code>true</code> if the cursor is after the last row;
     * <code>false</code> if the cursor is at any other position or the
     * result set contains no rows
     * @exception SQLException
     */
    thi$.isAfterLast = function(){
        return this.cursor > this.getRowCount();
    };

    /**
     * Retrieves whether the cursor is on the last row of
     * this <code>ResultSet</code> object.
     * 
     * @exception SQLException
     */
    thi$.isLast = function(){
        return this.cursor === this.getRowCount();
    };
    
    /**
     * Moves the cursor to the front of
     * this <code>ResultSet</code> object, just before the
     * first row. This method has no effect if the result set contains no rows.
     *
     * @exception SQLException
     */
    thi$.beforeFirst = function(){
        this.absolute(0);
    };

    /**
     * Moves the cursor to the end of
     * this <code>ResultSet</code> object, just after the
     * last row. This method has no effect if the result set contains no rows.
     * 
     * @exception SQLException
     */
    thi$.afterLast = function(){
        this.absolute(this.getRowCount()+1);
    };
    
    /**
     * Moves the cursor to the first row in
     * this <code>ResultSet</code> object.
     *
     * @return <code>true</code> if the cursor is on a valid row;
     * <code>false</code> if there are no rows in the result set
     * @exception SQLException
     */
    thi$.first = function(){
        return this.absolute(1);        
    };
    
    /**
     * Moves the cursor to the last row in this 
     * <code>ResultSet</code> object.
     *
     * @return <code>true</code> if the cursor is on a valid row;
     * <code>false</code> if there are no rows in the result set
     * @exception SQLException
     */
    thi$.last = function(){
        return this.absolute(-1);
    };

    /**
     * Moves the cursor froward one row from its current position.
     * A <code>ResultSet</code> cursor is initially positioned
     * before the first row; the first call to the method
     * <code>next</code> makes the first row the current row; the
     * second call makes the second row the current row, and so on.
     * <p>
     * When a call to the <code>next</code> method returns <code>false</code>,
     * the cursor is positioned after the last row. Any
     * invocation of a <code>ResultSet</code> method which requires a
     * current row will result in a <code>SQLException</code> being thrown.

     * @return <code>true</code> if the new current row is valid;
     * <code>false</code> if there are no more rows
     * @exception SQLException
     */
    thi$.next = function(){
        return this.relative(1);
    };

    /**
     * Moves the cursor to the previous row in this
     * <code>ResultSet</code> object.
     *<p>
     * When a call to the <code>previous</code> method returns <code>false</code>,
     * the cursor is positioned before the first row.  Any invocation of a
     * <code>ResultSet</code> method which requires a current row will result in a
     * <code>SQLException</code> being thrown.
     *
     * @return <code>true</code> if the cursor is now positioned on a valid row;
     * <code>false</code> if the cursor is positioned before the first row
     * @exception SQLException
     */
    thi$.previous = function() {
        return this.relative(-1);
    };

    /**
     * Moves the cursor to the given row number in
     * this <code>ResultSet</code> object.
     *
     * <p>If the row number is positive, the cursor moves to
     * the given row number with respect to the beginning of the result set.  
     * The first row is row 1, the second is row 2, and so on.
     *
     * <p>If the given row number is negative, the cursor moves to
     * an absolute row position with respect to the end of the result set.  
     * For example, calling the method <code>absolute(-1)</code> positions the
     * cursor on the last row; calling the method <code>absolute(-2)</code>
     * moves the cursor to the next-to-last row, and so on.
     *
     * <p>If the row number specified is zero, the cursor is moved to
     * before the first row.
     *
     * <p>An attempt to position the cursor beyond the first/last row in
     * the result set leaves the cursor before the first row or after
     * the last row.
     *
     * <p><B>Note:</B> Calling <code>absolute(1)</code> is the same
     * as calling <code>first()</code>. Calling <code>absolute(-1)</code>
     * is the same as calling <code>last()</code>.
     *
     * @param row the number of the row to which the cursor should move.
     *        A value of zero indicates that the cursor will be positioned
     *        before the first row; a positive number indicates the row number
     *        counting from the beginning of the result set; a negative number
     *        indicates the row number counting from the end of the result set
     * @return <code>true</code> if the cursor is moved to a position in this
     * <code>ResultSet</code> object;
     * <code>false</code> if the cursor is before the first row or after the
     * last row
     * @exception SQLException
     */
    thi$.absolute = function(row){
        var rowNum = this.getRowCount(), ret = false;
        if(row < 0){
            row = rowNum + row + 1;
            this.cursor = row > 0 ? row : 0;
            ret = (this.cursor > 0);
        }else if(row == 0){
            this.cursor = 0;
        }else if(row > 0){
            this.cursor = row > rowNum ? rowNum + 1 : row;
            ret = (this.cursor <= rowNum);
        }
        return ret;
    };

    /**
     * Moves the cursor a relative number of rows, either positive or negative.
     * Attempting to move beyond the first/last row in the
     * result set positions the cursor before/after the
     * the first/last row. Calling <code>relative(0)</code> is valid, but does
     * not change the cursor position.
     *
     * <p>Note: Calling the method <code>relative(1)</code>
     * is identical to calling the method <code>next()</code> and
     * calling the method <code>relative(-1)</code> is identical
     * to calling the method <code>previous()</code>.
     *
     * @param rows an <code>int</code> specifying the number of rows to
     *        move from the current row; a positive number moves the cursor
     *        forward; a negative number moves the cursor backward
     * @return <code>true</code> if the cursor is on a row;
     *         <code>false</code> otherwise
     * @exception SQLException
     */
    thi$.relative = function(rows){
        return this.absolute(this.cursor + rows);        
    };

    /**
     * Retrieves the current row number.  The first row is number 1, the
     * second number 2, and so on.
     *
     * @return the current row number; <code>0</code> if there is no current row
     * @exception SQLException
     */
    thi$.getRow = function(){
        var cursor = this.cursor;
        return (cursor < 1 || cursor > this.getRowCount()) ? 0 : cursor;
    };

    /**
     * Retrieves the value of the designated column in the current row
     * of this <code>ResultSet</code> object.
     *
     * @param columnIndex the first column is 1, the second is 2, ...
     * @return the column value

     * @exception SQLException
     */
    thi$.getValue = function(columnIndex){
        
    };
    
    /**
     * Updates the designated column with a new value.
     * The updater methods are used to update column values in the
     * current row or the insert row.
     *
     * @param columnIndex the first column is 1, the second is 2, ...
     * @param value the new column value
     * 
     * @exception SQLException
     */
    thi$.updateValue = function(columnIndex, value){
        
    };
    
    /**
     * Deletes the current row from this <code>ResultSet</code> object.
     *
     * @exception SQLException
     */
    thi$.deleteRow = function(){
        
    };
    
    /**
     * Inserts the contents of the insert row into this 
     * <code>ResultSet</code> object
     * 
     * @param values the values map or values array
     *
     * @exception SQLException
     */
    thi$.insertRow = function(values){
        
    };

    /**
     * Updates the current row from this <code>ResultSet</code> object.
     *
     * @param values the values map or values array
     * 
     * @exception SQLException
     */
    thi$.updateRow = function(values){
        
    };

    /**
     * Releases this <code>ResultSet</code> object
     * 
     */
    thi$.close = function(){
    };

};


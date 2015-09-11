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
 * Source code availability: https://github.com/jsvm/JSVM
 */

$package("js.sql");

/**
 * @param def:{
 *     colNum: the number of columns
 *     cols:[
 *         {
 *           name: column name
 *           dname: column display name
 *           sql: SQL type @see js.sql.Types
 *           sqlType: string, SQL type name of user defined
 *           autoIncrement: boolean true/false
 *           caseSensitive: boolean
 *           searchable: boolean
 *           readOnly: boolean
 *           currency: boolean
 *           precision: number
 *           scale: number
 *           schema: string
 *           table: string
 *           catalog: string
 *         }
 *     ]
 * }
 */
js.sql.ResultSetMetaData = function (def){
    
    var CLASS = js.sql.ResultSetMetaData, thi$ = CLASS.prototype;
    if(CLASS.__defined__){
        this._init.apply(this, arguments);
        return;
    }
    CLASS.__defined__ = true;

    var Class = js.lang.Class, System = J$VM.System, 
    SQLTypes = Class.forName("js.sql.Types");

    /**
     * Returns the number of columns in this <code>ResultSet</code> object.
     *
     * @return the number of columns
     * @exception SQLException if a database access error occurs
     */
    thi$.getColumnCount = function(){
        return this.colNum;
    };

    /**
     * Indicates whether the designated column is automatically numbered.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isAutoIncrement = function(column){
        _checkRange(column);
        return this.cols[column].autoIncrement || false;
    };

    /**
     * Indicates whether a column's case matters.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isCaseSensitive = function(column){
        _checkRange(column);
        return this.cols[column].caseSensitive || false;
    };

    /**
     * Indicates whether the designated column can be used in a where clause.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isSearchable = function(column){
        _checkRange(column);
        return this.cols[column].searchable || false;        
    };

    /**
     * Indicates whether the designated column is a cash value.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isCurrency = function(column){
        _checkRange(column);
        return this.cols[column].currency || false;        
    };

    /**
     * Indicates the nullability of values in the designated column.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return the nullability status of the given column; one of <code>columnNoNulls</code>,
     *          <code>columnNullable</code> or <code>columnNullableUnknown</code>
     * @exception SQLException if a database access error occurs
     */
    thi$.isNullable = function(column){
        _checkRange(column);
        return this.cols[column].nullability || CLASS.columnNoNulls;
    };

    /**
     * The constant indicating that a
     * column does not allow <code>NULL</code> values.
     */
    thi$.columnNoNulls = 0;

    /**
     * The constant indicating that a
     * column allows <code>NULL</code> values.
     */
    thi$.columnNullable = 1;

    /**
     * The constant indicating that the
     * nullability of a column's values is unknown.
     */
    thi$.columnNullableUnknown = 2;

    /**
     * Indicates whether values in the designated column are signed numbers.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isSigned = function(column){
        _checkRange(column);
        return this.cols[column].signed || false;
    };

    /**
     * Indicates the designated column's normal maximum width in characters.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return the normal maximum number of characters allowed as the width
     *          of the designated column
     * @exception SQLException if a database access error occurs
     */
    thi$.getColumnDisplaySize = function(column){
        _checkRange(column);
        return this.cols[column].displaysize || 80;
    };

    /**
     * Gets the designated column's suggested title for use in printouts and
     * displays. The suggested title is usually specified by the SQL <code>AS</code>
     * clause.  If a SQL <code>AS</code> is not specified, the value returned from
     * <code>getColumnLabel</code> will be the same as the value returned by the
     * <code>getColumnName</code> method.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return the suggested column title
     * @exception SQLException if a database access error occurs
     */
    thi$.getColumnLabel = function(column){
        _checkRange(column);
        
        var col = this.cols[column];
        return col.dname || col.name || ""; 
    };

    /**
     * Get the designated column's name.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return column name
     * @exception SQLException if a database access error occurs
     */
    thi$.getColumnName = function(column){
        _checkRange(column);
        return this.cols[column].name;        
    };

    /**
     * Get the designated column's table's schema.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return schema name or "" if not applicable
     * @exception SQLException if a database access error occurs
     */
    thi$.getSchemaName = function(column){
        _checkRange(column);
        return this.cols[column].schema;
    };

    /**
     * Get the designated column's specified column size.
     * For numeric data, this is the maximum precision.  
     * For character data, this is the length in characters.
     * For datetime datatypes, this is the length in characters of the 
     * String representation (assuming the maximum allowed precision 
     * of the fractional seconds component). For binary data, this is 
     * the length in bytes.  For the ROWID datatype, this is the length 
     * in bytes. 0 is returned for data types where the column size is 
     * not applicable.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return precision
     * @exception SQLException if a database access error occurs
     */
    thi$.getPrecision = function(column){
        _checkRange(column);
        return this.cols[column].precision || 0;        
    };

    /**
     * Gets the designated column's number of digits to right of the decimal point.
     * 0 is returned for data types where the scale is not applicable.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return scale
     * @exception SQLException if a database access error occurs
     */
    thi$.getScale = function(column){
        _checkRange(column);
        return this.cols[column].scale || 0;        
    };

    /**
     * Gets the designated column's table name.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return table name or "" if not applicable
     * @exception SQLException if a database access error occurs
     */
    thi$.getTableName = function(column){
        _checkRange(column);
        return this.cols[column].table;        
    };

    /**
     * Gets the designated column's table's catalog name.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return the name of the catalog for the table in which the given column
     *          appears or "" if not applicable
     * @exception SQLException if a database access error occurs
     */
    thi$.getCatalogName = function(column){
        _checkRange(column);
        return this.cols[column].catalog;        
    };

    /**
     * Retrieves the designated column's SQL type.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return SQL type from java.sql.Types
     * @exception SQLException if a database access error occurs
     * @see Types
     */
    thi$.getColumnType = function(column){
        _checkRange(column);
        return this.cols[column].sql;        
    };

    /**
     * Retrieves the designated column's database-specific type name.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return type name used by the database. If the column type is
     * a user-defined type, then a fully-qualified type name is returned.
     * @exception SQLException if a database access error occurs
     */
    thi$.getColumnTypeName = function(column){
        _checkRange(column);

        var col = this.cols[column];
        return col.sqlType || SQLTypes.getNameBySql(col.sql);        
    };

    /**
     * Indicates whether the designated column is definitely not writable.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isReadOnly = function(column){
        _checkRange(column);
        return this.cols[column].readOnly || false;        
    };

    /**
     * Indicates whether it is possible for a write on the designated column to succeed.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isWritable = function(column){
        return !this.isReadOnly(column);
    };

    /**
     * Indicates whether a write on the designated column will definitely succeed.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return <code>true</code> if so; <code>false</code> otherwise
     * @exception SQLException if a database access error occurs
     */
    thi$.isDefinitelyWritable = function(column){
        throw "SQLException: ";
    };

    //--------------------------JDBC 2.0-----------------------------------

    /**
     * <p>Returns the fully-qualified name of the Java class whose instances
     * are manufactured if the method <code>ResultSet.getObject</code>
     * is called to retrieve a value
     * from the column.  <code>ResultSet.getObject</code> may return a subclass of the
     * class returned by this method.
     *
     * @param column the first column is 1, the second is 2, ...
     * @return the fully-qualified name of the class in the Java programming
     *         language that would be used by the method
     * <code>ResultSet.getObject</code> to retrieve the value in the specified
     * column. This is the class name used for custom mapping.
     * @exception SQLException if a database access error occurs
     * @since 1.2
     */
    thi$.getColumnClassName = function(column){
        _checkRange(column);
        return this.cols[column].classType;        
    };

    var _checkRange = function(index){
        if(!Class.isNumber(index) || index < 1 || index > this.colNum) 
            throw "SQLException: Column index "+index+" is out of range";
    };

    thi$.findColumn = function(columnName){
        return this.colMap[columnName];
    };

    thi$.destroy = function(){
        delete this.cols;
        $super(this);
    }.$override(this.destroy);

    thi$._init = function(def){
        if(def == undefined) return;

        var R = js.lang.Math;        
        var colNum = this.colNum = Class.isNumber(def.colNum) ? def.colNum : 0,
        cols = this.cols = new Array(colNum + 1), 
        columns = def.cols || [], colDef, colMap = this.colMap = {};
        for(var i=0; i<colNum; i++){
            colDef = columns[i] || {name:"col"+i, sql:SQLTypes.CHAR};
            colDef = cols[i+1] = System.objectCopy(colDef, {}, true);
            colDef.colIndex = i+1;
            colDef.uuid = R.uuid();
            colMap[colDef.name] = colDef.colIndex;
        }
    };

    this._init.apply(this, arguments);

}.$extend(js.lang.Object);




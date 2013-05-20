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

js.sql.Types = new function (){
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>BIT</code>.
     */
    this.BIT        =  -7;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>TINYINT</code>.
     */
    this.TINYINT    =  -6;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>SMALLINT</code>.
     */
    this.SMALLINT   =   5;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>INTEGER</code>.
     */
    this.INTEGER    =   4;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>BIGINT</code>.
     */
    this.BIGINT         =  -5;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>FLOAT</code>.
     */
    this.FLOAT          =   6;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>REAL</code>.
     */
    this.REAL       =   7;
    
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>DOUBLE</code>.
     */
    this.DOUBLE         =   8;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>NUMERIC</code>.
     */
    this.NUMERIC    =   2;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>DECIMAL</code>.
     */
    this.DECIMAL        =   3;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>CHAR</code>.
     */
    this.CHAR       =   1;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>VARCHAR</code>.
     */
    this.VARCHAR    =  12;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>LONGVARCHAR</code>.
     */
    this.LONGVARCHAR    =  -1;
    
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>DATE</code>.
     */
    this.DATE       =  91;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>TIME</code>.
     */
    this.TIME       =  92;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>TIMESTAMP</code>.
     */
    this.TIMESTAMP      =  93;
    
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>BINARY</code>.
     */
    this.BINARY         =  -2;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>VARBINARY</code>.
     */
    this.VARBINARY      =  -3;
    
    /**
     * <P>The constant in the Java programming language, sometimes referred
     * to as a type code, that identifies the generic SQL type 
     * <code>LONGVARBINARY</code>.
     */
    this.LONGVARBINARY      =  -4;
    
    /**
     * <P>The constant in the Java programming language
     * that identifies the generic SQL value 
     * <code>NULL</code>.
     */
    this.NULL       =   0;
    
    /**
     * The constant in the Java programming language that indicates
     * that the SQL type is database-specific and
     * gets mapped to a Java object that can be accessed via
     * the methods <code>getObject</code> and <code>setObject</code>.
     */
    this.OTHER      = 1111;
    
    
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>JAVA_OBJECT</code>.
     * @since 1.2
     */
    this.JAVA_OBJECT          = 2000;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>DISTINCT</code>.
     * @since 1.2
     */
    this.DISTINCT             = 2001;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>STRUCT</code>.
     * @since 1.2
     */
    this.STRUCT               = 2002;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>ARRAY</code>.
     * @since 1.2
     */
    this.ARRAY                = 2003;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>BLOB</code>.
     * @since 1.2
     */
    this.BLOB                 = 2004;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>CLOB</code>.
     * @since 1.2
     */
    this.CLOB                 = 2005;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type
     * <code>REF</code>.
     * @since 1.2
     */
    this.REF                  = 2006;
    
    /**
     * The constant in the Java programming language, somtimes referred to
     * as a type code, that identifies the generic SQL type <code>DATALINK</code>.
     *
     * @since 1.4
     */
    this.DATALINK   = 70;
    
    /**
     * The constant in the Java programming language, somtimes referred to
     * as a type code, that identifies the generic SQL type <code>BOOLEAN</code>.
     *
     * @since 1.4
     */
    this.BOOLEAN  = 16;
    
    //------------------------- JDBC 4.0 -----------------------------------
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>ROWID</code>
     * 
     * @since 1.6
     *
     */
    this.ROWID  = -8;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>NCHAR</code>
     *
     * @since 1.6
     */
    this.NCHAR  = -15;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>NVARCHAR</code>.
     *
     * @since 1.6
     */
    this.NVARCHAR  = -9;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>LONGNVARCHAR</code>.
     *
     * @since 1.6
     */
    this.LONGNVARCHAR  = -16;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>NCLOB</code>.
     *
     * @since 1.6
     */
    this.NCLOB  = 2011;
    
    /**
     * The constant in the Java programming language, sometimes referred to
     * as a type code, that identifies the generic SQL type <code>XML</code>.
     *
     * @since 1.6 
     */
    this.SQLXML  = 2009;

    var _sqlMapName = {}, _nameMapsql = {};

    this.getNameBySql = function(sql){
        return _sqlMapName[""+sql];
    };

    this.getSqlByName = function(name){
        name = name || "";
        return _nameMapsql[name.toUpperCase()];
    };

    (function(){
         var Class = js.lang.Class, p, v;
         for(p in this){
             v = this[p];
             if(Class.isNumber(v)){
                 _sqlMapName[""+v] = p;
                 _nameMapsql[p] = v;
             }
         }         
     }).call(this);
};


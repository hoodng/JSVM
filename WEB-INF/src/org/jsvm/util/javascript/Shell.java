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
package org.jsvm.util.javascript;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;

import javax.script.Compilable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 *
 */
public final class Shell {

    private ScriptEngine engine;
    private Compilable compileE;

    public Shell() {
        engine = new ScriptEngineManager().getEngineByName("JavaScript");

        if (engine instanceof Compilable) {
            compileE = (Compilable) engine;
        }
    }

    public void execute(Reader file, String[] args) throws ScriptException {
        engine.put("__arguments__", args == null ? new String[] {} : args);

        if (compileE != null) {
            compileE.compile(file).eval();
        } else {
            engine.eval(file);
        }
    }

    public void execute(String js) throws ScriptException {
        if (compileE != null) {
            compileE.compile(js).eval();
        } else {
            engine.eval(js);
        }
    }

    /**
     * @param args
     */
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: Shell jsFile [params]");
            System.exit(-1);
        }

        File f = new File(args[0]);
        Reader reader = null;
        try {
            reader = new FileReader(f);
        } catch (FileNotFoundException e1) {
            System.err
                    .println("Can not found the file: " + f.getAbsolutePath());
            System.exit(-1);
        }

        String[] _args = null;
        if (args.length > 1) {
            _args = new String[args.length - 1];
            System.arraycopy(args, 1, _args, 0, _args.length);
        }

        boolean hasError = false;
        try {
            new Shell().execute(reader, _args);
        } catch (Exception e) {
            e.printStackTrace();
            hasError = true;
        } finally {
            try {
                reader.close();
            } catch (Exception e) {

            }
            System.exit(hasError ? -1 : 0);
        }
    }
}

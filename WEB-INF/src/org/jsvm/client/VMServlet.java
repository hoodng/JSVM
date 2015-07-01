/**
 * 
 */
package org.jsvm.client;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsvm.util.json.JSONObject;

/**
 * @author hoo
 *
 */
public class VMServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -392347618729073013L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		res.setHeader("Access-Control-Allow-Origin", "*");
		JSONObject o = new JSONObject();
		o.put("err", "00000000");
		res.setContentType("application/json;charset=UTF-8");
		res.getOutputStream().write(o.toString().getBytes("UTF-8"));
	}

	@Override
	public void destroy() {
		super.destroy();
	}

}

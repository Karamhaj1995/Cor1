<%@ WebHandler Language="C#" Class="ReturnValue" %>

using System;
using System.Web;

public class ReturnValue : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        string savedFileName = "";
        string length = "0";
        foreach (string file in context.Request.Files)
        {
            HttpPostedFile hpf = context.Request.Files[file] as HttpPostedFile;
            length = hpf.ContentLength.ToString();
            if (hpf.ContentLength == 0)
                continue;
            try
            {
                savedFileName = context.Server.MapPath(".") + "\\" + hpf.FileName + ".jpg";
            }
            catch (Exception ex)
            {
                context.Response.Write("there was an error: " + ex.Message);
                return;
            }

            hpf.SaveAs(savedFileName);
        }
        context.Response.Write(savedFileName);
        //context.Response.Write(savedFileName + " length is " + length);

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
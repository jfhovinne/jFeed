<%@ WebHandler Language="VB" Class="proxy" %>

Imports System
Imports System.Web
Imports System.Net
Imports System.IO

Public Class proxy : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim myHttpWebRequest As HttpWebRequest = WebRequest.Create(context.Request.QueryString("url"))
        Dim resp = myHttpWebRequest.GetResponse().GetResponseStream
        Dim sr As StreamReader = New StreamReader(resp)
        context.Response.ContentType = "application/xml"
        context.Response.Write(sr.ReadToEnd)
        context.Response.Flush()
        context.Response.End
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class

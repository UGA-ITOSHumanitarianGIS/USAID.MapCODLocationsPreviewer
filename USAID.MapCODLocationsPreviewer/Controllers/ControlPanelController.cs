using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace USAID.MapCODLocationsPreviewer.Controllers
{
    public class ControlPanelController : Controller
    {
        // GET: ControlPanel
        public ActionResult Index()
        {
            ViewBag.AppName = System.Configuration.ConfigurationManager.AppSettings["ApplicationName"];
            return View();
        }

        public ActionResult ManageProjectTypes()
        {
            ViewBag.AppName = System.Configuration.ConfigurationManager.AppSettings["ApplicationName"];
            return View();
        }
    }
}
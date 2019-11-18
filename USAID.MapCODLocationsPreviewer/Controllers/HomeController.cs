using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using System.Web.Security;
using System.Security.Principal;
using System.Threading;
using Newtonsoft.Json;
using System.Net.Http;

namespace USAID.MapCODLocationsPreviewer.Controllers
{
    public class HomeController : Controller
    {
        //DbContexts.ApplicationContext db = new DbContexts.ApplicationContext();

        public ActionResult Index()
        {
            ViewBag.AppName = System.Configuration.ConfigurationManager.AppSettings["ApplicationName"];
           
                try
                {

                    ViewData["ApplicationName"] = ConfigurationManager.AppSettings["ApplicationName"].ToString();

                    return View();
                }
                catch (Exception e)
                {
                    return RedirectToAction("Login");
                }

        }

        public ActionResult ControlPanel()
        {
            return View("ControlPanel");
        }
        public ActionResult ProjectOp()
        {
            return View("ProjectOp");
        }

     
        public ActionResult Disclaimer()
        {
            ViewBag.Title = "Disclaimer Page";
            return View();
        }



        public ActionResult LayerConfig()
        {
            try
            {
                //String role = System.Web.HttpContext.Current.Session["UserRole"].ToString();
                //var defExp = "USAID_UserRole = " + role + " AND Deleted = 0"; ;
                //if (role == "2")
                //    defExp = "Deleted = 0";
                //if (role == "5" || role == "6" || role == "7" || role == "8")
                //    defExp = "USAID_UserName = '" + User.Identity.Name + "' AND Deleted = 0";
                //if (role == "4")
                //var defExp = "USAID_UserRole in (4, 7) AND Deleted = 0";

                var layers = new List<object>();

                var l = new layer();

                
                l = new layer();
                l.url = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/ZWE_pcode/FeatureServer/0";
                l.type = "feature";
                l.id = "Admin0";
                l.name = "Zimbabwe Admin 0";
                l.visible = false;
                l.visibleLayers = new int[1] { 0 };
                l.indivLayersVisible = new int[1] { 0 };
                layers.Add(l);

                l = new layer();
                l.url = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/ZWE_pcode/FeatureServer/1";
                l.type = "feature";
                l.id = "Admin1";
                l.name = "Zimbabwe Admin 1";
                l.visible = false;
                l.visibleLayers = new int[1] { 1 };
                l.indivLayersVisible = new int[1] { 1 };
                layers.Add(l);

                l = new layer();
                l.url = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/ZWE_pcode/FeatureServer/2";
                l.type = "feature";
                l.id = "Admin2";
                l.name = "Zimbabwe Admin 2";
                l.visible = true;
                l.visibleLayers = new int[1] { 2 };
                l.indivLayersVisible = new int[1] { 2 };
                layers.Add(l);

                l = new layer();
                l.url = "https://gistmaps.itos.uga.edu/arcgis/rest/services/COD_External/ZWE_pcode/FeatureServer/3";
                l.type = "feature";
                l.id = "Admin3";
                l.name = "Zimbabwe Admin 3";
                l.visible = false;
                l.visibleLayers = new int[1] { 3 };
                l.indivLayersVisible = new int[1] { 3 };
                layers.Add(l);

                l = new layer();
                l.url = "https://s3.amazonaws.com/ITOS-Mapping/Georgia/Statewide/Tiles/FSA2009NIR/${level}/${col}/${row}.png";
                l.type = "webTileLayer";
                l.id = "FSA2009NIR";
                l.name = "Near-Infrared Imagery (NAIP 2009)";
                l.visible = false;
                layers.Add(l);

                l = new layer();
                l.url = "https://s3.amazonaws.com/ITOS-Mapping/Georgia/Statewide/Tiles/FSA2007/${level}/${col}/${row}.png";
                l.type = "webTileLayer";
                l.id = "FSA2007IS";
                l.name = "Color Imagery (NAIP2007)";
                l.visible = false;
                layers.Add(l);

                l = new layer();
                l.url = "https://s3.amazonaws.com/ITOS-Mapping/Georgia/Statewide/Tiles/FSA2010/${level}/${col}/${row}.png";
                l.type = "webTileLayer";
                l.id = "FSA2010IS";
                l.name = "FSA 2010";
                l.visible = false;
                layers.Add(l);

                l = new layer();
                l.url = "https://s3.amazonaws.com/ITOS-Mapping/Georgia/Statewide/Tiles/fsa2010nir/${level}/${col}/${row}.png";
                l.type = "webTileLayer";
                l.id = "FSA2010NIR";
                l.name = "Color Imagery (NAIP2010)";
                l.visible = false;
                layers.Add(l);

                return Json(layers);

            } catch (Exception e)
            {
                return RedirectToAction("Login", "Home");
            }
        }
    }

      
        
        internal class layer {
            public string id;
            public string url;
            public string  name;
            public string type;
            public Boolean visible;
            public string mode;
            public string infoTemplate;
            public string queryPredicate;
            public int[] visibleLayers;
            public int[] indivLayersVisible;
        
        }
    
} 

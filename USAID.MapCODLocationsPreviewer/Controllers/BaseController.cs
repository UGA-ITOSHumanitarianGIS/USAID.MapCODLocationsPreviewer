using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace USAID.MapCODLocationsPreviewer.Controllers
{
    abstract public class BaseController : Controller
    {
/*        protected ICodeDescriptionListService _CodeDescriptionListService;

        public BaseController(ICodeDescriptionListService codeDescriptionListService)
        {
            this._CodeDescriptionListService = codeDescriptionListService;
        }

        protected Dictionary<string, string> GetInfoDefinitionDictionary()
        {
            OperationStatus operationStatus = new OperationStatus();
            Dictionary<string, string> infoDictionary = new Dictionary<string, string>();
            List<SimpleListItem> infoDefinitions = _CodeDescriptionListService.GetList(ref operationStatus, ListDescriptionEnum.InfoDefinition, "");
            if (operationStatus.HasErrors) { PopulateModelStateErrorsFromServiceCallErrors(ref operationStatus); }
            else
            {
                foreach (SimpleListItem item in infoDefinitions)
                {
                    infoDictionary[item.Value] = item.Text;
                }
            }
            return infoDictionary;
        }

        protected void PopulateModelStateErrorsFromServiceCallErrors(ref OperationStatus operationStatus)
        {
            foreach (string message in operationStatus.Messages)
            {
                ModelState.AddModelError("", message);
            }
        }

        protected void PopulateModelStateErrorsFromServiceCallErrors(string message)
        {
            ModelState.AddModelError("", message);
        }*/
    }
}

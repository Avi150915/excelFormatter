sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet"
], (Controller, exportLibrary, Spreadsheet) => {
    "use strict";
    var pageThat;
    var EdmType = exportLibrary.EdmType;
    return Controller.extend("uploadexcel.controller.UploadExcel", {
        onInit() {
            pageThat = this;
            pageThat.EdmType = EdmType
        },
        onFileChange: function (oEvent) {
            this._import(oEvent.getParameter("files") && oEvent.getParameter("files")[0], oEvent.getSource().getId().split("--")[2]);
        },

        _import: function (file, Id) {
            var that = this;
            var ID = Id;
            pageThat.fileName = file.name.split(".xlsx")[0] + " Formated Version"
            if (file && window.FileReader && window.XLSX) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    // Read the workbook as a binary string (required by SheetJS)
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var excelData = [];

                    // Get data from the first sheet
                    var firstSheetName = workbook.SheetNames[0];
                    excelData = XLSX.utils.sheet_to_row_object_array(
                        workbook.Sheets[firstSheetName]
                    );
                    that.excelDataFirst = excelData
                    // if (ID === "fileUploader") {
                    //     that.excelDataFirst = excelData
                    // } else {
                    //     that.excelDataSecond = excelData
                    // }

                    // Map Excel headers to model properties (if necessary)
                    // For example, if Excel header is 'Emp ID', map to 'EmployeeID'


                    // Set the data to the JSON model

                };
                reader.readAsBinaryString(file);
            } else {
                MessageBox.error("File Reader or SheetJS library not available.");
            }
        },

        processChunk: function (index, totalItems, data, entreuser) {
            const chunkSize = 100; // Process 100 items at a time
            let endIndex = Math.min(index + chunkSize, totalItems);

            for (let i = index; i < endIndex; i++) {
                // Perform operations on data[i]
                console.log(`Processing item ${i}`);
            }

            if (endIndex < totalItems) {
                setTimeout(() => pageThat.processChunk(endIndex, totalItems, data, entreuser), 1000);
            } else {
                console.log("Processing complete!");
            }
        },
        onValidate1: function () {
            var Newcontractor = [];
            var EntraaData = this.excelDataFirst
            var contractorData = this.excelDataSecond
            sap.ui.core.BusyIndicator.show()
            var that = this;
            for (let i = 0; i < EntraaData.length; i++) {
                sap.ui.core.BusyIndicator.show()
                that.processChunk(0, contractorData.length, contractorData, EntraaData[i]);
                // setTimeout(function () {
                //     for (let j = 0; j < contractorData.length; j++) {

                //         if ((EntraaData[i].LOGONID !== contractorData[j].LOGONID && contractorData[j].ISDELETED !== "X")) {
                //             var newUser = {
                //                 loginID: EntraaData[i].LOGONID,
                //                 vendorId: EntraaData[i].VENDORID,
                //                 vendorName: EntraaData[i].VENDORNAME,
                //                 orgId: EntraaData[i].ORGANIZATIONID,
                //                 emailAddress: EntraaData[i].EMAILADDRESS
                //                 //   vendorId : EntraaData[i].Office.split("|")[0],
                //                 //   vendorName : EntraaData[i].Office.split("|")[0],
                //                 //   orgId : EntraaData[i].ORG.split("-")[0],
                //                 //   emailAddress: EntraaData[i].Second


                //             };
                //             Newcontractor.push(newUser);
                //             setTimeout(function () {
                //                 console.log("Second Completed")
                //             }, 1000)

                //         }



                //     }
                // }, 0);
                //


            }
            sap.ui.core.BusyIndicator.hide()
            console.log(Newcontractor);


        },
        onValidate: function () {
            var Newcontractor = [];

            var EntraaData = this.excelDataFirst
            for (let i = 0; i < EntraaData.length; i++) {
                console.log(EntraaData[i])
                var Obj = {
                    PersonId: "",
                    EID: EntraaData[i].Id.replaceAll("-", "").toUpperCase(),
                    FullName: EntraaData[i].DisplayName,
                    EmailAdress: EntraaData[i].OtherMails,
                    VendorName: EntraaData[i].Company,
                    VendorId: EntraaData[i].OfficeLocation !== "" ? EntraaData[i].OfficeLocation.split("|")[0] : "",
                    DeletedOn: "",
                    OrgID: EntraaData[i].Department !== "" ? EntraaData[i].Department.split("-")[0] : "",
                    LogonId: EntraaData[i].UserPrincipalName,






                };
                Newcontractor.push(Obj);
            }
            var JSONModel = new sap.ui.model.json.JSONModel();
            JSONModel.setSizeLimit(Newcontractor.length);
            JSONModel.setData({
                extContr: Newcontractor
            })
            pageThat.getView().setModel(JSONModel, "JSONModelData")



        },
        createColumnConfig: function () {
            const aCols = [];

            aCols.push({
                label: "PersonId",
                property: ["PersonId"],
                type: pageThat.EdmType.String,


            });
            aCols.push({
                label: "EID",
                type: pageThat.EdmType.String,
                property: "EID",
                scale: 5

            });

            aCols.push({
                label: "FullName",
                type: pageThat.EdmType.String,
                property: "FullName",

            });

            aCols.push({
                property: "EmailAdress",
                type: pageThat.EdmType.String,
                property: "EmailAdress"
            });

            aCols.push({
                property: "VendorId",
                type: pageThat.EdmType.String,
                property: "VendorId"
            });

            aCols.push({
                property: "VendorName",

                type: pageThat.EdmType.String,
                property: "VendorName"
            });
            aCols.push({
                property: "DeletedOn",

                type: pageThat.EdmType.String,
                property: "DeletedOn"
            });
            aCols.push({
                property: "OrgID",

                type: pageThat.EdmType.String,
                property: "OrgID"
            });

            aCols.push({
                property: "LogonId",

                type: pageThat.EdmType.String,
                property: "LogonId"
            });



            return aCols;
        },

        onExport: function () {
            if (!this._oTable) {
                this._oTable = pageThat.byId("excelDataTable");
            }

            const oTable = pageThat._oTable;
            const oRowBinding = oTable.getBinding("items");
            const aCols = pageThat.createColumnConfig();
            const oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: "Level"

                },
                dataSource: oRowBinding,
                fileName: pageThat.fileName,
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            const oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
        onCloseDialog:function(oEvent){
            

            if(pageThat.oDialog){
                pageThat.oDialog.close();
            }

        },
        onSelectListItm: function (oEvent) {
            var that = this;
            var spath = oEvent.getParameters().listItem.getBindingContextPath();
            if (!that.pDialog) {
                that.pDialog = that.loadFragment({
                    name: "uploadexcel.fragment.Dialog",
                    id: "diologId",
                    Controller:pageThat
                });
            }
            pageThat.pDialog.then(function (oDialog) {
                pageThat.oDialog=oDialog
                that.getView().addDependent(oDialog);
                oDialog.open();
                const sControlId = "userFormID";
                const oFormInput = that.byId(sap.ui.core.Fragment.createId("diologId", sControlId));
         
                oFormInput.bindElement({path: spath, model: "JSONModelData"})


            });
        }
    });
});
(function (module) {
    mifosX.controllers = _.extend(module, {
        SmsController: function (scope, resourceFactory, location,$rootScope) {
            scope.offices = [];
            scope.clients = [];
            scope.submt = false;
            //scope.officeId1 = 1
            scope.formData = {};
            scope.mobileNo = {};
            scope.selected = false;
            scope.client = [];
            scope.mobileNoForSending='';
            scope.data=[];
            scope.additionalNumber='';
            scope.MobileNumbers='';
            scope.complete1=false;
            scope.p = {};
            scope.a = {};
            scope.officeId1=$rootScope.ofId;
            scope.send=true;
            scope.activeClientStatus = 300;
            scope.clientSubStatus = "ClientSubStatus";

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices = data;
                scope.formData = {
                    officeId: scope.offices[0].id
                }
            });

            resourceFactory.codeValuesForCodeResources.getAllCodeValues({codeName: scope.clientSubStatus},function (data) {
                scope.clientSubStatusList = data;
            });

            scope.fetchClientBySubStatus = function (client) {
                if((scope.isUndefinedOrNull(scope.clntSubStaus)) || (!scope.isUndefinedOrNull(scope.clntSubStaus) && scope.clntSubStaus.name.length == 0)){
                    return true;
                }
                return angular.equals(client.subStatus.name, scope.clntSubStaus.name) ? true : false;
            }

            scope.isUndefinedOrNull = function(val) {
                return angular.isUndefined(val) || val === null || val.length == 0;
            }

            scope.addClient = function () {
                for (var i in this.formData.id) {
                    for (var j in scope.clients) {
                        if (scope.clients[j].id == this.formData.id[i]) {
                            scope.client.push(scope.clients[j]);
                            scope.clients.splice(j, 1);
                        }
                    }
                }

                this.formData.id = this.formData.id - 1;
            };

            scope.removeClient = function () {

                for (var i in this.formData.client) {
                    for (var j in scope.client) {
                        if (scope.client[j].id == this.formData.client[i]) {
                            scope.clients.push(scope.client[j]);
                            scope.client.splice(j, 1);
                        }
                    }
                }
                this.formData.client = this.formData.client - 1;
            };

            scope.select = function () {
                scope.selected = false;
                scope.mobileNo = scope.formData.id;
                scope.formData.mobileNo = scope.mobileNo;

            }

            scope.selectAll = function () {
                scope.selected = false;
                //reduce the size of clients by 1;
                this.formData.clients =this.formData.clients-1;
                for (var l in scope.clients) {
                    if(!scope.isUndefinedOrNull(scope.clntSubStaus) && scope.clients[l].subStatus.name == scope.clntSubStaus.name){
                        scope.client.push(scope.clients[l]);
                    }else if(scope.isUndefinedOrNull(scope.clntSubStaus)){
                        scope.client.push(scope.clients[l]);
                    }
                }
                var Index;
                for (var i=0; i<scope.client.length; i++) {
                    Index = scope.clients.indexOf(scope.client[i]);
                    if (Index > -1) {
                        scope.clients.splice(Index, 1);
                    }
                }
                //scope.client= scope.mobileNo;
                //scope.clients = [];

            }

            scope.clear = function () {
                for (var l in scope.client) {
                        scope.clients.push(scope.client[l]);
                }
                scope.client = [];
                scope.selected = false;
                scope.formData.mobileNo = " ";
                scope.formData.id = "";
                //reduce the size of selected client Array
                this.formData.client=this.formData.client-1;

                //scope.clients=scope.formData.client;
            }
            scope.cancle = function () {
                //scope.selected=false;
                scope.formData.messageText = " ";
            }
            var param = {};
            scope.filterText = "";
            param.officeId = scope.officeId1;
            var items = resourceFactory.clientResource.getAllClients(param, function (data) {
                scope.totalClients = data.totalFilteredRecords;
                scope.clients = data.pageItems;

            });


            scope.fetchClientByOfficeId = function (officeId) {
                scope.officeId1 = officeId;
                var params = {};
                params.officeId = officeId;
                params.clientStatus = scope.activeClientStatus;
                scope.formData.mobileNo = "";

                var items = resourceFactory.clientResource.getAllClients(params, function (data) {
                    scope.totalClients = data.totalFilteredRecords;
                    scope.clients = data.pageItems;

                });

                //scope.client = [];
            }

            scope.search = function () {
                scope.clients = [];
                scope.searchResults = [];
                scope.filterText = "";

                resourceFactory.globalSearch.search({query: scope.searchText}, function (data) {
                    var arrayLength = data.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var result = data[i];
                        var client = {};
                        client.status = {};
                        client.subStatus = {};
                        client.status.value = result.entityStatus.value;
                        client.status.code  = result.entityStatus.code;
                        if(result.entityType  == 'CLIENT'){
                            client.displayName = result.entityName;
                            client.accountNo = result.entityAccountNo;
                            client.id = result.entityId;
                            client.officeName = result.parentName;
                            client.externalId = result.entityExternalId;
                            //mobile no. newly added
                            client.mobileNo = result.entityMobileNo;
                            // alert(result.externalId);
                            scope.clients.push(client);
                        }else if (result.entityType  == 'CLIENTIDENTIFIER'){
                            client.displayName = result.parentName;
                            client.id = result.parentId;
                            scope.clients.push(client);
                        }
                    }
                });

            }


            scope.sendMessage = function () {
                for(var i in scope.client){
                    if(scope.client[i].mobileNo!=null && scope.client[i].mobileNo!="") {
                        scope.mobileNoForSending = scope.mobileNoForSending + scope.client[i].mobileNo +"-"+scope.client[i].displayName+"-"+scope.client[i].id+",";
                    }
                }
                if(angular.isUndefined(scope.formData.additionalNumber)||scope.formData.additionalNumber=="")
                {
                    scope.MobileNumbers=scope.mobileNoForSending.substring(0,scope.mobileNoForSending.length-1);
                }
                else{
                    scope.MobileNumbers=scope.mobileNoForSending+scope.formData.additionalNumber;
                }
                var params = {};
                params.datatable="OfficeDetails";
                params.apptableId=scope.formData.officeId;
                params.order=null;
                scope.t="";

                resourceFactory.datatableResource.getsmsEnableOffice(params,function (data) {
                    if (data[0] != null) {
                        scope.p = data[0];
                    }
                    var isSendSms = scope.p.sms_enabled;
                    if(isSendSms=='true' ){
                        var messagejson = {};
                        messagejson.target = scope.MobileNumbers;
                        messagejson.type = "sms";
                        messagejson.entity_id = scope.formData.officeId;
                        messagejson.message = scope.formData.messageText;
                        resourceFactory.notificationResource.post(messagejson, function (data) {
                          //  var response=data.valueOf();
                            scope.complete1=true;

                        });


                    }else  {
                        scope.send=false;
                    }
                });

                scope.mobileNoForSending='';



            }
        }




    });
    mifosX.ng.application.controller('SmsController', ['$scope', 'ResourceFactory', '$location','$rootScope' ,mifosX.controllers.SmsController]).run(function ($log) {
        $log.info("SmsController initialized");
    });
}(mifosX.controllers || {}));
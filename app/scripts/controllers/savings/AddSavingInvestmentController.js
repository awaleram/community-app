(function (module) {
    mifosX.controllers = _.extend(module, {
        AddSavingInvestmentController: function (scope, location, resourceFactory, routeParams) {
            scope.formData = {};

            scope.clients = [];
            scope.names = [];
            scope.loan = [];
            resourceFactory.clientResource.getAllClients(function(data){
                scope.clients = data.pageItems;
            });

            scope.gotoBack = function(){
                location.path('/viewsavingaccount/' + routeParams.id);
            };

            scope.selectLoans = function(id) {
                scope.loans = [];
                resourceFactory.clientAccountResource.get({clientId: scope.formData.id}, function (data) {

                    if(data.loanAccounts) {
                        scope.names = data.loanAccounts;
                        for (var i = 0; i < scope.names.length; i++) {
                            scope.name = scope.names[i].productName;
                            scope.acno = scope.names[i].accountNo;
                            scope.fullname = scope.acno + '-' + scope.name;
                            scope.loans.push({productName: scope.fullname, Id: scope.names[i].id});
                        }
                    }
                    else{
                        scope.names = [];
                        scope.loans = [];
                    }
                    scope.loan = scope.loans;
                });
            };

            scope.loanes =[];
            scope.sample = [];

            scope.addInvestment = function(Id){

                resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: scope.formData.Id , associations: 'all',exclude: 'guarantors'}, function (data) {
                    scope.loanes = data;
                       if(scope.sample.length==0) {
                           scope.sample.push({
                               clientName: scope.loanes.clientName, loanProductName: scope.loanes.loanProductName,
                               accountNo: scope.loanes.accountNo, principal: scope.loanes.principal, id: scope.loanes.id
                           });
                       }

                     else{
                           var count = 0;
                           for(var i=0 ; i<scope.sample.length ; i++){

                              if(scope.sample[i].id == scope.loanes.id){
                                  count ++;
                              }
                           }

                           if(count == 0){
                               scope.sample.push({
                                   clientName: scope.loanes.clientName, loanProductName: scope.loanes.loanProductName,
                                   accountNo: scope.loanes.accountNo, principal: scope.loanes.principal, id: scope.loanes.id
                               });
                           }
                       }
                });
            };

            scope.abc = function(){

                scope.loanId = [];
                for(var i =0 ; i<scope.sample.length; i++){
                 scope.loanId.push(scope.sample[i].id);
                }
                scope.savingId = routeParams.id;
                resourceFactory.savingsInvestmentResource.save( {savingId: this.savingId, loanId: this.loanId}, function (data) {
                  //  alert("record saved sucessfully .....!");

                    location.path('/viewsavingaccount/' + routeParams.id);
                });
            };



        }

    });
    mifosX.ng.application.controller('AddSavingInvestmentController', ['$scope', '$location', 'ResourceFactory','$routeParams', mifosX.controllers.AddSavingInvestmentController]).run(function ($log) {
        $log.info("AddSavingInvestmentController initialized");
    });
}(mifosX.controllers || {}));

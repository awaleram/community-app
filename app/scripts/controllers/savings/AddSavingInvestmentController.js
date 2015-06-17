(function (module) {
    mifosX.controllers = _.extend(module, {
        AddSavingInvestmentController: function (scope, location, resourceFactory, routeParams, route) {
            scope.formData = {};

            scope.clients = [];
            scope.names = [];
            scope.loans = [];
            resourceFactory.clientResource.getAllClients(function(data){
                scope.clients = data.pageItems;
            });

            scope.gotoBack = function(){
                location.path('/viewsavingaccount/' + routeParams.id);
            };

            scope.selectLoans = function(id) {
                scope.loan = [];
                resourceFactory.clientAccountResource.get({clientId: scope.formData.id}, function (data) {

                    if(data.loanAccounts) {
                        scope.names = data.loanAccounts;
                        for (var i = 0; i < scope.names.length; i++) {
                            scope.name = scope.names[i].productName;
                            scope.acno = scope.names[i].accountNo;
                            scope.fullname = scope.acno + '-' + scope.name;
                            scope.loan.push({productName: scope.fullname, Id: scope.names[i].id});
                        }
                    }
                    else{
                        scope.names = null;
                        scope.loans = null;
                    }
                    scope.loans = scope.loan;
                });
            };

            scope.loanData =[];
            scope.savingInvestment = [];
            resourceFactory.savingsInvestmentResource.get({savingId: routeParams.id},function (data) {
                scope.savingInvestment = data;

            });

            scope.addInvestment = function(Id){

                resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: scope.formData.Id , associations: 'all',exclude: 'guarantors'}, function (data) {
                    scope.loanData = data;
                       if(scope.savingInvestment.length==0) {
                           scope.savingInvestment.push({
                               name: scope.loanData.clientName, productname: scope.loanData.loanProductName,
                               accountno: scope.loanData.accountNo, loanammount: scope.loanData.principal,  loan_id: scope.loanData.id
                           });
                       }

                     else{
                           var count = 0;
                           for(var i=0 ; i<scope.savingInvestment.length ; i++){

                              if(scope.savingInvestment[i].loan_id == scope.loanData.id){
                                  count ++;
                                  alert(" Loan Account Already Added ....! ");
                              }
                           }

                           if(count == 0){
                               scope.savingInvestment.push({
                                   name: scope.loanData.clientName, productname: scope.loanData.loanProductName,
                                   accountno: scope.loanData.accountNo, loanammount: scope.loanData.principal, loan_id: scope.loanData.id
                               });
                           }
                       }
                });
            };


            scope.submitData = function(){

                scope.loanId = [];
                for(var i =0 ; i<scope.savingInvestment.length; i++){
                 scope.loanId.push(scope.savingInvestment[i].loan_id);
                }
                scope.savingId = routeParams.id;
                resourceFactory.savingsInvestmentResource.save( {savingId: this.savingId, loanId: this.loanId}, function (data) {
                    location.path('/viewsavingaccount/' + routeParams.id);
                });
            };



        }

    });
    mifosX.ng.application.controller('AddSavingInvestmentController', ['$scope', '$location', 'ResourceFactory','$routeParams','$route', mifosX.controllers.AddSavingInvestmentController]).run(function ($log) {
        $log.info("AddSavingInvestmentController initialized");
    });
}(mifosX.controllers || {}));

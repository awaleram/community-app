(function (module) {
    mifosX.controllers = _.extend(module, {
        AddSavingInvestmentController: function (scope, location, resourceFactory) {
        scope.formData = {};

          scope.clients = [];
          scope.names = [];
            scope.loan = [];
            resourceFactory.clientResource.getAllClients(function(data){
                scope.clients = data.pageItems;
            });

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
                        scope.sample.push({
                            clientName: scope.loanes.clientName, loanProductName: scope.loanes.loanProductName,
                            accountNo: scope.loanes.accountNo, principal: scope.loanes.principal, id: scope.loanes.id
                        });
                });
            };

        }
    });
    mifosX.ng.application.controller('AddSavingInvestmentController', ['$scope', '$location', 'ResourceFactory', mifosX.controllers.AddSavingInvestmentController]).run(function ($log) {
        $log.info("AddSavingInvestmentController initialized");
    });
}(mifosX.controllers || {}));

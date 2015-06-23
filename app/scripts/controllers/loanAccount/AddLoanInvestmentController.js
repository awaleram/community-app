(function (module) {
    mifosX.controllers = _.extend(module, {
        AddLoanInvestmentController: function (scope, location, resourceFactory, routeParams, route) {
            scope.formData = {};

            scope.groups = [];
            scope.names = [];
            scope.loans = [];
            resourceFactory.groupResource.getAllGroups(function(data){
                scope.groups = data;

            });

            scope.gotoBack = function(){
                window.history.back();
            };


            scope.selectSaving = function(id) {
                scope.loan = [];
                resourceFactory.groupAccountResource.get({groupId: scope.formData.id}, function (data) {

                    if(data.savingsAccounts) {
                        scope.names = data.savingsAccounts;
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
            scope.loanInvestment = [];
            resourceFactory.loanInvestmentResource.get({loanId: routeParams.id},function (data) {
                scope.loanInvestment = data;

            });

            scope.addInvestment = function(Id){

                resourceFactory.savingsResource.get({accountId: scope.formData.Id, associations: 'all'}, function (data) {
                    scope.savingData = data;
                    if(scope.loanInvestment.length==0) {
                        scope.loanInvestment.push({
                            name: scope.savingData.groupName, productname: scope.savingData.savingsProductName,
                            accountno: scope.savingData.accountNo, savingamount: scope.savingData.summary.accountBalance,  saving_id : scope.savingData.id
                        });
                    }

                   else{
                        var count = 0;
                        for(var i=0 ; i<scope.loanInvestment.length ; i++){

                            if(scope.loanInvestment[i].saving_id == scope.savingData.id){
                                count ++;
                                alert(" Loan Account Already Added ....! ");
                            }
                        }

                        if(count == 0){
                            scope.loanInvestment.push({
                                name: scope.savingData.groupName, productname: scope.savingData.savingsProductName,
                                accountno: scope.savingData.accountNo, savingamount: scope.savingData.summary.accountBalance, saving_id: scope.savingData.id
                            });
                        }
                    }
                });
            };


            scope.submitData = function(){

                scope.savingId = [];
                for(var i =0 ; i<scope.loanInvestment.length; i++){
                    scope.savingId.push(scope.loanInvestment[i].saving_id);
                }
                scope.loanId = routeParams.id;
                resourceFactory.loanInvestmentResource.save( {savingId: this.savingId, loanId: this.loanId}, function (data) {
                    location.path('/viewloanaccount/' + routeParams.id);
                });
            };



        }

    });
    mifosX.ng.application.controller('AddLoanInvestmentController', ['$scope', '$location', 'ResourceFactory','$routeParams','$route', mifosX.controllers.AddLoanInvestmentController]).run(function ($log) {
        $log.info("AddLoanInvestmentController initialized");
    });
}(mifosX.controllers || {}));

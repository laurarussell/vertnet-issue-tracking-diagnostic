require('bootstrap/dist/css/bootstrap.css');
require('angular');
require('angular-resource');

var nodes = angular.module('dataset', []);

nodes.controller('DatasetController', ['$http', function($http) {
  var self = this;

  var cdbAPI = 'http://vertnet.cartodb.com/api/v2/sql?q=SELECT%20icode,orgname,github_orgname,github_reponame,lastindexed,url,ipt%20FROM%20resource%20WHERE%20ipt=true%20AND%20networks%20LIKE%20%27%25VertNet%25%27';
  var githubAPI ='https://api.github.com/search/issues?q=repo:';

  self.datasets = [];

  // Call the VN CartoDB API to get the list of VN datasets.
  var getDatasets = function() {

    $http.get(cdbAPI).success(function (data) {
      self.datasets = data.rows;



      // load each GitHub count
      angular.forEach(self.datasets, function(dataset) {
        console.log(dataset);
        $http.get(githubAPI + dataset.github_orgname + '/ '+ dataset.github_reponame + '+is:issue+is:closed+-label:report').success(function (data) {
          dataset.total_count = data;
        });
      });
    });
  }

  // call the function to populate the node list
  getDatasets();
}]);

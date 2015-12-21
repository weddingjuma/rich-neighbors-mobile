angular.module('app.services', [])

.factory('Campaign', ['$http', 'HOST_URL', 'AuthService', function($http, HOST_URL, AuthService) {

  var campaigns = [];
  var selectedCampaign = {};


  var getCampaigns = function(id) {
    id = id || '';
    return $http({
      method: 'GET',
      url: HOST_URL + '/api/campaigns/' + id,
      dataType: 'application/json',
    }).then(function successCallback(response) {
      campaigns = response.data;
      return response.data;
    }, function errorCallback(response) {
      console.log(response);
      //handle error
    });
  };

  var createCampaign = function(newCampaign, volunteers, supplies) {
    //var user = AuthService.currentUser();
    //newCampaign.user = user._id;
    console.log('params', AuthService.authParams());
    return $http.post(HOST_URL + '/api/campaigns' + AuthService.authParams(), newCampaign)
      .success(function(data){
        console.log('campaign res:', data);
        var campaign_id = data._id;
        //add volunteers
        volunteers.forEach(function(volunteer){
          volunteer['campaign_id'] = campaign_id;
          $http.post(HOST_URL + '/api/volunteers' + AuthService.authParams(), volunteer)
            .success(function(data){
              console.log('saved', data);
            })
            .error(function(err){
              console.error(err);
            });
        });
        //add supplies
        supplies.forEach(function(item){
          item['campaign_id'] = campaign_id;
          $http.post(HOST_URL + '/api/items' + AuthService.authParams(), item)
            .success(function(data){
              console.log('saved', data);
            })
            .error(function(err){
              console.error(err);
            });
        });
      })
      .error(function(err){
        console.log('Failed to save campaign');
        console.error(err);
      });
  };

  // initial load of campaigns
  getCampaigns().then(function(data) {
    campaigns = data;
  });


  return {
    campaigns: campaigns,
    createCampaign: createCampaign,
    getCampaigns: getCampaigns,
    selectedCampaign: selectedCampaign
  };

}]);

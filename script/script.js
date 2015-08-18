var module = angular.module('app', []);

module.service('UserService', function ($http) {
    //to create unique user id
    var uid = 1;
    
    //users array to hold list of all users
    var users = [];

    //save method create a new user if not already exists
    //else update the existing object
    this.save = function (user) {
        if (user.id == null) {
            //if this is new user, add it in users array
            user.id = uid++;
            users.push(user);
        } else {
            //for existing user, find this user using id
            //and update it.
            for (i in users) {
                if (users[i].id == user.id) {
                    users[i] = user;
                }
            }
        }
    }

    //simply search users list for given id
    //and returns the user object if found
    this.get = function (id) {
        for (i in users) {
            if (users[i].id == id) {
                return users[i];
            }
        }

    }
    
    //iterate through users list and delete 
    //user if found
    this.delete = function (id) {
        for (i in users) {
            if (users[i].id == id) {
                users.splice(i, 1);
            }
        }
    }

    //simply returns the users list
    this.list = function(callback) {

        $http({method:"GET", url:"http://footylist.local/users.json"})
            .then(function(result){
                users = result.data;
                callback(users);
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("error: " + response);
            });
    };

});


module.controller('UserController', function ($scope, UserService) {

    UserService.list(function(result) {  // this is only run after $http completes
       $scope.users = result;
    });

    $scope.saveUser = function () {
        UserService.save($scope.newuser);
        $scope.newuser = {};
    }


    $scope.delete = function (id) {

        UserService.delete(id);
        if ($scope.newuser.id == id) $scope.newuser = {};
    }


    $scope.edit = function (id) {
        $scope.newuser = angular.copy(UserService.get(id));
    }
})

module.directive('addToggles', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if(scope.user.playing=="1"){
                $(element).prop('checked', true);
            }
            $(element).bootstrapSwitch();
        }
    };
});
'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'ngauge-meanjs';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('datasteps');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('golds');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('jobs');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('jobtemplates');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('judgments');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tweets');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('units');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('workers');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('workflows');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('datasteps').config(['$stateProvider',
	function($stateProvider) {
		// Datasteps state routing
		$stateProvider.
		state('listDatasteps', {
			url: '/datasteps',
			templateUrl: 'modules/datasteps/views/list-datasteps.client.view.html'
		}).
		state('createDatastep', {
			url: '/datasteps/create',
			templateUrl: 'modules/datasteps/views/create-datastep.client.view.html'
		}).
		state('viewDatastep', {
			url: '/datasteps/:datastepId',
			templateUrl: 'modules/datasteps/views/view-datastep.client.view.html'
		}).
		state('editDatastep', {
			url: '/datasteps/:datastepId/edit',
			templateUrl: 'modules/datasteps/views/edit-datastep.client.view.html'
		});
	}
]);
'use strict';

// Datasteps controller
angular.module('datasteps').controller('DatastepsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Datasteps',
	function($scope, $stateParams, $location, Authentication, Datasteps ) {
		$scope.authentication = Authentication;

		// Create new Datastep
		$scope.create = function() {
			// Create new Datastep object
			var datastep = new Datasteps ({
				name: this.name
			});

			// Redirect after save
			datastep.$save(function(response) {
				$location.path('datasteps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Datastep
		$scope.remove = function( datastep ) {
			if ( datastep ) { datastep.$remove();

				for (var i in $scope.datasteps ) {
					if ($scope.datasteps [i] === datastep ) {
						$scope.datasteps.splice(i, 1);
					}
				}
			} else {
				$scope.datastep.$remove(function() {
					$location.path('datasteps');
				});
			}
		};

		// Update existing Datastep
		$scope.update = function() {
			var datastep = $scope.datastep ;

			datastep.$update(function() {
				$location.path('datasteps/' + datastep._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Datasteps
		$scope.find = function() {
			$scope.datasteps = Datasteps.query();
		};

		// Find existing Datastep
		$scope.findOne = function() {
			$scope.datastep = Datasteps.get({ 
				datastepId: $stateParams.datastepId
			});
		};
	}
]);
'use strict';

//Datasteps service used to communicate Datasteps REST endpoints
angular.module('datasteps').factory('Datasteps', ['$resource',
	function($resource) {
		return $resource('api/datasteps/:datastepId', { datastepId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('golds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Golds', 'golds', 'dropdown', '/golds(/create)?');
		Menus.addSubMenuItem('topbar', 'golds', 'List Golds', 'golds');
		Menus.addSubMenuItem('topbar', 'golds', 'New Gold', 'golds/create');
	}
]);
'use strict';

//Setting up route
angular.module('golds').config(['$stateProvider',
	function($stateProvider) {
		// Golds state routing
		$stateProvider.
		state('listGolds', {
			url: '/golds',
			templateUrl: 'modules/golds/views/list-golds.client.view.html'
		}).
		state('createGold', {
			url: '/golds/create',
			templateUrl: 'modules/golds/views/create-gold.client.view.html'
		}).
		state('viewGold', {
			url: '/golds/:goldId',
			templateUrl: 'modules/golds/views/view-gold.client.view.html'
		}).
		state('editGold', {
			url: '/golds/:goldId/edit',
			templateUrl: 'modules/golds/views/edit-gold.client.view.html'
		});
	}
]);
'use strict';

// Golds controller
angular.module('golds').controller('GoldsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Golds',
	function($scope, $stateParams, $location, Authentication, Golds ) {
		$scope.authentication = Authentication;

		// Create new Gold
		$scope.create = function() {
			// Create new Gold object
			var gold = new Golds ({
				name: this.name
			});

			// Redirect after save
			gold.$save(function(response) {
				$location.path('golds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gold
		$scope.remove = function( gold ) {
			if ( gold ) { gold.$remove();

				for (var i in $scope.golds ) {
					if ($scope.golds [i] === gold ) {
						$scope.golds.splice(i, 1);
					}
				}
			} else {
				$scope.gold.$remove(function() {
					$location.path('golds');
				});
			}
		};

		// Update existing Gold
		$scope.update = function() {
			var gold = $scope.gold ;

			gold.$update(function() {
				$location.path('golds/' + gold._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Golds
		$scope.find = function() {
			$scope.golds = Golds.query();
		};

		// Find existing Gold
		$scope.findOne = function() {
			$scope.gold = Golds.get({ 
				goldId: $stateParams.goldId
			});
		};
	}
]);
'use strict';

//Golds service used to communicate Golds REST endpoints
angular.module('golds').factory('Golds', ['$resource',
	function($resource) {
		return $resource('api/golds/:goldId', { goldId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('jobs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Jobs', 'jobs', 'dropdown', '/jobs(/create)?');
		Menus.addSubMenuItem('topbar', 'jobs', 'List Jobs', 'jobs');
		Menus.addSubMenuItem('topbar', 'jobs', 'New Job', 'jobs/create');
	}
]);
'use strict';

//Setting up route
angular.module('jobs').config(['$stateProvider',
	function($stateProvider) {
		// Jobs state routing
		$stateProvider.
		state('listJobs', {
			url: '/jobs',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		state('createJob', {
			url: '/jobs/create',
			templateUrl: 'modules/jobs/views/create-job.client.view.html'
		}).
		state('viewJob', {
			url: '/jobs/:jobId',
			templateUrl: 'modules/jobs/views/view-job.client.view.html'
		}).
		state('editJob', {
			url: '/jobs/:jobId/edit',
			templateUrl: 'modules/jobs/views/edit-job.client.view.html'
		});
	}
]);
'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobs',
	function($scope, $stateParams, $location, Authentication, Jobs ) {
		$scope.authentication = Authentication;

		// Create new Job
		$scope.create = function() {
			// Create new Job object
			var job = new Jobs ({
				name: this.name
			});

			// Redirect after save
			job.$save(function(response) {
				$location.path('jobs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Job
		$scope.remove = function( job ) {
			if ( job ) { job.$remove();

				for (var i in $scope.jobs ) {
					if ($scope.jobs [i] === job ) {
						$scope.jobs.splice(i, 1);
					}
				}
			} else {
				$scope.job.$remove(function() {
					$location.path('jobs');
				});
			}
		};

		// Update existing Job
		$scope.update = function() {
			var job = $scope.job ;

			job.$update(function() {
				$location.path('jobs/' + job._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Jobs
		$scope.find = function() {
			$scope.jobs = Jobs.query();
		};

		// Find existing Job
		$scope.findOne = function() {
			$scope.job = Jobs.get({ 
				jobId: $stateParams.jobId
			});
		};
	}
]);
'use strict';

//Jobs service used to communicate Jobs REST endpoints
angular.module('jobs').factory('Jobs', ['$resource',
	function($resource) {
		return $resource('api/jobs/:jobId', { jobId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('jobtemplates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Jobtemplates', 'jobtemplates', 'dropdown', '/jobtemplates(/create)?');
		Menus.addSubMenuItem('topbar', 'jobtemplates', 'List Jobtemplates', 'jobtemplates');
		Menus.addSubMenuItem('topbar', 'jobtemplates', 'New Jobtemplate', 'jobtemplates/create');
	}
]);
'use strict';

//Setting up route
angular.module('jobtemplates').config(['$stateProvider',
	function($stateProvider) {
		// Jobtemplates state routing
		$stateProvider.
		state('listJobtemplates', {
			url: '/jobtemplates',
			templateUrl: 'modules/jobtemplates/views/list-jobtemplates.client.view.html'
		}).
		state('createJobtemplate', {
			url: '/jobtemplates/create',
			templateUrl: 'modules/jobtemplates/views/create-jobtemplate.client.view.html'
		}).
		state('viewJobtemplate', {
			url: '/jobtemplates/:jobtemplateId',
			templateUrl: 'modules/jobtemplates/views/view-jobtemplate.client.view.html'
		}).
		state('editJobtemplate', {
			url: '/jobtemplates/:jobtemplateId/edit',
			templateUrl: 'modules/jobtemplates/views/edit-jobtemplate.client.view.html'
		});
	}
]);
'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTBaseCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;

    $scope.models = ['Tweet'];

    // Find a list of Jobtemplates
    $scope.find = function() {
      $scope.jobtemplates = Jobtemplates.query();
    };

    // Find existing Jobtemplate
    $scope.findOne = function() {
      $scope.jobtemplate = Jobtemplates.get({
        jobtemplateId: $stateParams.jobtemplateId
      });
      console.log($scope);
    };
  }
]);

'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JTEditCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
    $scope.authentication = Authentication;
    $scope.fields = [];


    $scope.jobtemplate = Jobtemplates.get(
      {  jobtemplateId: $stateParams.jobtemplateId  }, // Query
      function (jts) {
        var fields = $scope.jobtemplate.fields;
        for(var i=0; i<fields.length; i++){
          $scope.fields.push({
            value: fields[i]
          });
        }
    });

    $scope.addField = function () {
      $scope.fields.push({value:''});
    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.fields.splice(index, 1);
      }
    };

    // Update existing Jobtemplate
    $scope.update = function() {
      var jobtemplate = $scope.jobtemplate ;
      for (var i=0; i<$scope.fields.length; i++){
        jobtemplate.fields[i] = $scope.fields[i].value;
      }

      jobtemplate.$update(function() {
        $location.path('jobtemplates/' + jobtemplate._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

// Jobtemplates controller
angular.module('jobtemplates').controller('JobtemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobtemplates',
	function($scope, $stateParams, $location, Authentication, Jobtemplates ) {
		$scope.authentication = Authentication;

    $scope.models = ['Tweet'];

    $scope.addField = function () {
      $scope.fields.push({value:""});

    };

    $scope.removeField = function (index) {
      if(index>-1){
        $scope.fields.splice(index, 1);
      }
    };

    $scope.prepCreate= function () {
      $scope.fields = [];
    };

		// Create new Jobtemplate
		$scope.create = function() {
      /** @todo Make a create controller. */
      var fields = [];
      for(var i=0; i< this.fields.length; i++){
        fields.push(this.fields[i].value);
      }

			// Create new Jobtemplate object
			var jobtemplate = new Jobtemplates ({
				name: this.name,
        model: this.model,
        data: {
          css: this.css,
          js: this.js,
          cml: this.cml
        },
        fields: fields
			});

			// Redirect after save
			jobtemplate.$save(function(response) {
				$location.path('jobtemplates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Jobtemplate
		$scope.remove = function( jobtemplate ) {
      /** @todo move to another controller. */
			if ( jobtemplate ) { jobtemplate.$remove();

				for (var i in $scope.jobtemplates ) {
					if ($scope.jobtemplates [i] === jobtemplate ) {
						$scope.jobtemplates.splice(i, 1);
					}
				}
			} else {
				$scope.jobtemplate.$remove(function() {
					$location.path('jobtemplates');
				});
			}
		};


		// Find a list of Jobtemplates
		$scope.find = function() {
			$scope.jobtemplates = Jobtemplates.query();
		};

		// Find existing Jobtemplate
		$scope.findOne = function() {
			$scope.jobtemplate = Jobtemplates.get({ 
				jobtemplateId: $stateParams.jobtemplateId
			});
		};
	}
]);
'use strict';

//Jobtemplates service used to communicate Jobtemplates REST endpoints
angular.module('jobtemplates').factory('Jobtemplates', ['$resource',
	function($resource) {
		return $resource('api/jobtemplates/:jobtemplateId', { jobtemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('judgments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Judgments', 'judgments', 'dropdown', '/judgments(/create)?');
		Menus.addSubMenuItem('topbar', 'judgments', 'List Judgments', 'judgments');
		Menus.addSubMenuItem('topbar', 'judgments', 'New Judgment', 'judgments/create');
	}
]);
'use strict';

//Setting up route
angular.module('judgments').config(['$stateProvider',
	function($stateProvider) {
		// Judgments state routing
		$stateProvider.
		state('listJudgments', {
			url: '/judgments',
			templateUrl: 'modules/judgments/views/list-judgments.client.view.html'
		}).
		state('createJudgment', {
			url: '/judgments/create',
			templateUrl: 'modules/judgments/views/create-judgment.client.view.html'
		}).
		state('viewJudgment', {
			url: '/judgments/:judgmentId',
			templateUrl: 'modules/judgments/views/view-judgment.client.view.html'
		}).
		state('editJudgment', {
			url: '/judgments/:judgmentId/edit',
			templateUrl: 'modules/judgments/views/edit-judgment.client.view.html'
		});
	}
]);
'use strict';

// Judgments controller
angular.module('judgments').controller('JudgmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Judgments',
	function($scope, $stateParams, $location, Authentication, Judgments ) {
		$scope.authentication = Authentication;

		// Create new Judgment
		$scope.create = function() {
			// Create new Judgment object
			var judgment = new Judgments ({
				name: this.name
			});

			// Redirect after save
			judgment.$save(function(response) {
				$location.path('judgments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Judgment
		$scope.remove = function( judgment ) {
			if ( judgment ) { judgment.$remove();

				for (var i in $scope.judgments ) {
					if ($scope.judgments [i] === judgment ) {
						$scope.judgments.splice(i, 1);
					}
				}
			} else {
				$scope.judgment.$remove(function() {
					$location.path('judgments');
				});
			}
		};

		// Update existing Judgment
		$scope.update = function() {
			var judgment = $scope.judgment ;

			judgment.$update(function() {
				$location.path('judgments/' + judgment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Judgments
		$scope.find = function() {
			$scope.judgments = Judgments.query();
		};

		// Find existing Judgment
		$scope.findOne = function() {
			$scope.judgment = Judgments.get({ 
				judgmentId: $stateParams.judgmentId
			});
		};
	}
]);
'use strict';

//Judgments service used to communicate Judgments REST endpoints
angular.module('judgments').factory('Judgments', ['$resource',
	function($resource) {
		return $resource('api/judgments/:judgmentId', { judgmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('tweets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tweets', 'tweets', 'dropdown', '/tweets(/create)?');
		Menus.addSubMenuItem('topbar', 'tweets', 'List Tweets', 'tweets');
		Menus.addSubMenuItem('topbar', 'tweets', 'New Tweet', 'tweets/create');
	}
]);
'use strict';

//Setting up route
angular.module('tweets').config(['$stateProvider',
	function($stateProvider) {
		// Tweets state routing
		$stateProvider.
		state('listTweets', {
			url: '/tweets',
			templateUrl: 'modules/tweets/views/list-tweets.client.view.html'
		}).
		state('createTweets', {
			url: '/tweets/create',
			templateUrl: 'modules/tweets/views/upload-tweet.client.view.html'
		}).
		state('viewTweet', {
			url: '/tweets/:tweetId',
			templateUrl: 'modules/tweets/views/view-tweet.client.view.html'
		}).
		state('editTweet', {
			url: '/tweets/:tweetId/edit',
			templateUrl: 'modules/tweets/views/edit-tweet.client.view.html'
		});
	}
]);
'use strict';

// Tweets controller
angular.module('tweets').controller('TweetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tweets',
	function($scope, $stateParams, $location, Authentication, Tweets ) {
		$scope.authentication = Authentication;

		// Create new Tweet
		$scope.create = function() {
			// Create new Tweet object
			var tweet = new Tweets ({
				name: this.name
			});

			// Redirect after save
			tweet.$save(function(response) {
				$location.path('tweets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tweet
		$scope.remove = function( tweet ) {
			if ( tweet ) { tweet.$remove();

				for (var i in $scope.tweets ) {
					if ($scope.tweets [i] === tweet ) {
						$scope.tweets.splice(i, 1);
					}
				}
			} else {
				$scope.tweet.$remove(function() {
					$location.path('tweets');
				});
			}
		};

		// Update existing Tweet
		$scope.update = function() {
			var tweet = $scope.tweet ;

			tweet.$update(function() {
				$location.path('tweets/' + tweet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tweets
		$scope.find = function() {
			$scope.tweets = Tweets.query();
		};

		// Find existing Tweet
		$scope.findOne = function() {
			$scope.tweet = Tweets.get({ 
				tweetId: $stateParams.tweetId
			});
		};
	}
]);
'use strict';

//Tweets service used to communicate Tweets REST endpoints
angular.module('tweets').factory('Tweets', ['$resource',
	function($resource) {
		return $resource('api/tweets/:tweetId', { tweetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('units').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Units', 'units', 'dropdown', '/units(/create)?');
		Menus.addSubMenuItem('topbar', 'units', 'List Units', 'units');
		Menus.addSubMenuItem('topbar', 'units', 'New Unit', 'units/create');
	}
]);
'use strict';

//Setting up route
angular.module('units').config(['$stateProvider',
	function($stateProvider) {
		// Units state routing
		$stateProvider.
		state('listUnits', {
			url: '/units',
			templateUrl: 'modules/units/views/list-units.client.view.html'
		}).
		state('createUnit', {
			url: '/units/create',
			templateUrl: 'modules/units/views/create-unit.client.view.html'
		}).
		state('viewUnit', {
			url: '/units/:unitId',
			templateUrl: 'modules/units/views/view-unit.client.view.html'
		}).
		state('editUnit', {
			url: '/units/:unitId/edit',
			templateUrl: 'modules/units/views/edit-unit.client.view.html'
		});
	}
]);
'use strict';

// Units controller
angular.module('units').controller('UnitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Units',
	function($scope, $stateParams, $location, Authentication, Units ) {
		$scope.authentication = Authentication;

		// Create new Unit
		$scope.create = function() {
			// Create new Unit object
			var unit = new Units ({
				name: this.name
			});

			// Redirect after save
			unit.$save(function(response) {
				$location.path('units/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Unit
		$scope.remove = function( unit ) {
			if ( unit ) { unit.$remove();

				for (var i in $scope.units ) {
					if ($scope.units [i] === unit ) {
						$scope.units.splice(i, 1);
					}
				}
			} else {
				$scope.unit.$remove(function() {
					$location.path('units');
				});
			}
		};

		// Update existing Unit
		$scope.update = function() {
			var unit = $scope.unit ;

			unit.$update(function() {
				$location.path('units/' + unit._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Units
		$scope.find = function() {
			$scope.units = Units.query();
		};

		// Find existing Unit
		$scope.findOne = function() {
			$scope.unit = Units.get({ 
				unitId: $stateParams.unitId
			});
		};
	}
]);
'use strict';

//Units service used to communicate Units REST endpoints
angular.module('units').factory('Units', ['$resource',
	function($resource) {
		return $resource('api/units/:unitId', { unitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('workers').config(['$stateProvider',
	function($stateProvider) {
		// Workers state routing
		$stateProvider.
		state('listWorkers', {
			url: '/workers',
			templateUrl: 'modules/workers/views/list-workers.client.view.html'
		}).
		state('createWorker', {
			url: '/workers/create',
			templateUrl: 'modules/workers/views/create-worker.client.view.html'
		}).
		state('viewWorker', {
			url: '/workers/:workerId',
			templateUrl: 'modules/workers/views/view-worker.client.view.html'
		}).
		state('editWorker', {
			url: '/workers/:workerId/edit',
			templateUrl: 'modules/workers/views/edit-worker.client.view.html'
		});
	}
]);
'use strict';

// Workers controller
angular.module('workers').controller('WorkersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workers',
	function($scope, $stateParams, $location, Authentication, Workers ) {
		$scope.authentication = Authentication;

		// Create new Worker
		$scope.create = function() {
			// Create new Worker object
			var worker = new Workers ({
				name: this.name
			});

			// Redirect after save
			worker.$save(function(response) {
				$location.path('workers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Worker
		$scope.remove = function( worker ) {
			if ( worker ) { worker.$remove();

				for (var i in $scope.workers ) {
					if ($scope.workers [i] === worker ) {
						$scope.workers.splice(i, 1);
					}
				}
			} else {
				$scope.worker.$remove(function() {
					$location.path('workers');
				});
			}
		};

		// Update existing Worker
		$scope.update = function() {
			var worker = $scope.worker ;

			worker.$update(function() {
				$location.path('workers/' + worker._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workers
		$scope.find = function() {
			$scope.workers = Workers.query();
		};

		// Find existing Worker
		$scope.findOne = function() {
			$scope.worker = Workers.get({ 
				workerId: $stateParams.workerId
			});
		};
	}
]);
'use strict';

//Workers service used to communicate Workers REST endpoints
angular.module('workers').factory('Workers', ['$resource',
	function($resource) {
		return $resource('api/workers/:workerId', { workerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('workflows').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Workflows', 'workflows', 'dropdown', '/workflows(/create)?');
		Menus.addSubMenuItem('topbar', 'workflows', 'List Workflows', 'workflows');
		Menus.addSubMenuItem('topbar', 'workflows', 'New Workflow', 'workflows/create');
	}
]);
'use strict';

//Setting up route
angular.module('workflows').config(['$stateProvider',
	function($stateProvider) {
		// Workflows state routing
		$stateProvider.
		state('listWorkflows', {
			url: '/workflows',
			templateUrl: 'modules/workflows/views/list-workflows.client.view.html'
		}).
		state('createWorkflow', {
			url: '/workflows/create',
			templateUrl: 'modules/workflows/views/create-workflow.client.view.html'
		}).
		state('viewWorkflow', {
			url: '/workflows/:workflowId',
			templateUrl: 'modules/workflows/views/view-workflow.client.view.html'
		}).
		state('editWorkflow', {
			url: '/workflows/:workflowId/edit',
			templateUrl: 'modules/workflows/views/edit-workflow.client.view.html'
		});
	}
]);
'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsBaseCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
    $scope.authentication = Authentication;

    $scope.logScope = function () {
      console.log($scope);
    };

    // Find a list of Workflows
    $scope.find = function() {
      $scope.workflows = Workflows.query();
    };

    // Find existing Workflow
    $scope.findOne = function() {
      $scope.workflow = Workflows.get({
        workflowId: $stateParams.workflowId
      });
    };
  }
]);
'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsEditCtrl',
  ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
  function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
    $scope.authentication = Authentication;
    $scope.models = ['Tweet'];

    $scope.addStep = function () {
      $scope.workflow.steps.push({});
    };

    $scope.removeStep = function (index) {
      if (index > -1) {
        $scope.workflow.steps.splice(index, 1);
      }
    };

    $scope.loadStepTemplate = function (step) {
      alert('loadStepTemplate');
      step.templateObject = Jobtemplates.get({
        jobtemplateId: step.template
      });
    };

    $scope.prepEdit = function () {
      $scope.loadTemplates($scope.workflow.model);
    };

    $scope.loadTemplates = function (model) {
      $scope.templates = Jobtemplates.query({model:model});
    };

    $scope.loadFields = function (step, templateIndex) {
      step.template = $scope.templates[templateIndex]._id;
      step.queue = [];

      step.requirements = [];
      for(var i=0; i<$scope.templates[templateIndex].fields.length; i++){
        step.requirements.push({
          field: $scope.templates[templateIndex].fields[i]
        });
      }
    };

    $scope.setTemplateIndex = function (step) {
      for(var i=0; i<$scope.templates; i++){
        if ($scope.templates[i]._id == step.template){
          step.templateIndex = i;
        }
      }
    };

    // Update existing Workflow
    $scope.update = function() {
      var workflow = $scope.workflow ;

      workflow.$update(function() {
        $location.path('workflows/' + workflow._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
'use strict';

// Workflows controller
angular.module('workflows').controller('WorkflowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workflows', 'Jobtemplates',
	function($scope, $stateParams, $location, Authentication, Workflows, Jobtemplates) {
		$scope.authentication = Authentication;

    $scope.addStep = function () {
      $scope.steps.push({});
    };
    $scope.logScope = function () {
      console.log($scope);
    };

    $scope.removeStep = function (index) {
      if (index > -1) {
        $scope.steps.splice(index, 1);
      }
    };

    $scope.loadStepTemplate = function (step) {
      step.templateObject = Jobtemplates.get({
        jobtemplateId: step.template
      });
    };

    $scope.prepCreate= function () {
      $scope.steps = [];
      $scope.models = ['Tweet', 'Farts'];
    };

    $scope.prepEdit = function () {
      $scope.models = ['Tweet', 'Farts'];
      $scope.loadTemplates($scope.workflow.model);
    };

    $scope.loadTemplates = function (model) {
      $scope.templates = Jobtemplates.query({model:model});
    };

    $scope.setFields = function (step, templateIndex) {
      step.template = $scope.templates[templateIndex]._id;
      step.queue = [];

      step.requirements = [];
      for(var i=0; i<$scope.templates[templateIndex].fields.length; i++){
        step.requirements.push({
          field: $scope.templates[templateIndex].fields[i]
        });
      }
    };

		// Create new Workflow
		$scope.create = function() {
			// Create new Workflow object
			var workflow = new Workflows ({
				name: this.name,
        active: this.active ? this.active : false,
        apiKey: this.apiKey,
        model: this.model,
        steps: this.steps

			});

      console.log(JSON.stringify(workflow));

			// Redirect after save
			workflow.$save(function(response) {
				$location.path('workflows/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workflow
		$scope.remove = function( workflow ) {
			if ( workflow ) { workflow.$remove();

				for (var i in $scope.workflows ) {
					if ($scope.workflows [i] === workflow ) {
						$scope.workflows.splice(i, 1);
					}
				}
			} else {
				$scope.workflow.$remove(function() {
					$location.path('workflows');
				});
			}
		};

		// Update existing Workflow
		$scope.update = function() {
			var workflow = $scope.workflow ;

			workflow.$update(function() {
				$location.path('workflows/' + workflow._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workflows
		$scope.find = function() {
			$scope.workflows = Workflows.query();
		};

		// Find existing Workflow
		$scope.findOne = function() {
			$scope.workflow = Workflows.get({
				workflowId: $stateParams.workflowId
			});
		};
	}
]);
'use strict';

//Workflows service used to communicate Workflows REST endpoints
angular.module('workflows').factory('Workflows', ['$resource',
	function($resource) {
		return $resource('api/workflows/:workflowId', { workflowId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
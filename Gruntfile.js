module.exports = function(grunt) {
  var packageData = grunt.file.readJSON("package.json");

	grunt.initConfig({
		pkg: packageData,

		eslint: {
			options: {
				config: ".eslintrc",
			},

			plugin: ["js/plugin.js",],
		},

		jshint: {
      plugin: ["js/plugin.js",],
		},

		jscs: {
			options: {
				config: ".jscsrc",
			},

      plugin: ["js/plugin.js",],
		},

		uglify: {
			options: {
				beautify : {
					ascii_only: true
				}
			},

			plugin: {
				src: ["js/*.js"],
				expand: true,
				ext: ".min.js"
			}
		}
	});

	require("load-grunt-tasks")(grunt);

	grunt.registerTask("lint", ["eslint", "jshint", "jscs"]);
	grunt.registerTask("minify", ["uglify"]);
	grunt.registerTask("default", ["lint", "minify"]);
};

module.exports = function(grunt) {
	var packageData = grunt.file.readJSON("package.json");

	grunt.initConfig({
		pkg: packageData,

		version: {
	    deafult: {
	      options: {
	        prefix: 'Version:\\s*'
	      },
	      src: ['wowbrary.php']
	    },
	  },

		phplint: {
				php: ["*.php"],
		},

		eslint: {
			options: {
				config: ".eslintrc",
			},

			plugin: ["js/**/plugin.js",],
		},

		jshint: {
			plugin: ["js/**/plugin.js",],
		},

		jscs: {
			options: {
				config: ".jscsrc",
			},

			plugin: ["js/**/plugin.js",],
		},

		uglify: {
			options: {
				beautify : {
					ascii_only: true
				}
			},

			plugin: {
				src: ["js/**/plugin.js"],
				expand: true,
				ext: ".min.js"
			}
		},

		compress: {
			main: {
				options: {
					archive: 'WowbraryForWordpress.zip',
					mode: 'zip'
				},
				files: [
					{src: ['@(*.php|*.md)'], dest: 'wowbrary'},
					{src: ['js/**/*.min.js'], dest: 'wowbrary'},
					{src: ['js/**/*.css'], dest: 'wowbrary'}
				]
			}
		},

		githooks: {
			all: {
				// Will run the jshint and test:unit tasks at every commit
				'pre-commit': 'default'
			}
		}
	});

	require("load-grunt-tasks")(grunt);

	grunt.registerTask("lint", ["eslint", "jshint", "jscs", "phplint"]);
	grunt.registerTask("minify", ["uglify"]);
	grunt.registerTask("default", ["version", "lint", "minify", "compress"]);
};

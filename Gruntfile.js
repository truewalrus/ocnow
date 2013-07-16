module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Uglify minifies and concatenates all js files for release.
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			release: {
				files: {
					'dist/server.js': [
										'src/server_header.js',
										'src/node/**/*.js',
										'src/database.js',
										'src/server_footer.js'],
					'dist/app/js/build.js': [ 'src/app/js/**/*.js' ]
				}
			}
		},
		//converts less to css in app/production/css/base.css
		less: {
			develop: {
				options: {
					yuicompress: true
				},
				files: {
					'dev/app/css/base.css': [
						'src/app/less/base/*.less',
						'src/app/less/thirdparty/*.less'
					]
				}
			},
			release: {
				options: {
					yuicompress: true
				},
				files: {
					'dist/app/css/base.css': [
						'src/app/less/base/*.less',
						'src/app/less/thirdparty/*.less'
					]
				}
			}
		},
		//runs all angularjs files through jshint for linting purposes
		jshint: {
			all: [
				'Gruntfile.js',
				'src/app/js/**/*.js'
			],
			//options set to make angular agree with jshint a bit more
			options:{
				globalstrict: true,
				jquery: true,
				node: true,
				sub: true,
				/*
				sets some global variable names that jshint will not throw errors for
				without this, it will complain that these global variables are not defined and such
				*/
				globals: {
					"angular":		false,
					"FB":			false,
					"window":		false,
					"document":		false,
					"navigator":	false
				}
			}
		},
		//not currently set up, karma is a testing plugin
		karma: {
			unit: {
				configFile: 'config/karma.conf.js',
				autoWatch: true
			}
		},
		/*
		concatenates all third party js files in app/lib/third-party-js inclusions into one file, app/production/lib/js/third-party.js 
		this allows for easier script inclusion in index.html
		*/
		concat: {
			develop: {
				options: {
					separator: '\n\n'
				},
				files: {
					'dev/server.js': [
										'src/server_header.js',
										'src/node/**/*.js',
										'src/database.js',
										'src/server_footer.js'],
					'dev/app/js/build.js': [ 'src/app/js/**/*.js' ],
					'dev/app/lib/js/third-party.js': ['src/app/lib/thirdparty/*.js'],
					'dev/app/index.html': [ 'src/app/index.html' ]
				}
			},
			release: {
				files: {
					'dist/app/lib/js/third-party.js': ['src/app/lib/thirdparty/*.js'],
					'dist/app/index.html': [ 'src/app/index.html' ],
					'dist/package.json': [ 'package.json' ]
				}
			}
		},
		
		copy: {
			develop: {
				files: [
					{expand: true, flatten: true, src: ['src/app/partials/*'], dest: 'dev/app/partials', filter: 'isFile'},
					{expand: true, flatten: true, src: ['src/app/img/*'], dest: 'dev/app/img', filter: 'isFile'}
				]
			},
			release: {
				files: [
					{expand: true, flatten: true, src: ['src/app/partials/*'], dest: 'dist/app/partials', filter: 'isFile'},
					{expand: true, flatten: true, src: ['src/app/img/*'], dest: 'dist/app/img', filter: 'isFile'}
				]
			}
		}
	});



	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//Load the plugin that provides the "less" task.
	grunt.loadNpmTasks('grunt-contrib-less');

	//Load the plugin that provides the "jsHint" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	//Load the plugin that provides the "karma" task.
	grunt.loadNpmTasks('grunt-karma');

	//Load the plugin that provides the "concatenate" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	//Load the plugin that provides the "copy" task.
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task(s). Add task here if you want it to run every time grunt is run -- compiles to /dev folder
	grunt.registerTask('default', ['less:develop', 'jshint', 'concat:develop', 'copy:develop']);
	
	//grunt release. Compiles to /dist folder for distribution
	grunt.registerTask('release', ['uglify:release', 'less:release', 'concat:release', 'copy:release']);

};
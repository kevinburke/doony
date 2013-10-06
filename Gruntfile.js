module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'doony.js'],
            options: {
                "forin": true,
                "latedef": true,
                "unused": true,
                "trailing": true
            }
        },

        uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                },
                banner: '/* Hulk v0.1 | (c) 2013 Kevin Burke | License: MIT */\n',
                compress: true
            },
            my_target: {
                files: {
                    'hulk.min.js': ['hulk.js']
                }
            }
        },

        qunit: {
            files: ['tests/test.html']
        },

        sass: {
            dist: {
                files: {
                    'css/hulk-all.css': 'scss/hulk-all.scss',
                    'css/hulk.css': 'scss/hulk.scss',
                    'css/hulk-colors.css': 'scss/hulk-colors.scss',
                }
            }
        },

        watch: {
            scripts: {
                files: 'hulk.js',
                tasks: ['jshint', 'uglify']
            },
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
};


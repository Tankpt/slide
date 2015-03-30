module.exports = function (grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        less: {
            options: {
                paths: ["less"],
                compress: false,
                sourceMap: false
            },
            main:{
                files: [{
                    src:"src/less/animate.less",
                    dest:"build/css/animate.css"
                }]
            }
        },
        autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
            options: {
                browsers: ['last 2 versions', 'bb 10']
            },
            no_dest: {
                src: 'build/css/animate.css' // output file
            }
        },
        cssmin: {
            main :{
                files: [{
                  expand: true,
                  cwd: 'build/css/',
                  src: ['*.css'],
                  dest:"build/css/"
                }]
            }
        },
        copy :{
            main:{
                files: [{
                    expand: true,
                    cwd: 'src/js/',
                    src: ['**'],
                    dest: 'build/js/'
                }] 
            }
        },
        uglify : {
            options: {
                report : 'gzip' 
            },
            pro :{
                files: [{
                    expand : true,
                    cwd : 'build/js/',
                    src : '**/**.js',
                    dest : 'build/js/'
                }]
            }
        },
    });
   
    /*deal with css*/
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /*different task*/
    grunt.registerTask('default', ['less:main','autoprefixer','copy:main']);
    grunt.registerTask('pro', ['less:main','autoprefixer','cssmin:main','copy:main','uglify:pro']);
    
};

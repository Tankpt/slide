module.exports = function (grunt) {
    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        less: {
            dev: {
                options: {
                    paths: ["less"],
                    compress: false,
                    sourceMap: false,
                    // 指定 source map 文件名称
                },
                files: [{
                    src:"less/animate.less",
                    dest:"less/build/animate.css"
                }]
            },
            pro :{
                options: {
                    paths: ["<%= pkg.dir.webapp %>/css"],
                    compress: true,
                    sourceMap: false
                },
                files: [{
                    src:"<%= pkg.dir.webapp %>/less/style.less",
                    dest:"build/css/style.css"
                }]
            }
        },
        autoprefixer: { // https://github.com/nDmitry/grunt-autoprefixer
            options: {
                browsers: ['last 2 versions', 'bb 10']
            },
            no_dest: {
                src: 'less/build/animate.css' // output file
            }
        },
        cssmin: {
            dev :{
                files: [{
                  expand: true,
                  cwd: 'build/css/',
                  src: ['*.css', '!*.min.css'],
                  dest:"<%= pkg.dir.target %>/css/"
                }]
            }
        }
    });
   
    /*deal with css*/
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');

    /*different task*/
    grunt.registerTask('default', ['less:dev','autoprefixer']);
    
};

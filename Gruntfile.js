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
                    src:"src/less/tmp.less",
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
   

    var concatAnim = function () {

        var categories = grunt.file.readJSON('config.json'),
            category, files, file, fileArry = [];

        for(category in categories){
            files = categories[category];
            for(file in files){
                if(files.hasOwnProperty(file) && files[file]){
                    fileArry.push("@import 'src/"+category+"/"+file+"';");
                }
            }
        }


        var a = grunt.file.read('src/less/animate.less');
        grunt.file.write('src/less/tmp.less',a.replace('/*import animate*/',fileArry.join('')));
        
        grunt.task.run('less:main');
        grunt.task.run('clean-Animate');
    };

    var cleanAnimateTmp = function(){
        grunt.file.delete('src/less/tmp.less');
    };

    grunt.registerTask('cancat-Animate','concat animate less',concatAnim);
    grunt.registerTask('clean-Animate','clean animate less tmp',cleanAnimateTmp);


    /*deal with css*/
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /*different task  'less:main','autoprefixer','copy:main',*/
    grunt.registerTask('default', ['cancat-Animate','autoprefixer','copy:main']);
    grunt.registerTask('pro', ['cancat-Animate','autoprefixer','cssmin:main','copy:main','uglify:pro']);
    
};

const { src, dest, watch, parallel } = require('gulp');

//CSS
const sass = require('gulp-sass')(require('sass'));

//IMAGES
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');


//Funcion para compilar sass a css
function css(done){
    src('src/scss/**/*.scss')
    .pipe( sass() )
    .pipe( dest('build/css') )

    done();
}

//Funcion para optimizar imágenes
function images(done){
    const options = {
        optimizacionLevel: 3
    }
    src('src/img/**/*.{png,jpg,svg}')
    .pipe( cache( imagemin(options) ) )
    .pipe( dest('build/img') )

    done();
}

//Funcion para crear imágenes webp
function webpVersion(done){
    const options = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg,svg}')
    .pipe( webp(options) )
    .pipe( dest('build/img') )

    done();
}

//Funcion para llamar a sass y poner un watch
function dev(done){
    watch('src/scss/**/*.scss', css);
    done();
}

//Exports
exports.css = css;
exports.images = images;
exports.webpVersion = webpVersion;
exports.dev = parallel(images, webpVersion, dev);
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    //the base directory (absolute path) for resolving the entry option
    context: __dirname,
    //the entry point we created earlier. Note that './' means 
    //your current directory. You don't have to specify the extension  now,
    //because you will specify extensions later in the `resolve` section
    entry: {
        main: './frontend/client/app.js', 
        styles: './assets/scss/app.scss',
    },
    
    output: {
        //where you want your compiled bundle to be stored
        path: path.resolve('./assets/bundles/'), 
        //naming convention webpack should use for your files
        filename: '[name].js', 
    },
    
    plugins: [
        //tells webpack where to store data about your bundles.
        new BundleTracker({filename: './webpack-stats.json'}), 
        new ExtractTextPlugin('[name].css'),
        //makes jQuery available in every module
        // new webpack.ProvidePlugin({ 
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery' 
        // })
    ],
    
    module: {
        loaders: [
            //a regexp that tells webpack use the following loaders on all 
            //.js and .jsx files
            {
                test: /\.jsx?$/, 
                //we definitely don't want babel to transpile all the files in 
                //node_modules. That would take a long time.
                exclude: /node_modules/, 
                loader: 'babel',
            },
            //.css loader
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style',
                    'css'
                )
            },
            //.scss loader
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    'style',
                    'css!sass'
                )
            },
            //.json loader
            {
                test: /\.json$/,
                loader: 'json'
            },
        ]
    },
    
    resolve: {
        //tells webpack where to look for modules
        modulesDirectories: ['client', 'node_modules'],
        //extensions that should be used to resolve modules
        extensions: ['', '.js', '.jsx'] 
    }   
}

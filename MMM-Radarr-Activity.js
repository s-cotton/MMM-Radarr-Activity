/* global Log, Module, moment, config */
/* Magic Mirror
 * Module: MMM-Radarr-Activity
 *
 * By Stephen Cotton
 * MIT Licensed.
 */

//var Module, Log, moment, config, Log, moment, document;

Module.register("MMM-Radarr-Activity", {

     // Default module config.
    defaults: {
        radarrProtocol: "http",
        radarrHost: "localhost",
        radarrPort: "7878",
        radarrAPIKey: "",

        displayType: "list",
        perPage: 15,
        scrollTimeout: 10000,
        scrollEffect: 'scrollHorz',

        updateInterval: 5 * 60 * 1000,

        debug: false,
    },

    components: {
        models: {},
        views: {},    
        collections: {},
    },

    models: [],
    updateViews: [],
    updatesCollection: null,
    mainView: null,

    getHeader: function(){
        return this.data.header;
    },

    // Subclass start method.
    start: function () {
        Log.info("Starting module: " + this.name);
        if (this.config.debug) Log.info(this.name + " config: ", this.config);

        var self = this;
        
        this.setupModels();
        this.setupViews();

        self.getLatestActivity();

        this.updater = setInterval(function(){
            self.getLatestActivity();
        }, this.config.updateInterval );

    },

    setupModels: function(){
        this.components.models.update = Backbone.Model.extend({
            defaults: {
                movieName       : "",
                movieYear       : "",
                movieDescription: "",
                moviePoster     : "",
                movieRating     : "",
                movieRuntime    : "",
                id              : 0,
                type            : "snatched"
            },
            initialize: function(){

            }
        });
    },

    setupViews: function(){
        var self = this;
        this.components.views.singleUpdate = Backbone.View.extend({
            tagName: "div",
            className: "single-activity",
            template: MMMRadarrActivity.Templates.slide,
            initialize: function(){},
            render: function(){
                return this.template( this.model.toJSON() );
            }
        });
        this.components.collections.updates = Backbone.Collection.extend({
            model: self.components.models.update
        })
        this.components.views.updateSlider = Backbone.View.extend({
            tagName: "div",
            className: 'cycle-slideshow movie-slideshow',
            template: MMMRadarrActivity.Templates.main,
            attributes: function(){
                return {
                    'data-cycle-fx' : self.config.scrollEffect,
                    'data-cycle-timeout': self.config.scrollTimeout,
                    'data-cycle-slides': "> div",
                    //'data-cycle-paused': "true",
                }
            },
            initialize: function(){
                var that = this;
                this.updateViews = [];

                this.collection.each(function(update){
                    that.updateViews.push( new self.components.views.singleUpdate({
                        model: update
                    }));
                });
            },
            render: function(){
                var that = this;
                this.$el.empty()
                _(this.updateViews).each(function(updateView){
                    that.$el.append( updateView.render() );
                });

                this.$el.cycle({
                    fx: self.config.scrollEffect,
                    timeout: self.config.scrollTimeout,
                    slides: "> div"
                });
                return this;
            }
        });
    },

    getScripts: function() {
        return [
            'https://code.jquery.com/jquery-2.2.3.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars.runtime.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jquery.cycle2/2.1.6/jquery.cycle2.min.js',
            this.file('templates.js')
        ];
    },

    getStyles: function() {
        return [
            this.file('css/main.css')
        ];
    },

    // Subclass socketNotificationReceived method.
    socketNotificationReceived: function (notification, payload) {
        if (this.config.debug) Log.info(this.name + " received a notification: " + notification, payload);
        var self = this;
    },

    buildApiUrl: function(){
        return this.config.radarrProtocol + "://" + this.config.radarrHost + ':' + this.config.radarrPort 
        + '/api/history?apikey=' + this.config.radarrAPIKey + '&pageSize=' + this.config.perPage;
    },


    getLatestActivity: function(){
        if (this.config.debug) Log.info('Radarr asking for refresh of activity');
        this.refreshActivity();
    },

    refreshActivity: function(){
        var latestActivity;
        latestActivity = [];
        var self = this;

        var activityRequest = new XMLHttpRequest();
        activityRequest.open("GET", this.buildApiUrl(), true);
        activityRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processActivity(JSON.parse(this.response));
                } 
            }
        };
        activityRequest.send();
    },

    processActivity: function(data){
        if( this.config.debug) Log.info( data );
        this.activity = data.records;

        this.models = [];

        for( var record_i in data.records ){
            var thisDataRecord = data.records[ record_i ];
            if( thisDataRecord.eventType != "downloadFolderImported" ) continue;
            if( this.config.debug) Log.info(thisDataRecord);
            var newUpdateRecord = new this.components.models.update( this.processActivityRecord( thisDataRecord ) );
            this.models.push( newUpdateRecord );
        }
        this.updateDom();
        //this.sendSocketNotification("ACTIVITY_LOADED", data);
    },

    processActivityRecord: function(record){
        
        return {
            movieName       : record.movie.title,
            movieYear       : record.movie.year,
            movieDescription: record.movie.overview,
            moviePoster     : this.getMoviePoster( record.movie.id ),
            movieRating     : record.movie.ratings.value,
            movieRuntime    : this.formatMovieRuntime(record.movie.runtime),
            id              : record.id,
            type            : record.eventType
        };
    },

    formatMovieRuntime: function(minutes){
        var runtime = moment.duration( minutes, 'minutes' );
        var rHours = Math.floor(runtime.asHours());
        var rMinutes = Math.floor(runtime.asMinutes());
        if( rHours > 0 ){
            var toReturn = rHours + 'h ';
            var remMinutes = rMinutes - (rHours * 60);
            toReturn = toReturn + remMinutes + 'm';
            return toReturn;
        } else {
            return rMinutes + ' minutes';
        }
        return number < 10 ? '0' + number : number;
    },

    getMoviePoster: function(movieId){
        return this.config.radarrProtocol + "://" + this.config.radarrHost + ':' + this.config.radarrPort 
            + '/api/MediaCover/' + movieId + '/poster-250.jpg?apikey=' + this.config.radarrAPIKey;
    },

    // Override dom generator.
    getDom: function () {
        var wrapper, self;

        var updatesCollection = new this.components.collections.updates( this.models );
        var updatesView = new this.components.views.updateSlider({
            collection: updatesCollection
        });

        return updatesView.render().el;

    },
});
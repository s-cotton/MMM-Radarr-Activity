this["MMMRadarrActivity"] = this["MMMRadarrActivity"] || {};
this["MMMRadarrActivity"]["Templates"] = this["MMMRadarrActivity"]["Templates"] || {};

this["MMMRadarrActivity"]["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"cycle-slideshow movie-slideshow\" \n    data-cycle-fx=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.scrollEffect : stack1), depth0))
    + "\" \n    data-cycle-timeout=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.scrollTimeout : stack1), depth0))
    + "\"\n    data-cycle-slides=\"> div\"\n    >\n    \n</div>";
},"useData":true});

this["MMMRadarrActivity"]["Templates"]["slide"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "	<div class=\"row movie-slide\">\n		<div class=\"slide-image\">\n			<img src=\""
    + alias4(((helper = (helper = helpers.moviePoster || (depth0 != null ? depth0.moviePoster : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"moviePoster","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias4(((helper = (helper = helpers.movieName || (depth0 != null ? depth0.movieName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieName","hash":{},"data":data}) : helper)))
    + "\" />\n		</div>\n		<div class=\"slide-copy\">\n			<h4 class=\"bright\">\n				<span class=\"title\">"
    + alias4(((helper = (helper = helpers.movieName || (depth0 != null ? depth0.movieName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieName","hash":{},"data":data}) : helper)))
    + "</span>\n				<span class=\"info\">"
    + alias4(((helper = (helper = helpers.movieYear || (depth0 != null ? depth0.movieYear : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieYear","hash":{},"data":data}) : helper)))
    + "</span>\n			</h4>\n			<h5>\n				<span class=\"title\"><span class=\"fa fa-star\"></span> "
    + alias4(((helper = (helper = helpers.movieRating || (depth0 != null ? depth0.movieRating : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieRating","hash":{},"data":data}) : helper)))
    + "/10</span>\n				<span class=\"info\">"
    + alias4(((helper = (helper = helpers.movieRuntime || (depth0 != null ? depth0.movieRuntime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieRuntime","hash":{},"data":data}) : helper)))
    + " <span class=\"fa fa-clock-o\"></span></span>\n			</h5>\n			<div class=\"overview-box\">\n				<p class=\"light\">"
    + alias4(((helper = (helper = helpers.movieDescription || (depth0 != null ? depth0.movieDescription : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"movieDescription","hash":{},"data":data}) : helper)))
    + "</p>\n				<p class=\"read-more\">&nbsp;</p>\n			</div>\n		</div>\n	</div>\n";
},"useData":true});
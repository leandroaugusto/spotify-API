(function(){
			
	var obj;

	$.ajax({
		url: '/app_token',
		data: {
			'obj': obj
		}
    }).done(function(data) {
		var el = data.obj.body,
			songs = [],
			curSong = 0,
			audio = null,
			player = createPlayer(),
			playlist = null,
			totalTracks = el.tracks.items.length;

        // Show playlist name and length - Show songs name
        $('.playlist_name').text(el.name);
        $('.playlist_length').text(totalTracks + ' músicas');

        for (var i = 0; i < totalTracks; i++) {
        	songs.push(el.tracks.items[i].track);
        	
        	playlist = filterSongs(songs);
            showCurSong(false);
            // callback(player);

        	$('.playlist_show_tracks').append('<li data-song="'+el.tracks.items[i].track.id+'"><span>'+el.tracks.items[i].track.name+'</span></li>');
        };

        function filterSongs(songs) {
	        var out = [];

	        function isGoodSong(song) {
	            return song.preview_url != null;
	        }

	        songs.forEach(function(song) {
	            if (isGoodSong(song)) {
	                out.push(song);
	            }
	        });

	        return out;
	    }

        function showSong(song, autoplay) {
	        $(player).find(".sp-album-art").attr('src', getBestImage(song.album.images, 300).url);
	        $(player).find(".sp-title").text(song.name);
	        $(player).find(".sp-artist").text(song.artists[0].name);
	        audio.attr('src', song.preview_url);

	        // Synchronize current song with list name
	        var listSong = $('.playlist_show_tracks li'),
	        	listHeight = listSong.parent().innerHeight();

	        listSong.removeClass('playing');
	        $('.playlist_show_tracks li[data-song="'+song.id+'"]').addClass('playing');

	        setTimeout(function(){
		        var actualSong = $('.playlist_show_tracks li.playing'),
		        	actualSongTop = actualSong.position().top;

		        console.log(actualSongTop, listHeight);

		        if ( actualSongTop >= listHeight ) {
		        	listSong.parent().scrollTop( actualSongTop-listHeight );
		        	// actualSongTop-(listHeight+listSong.innerHeight())
		        };
		    }, 1000);

	        // console.log('showSong', song);

	        if (autoplay) { 
	            audio.get(0).play();
	        }
	    }

	    function getBestImage(images, maxWidth) {
	        var best = images[0];
	        images.reverse().forEach(
	            function(image) {
	                if (image.width == maxWidth) {
	                    best = image;
	                }
	            }
	        );
	        return best;
	    }

        function showCurSong(autoplay) {
	        showSong(playlist[curSong], autoplay);
	        // console.log('showCurSong', playlist);
	    }

        function nextSong() {
	        if (curSong < playlist.length - 1) {
	            curSong++;
	            showCurSong(true);
	        }
	    }

	    function prevSong() {
	        if (curSong > 0) {
	            curSong--;
	            showCurSong(true);
	        }
	    }

	    function togglePausePlay() {
	        console.log('tpp', audio.get(0).paused);
	        if (audio.get(0).paused) {
	            audio.get(0).play();
	        } else {
	            audio.get(0).pause();
	        }
	    }

        function createPlayer() {
	        var main = $("<div class='sp-player'>");
	        var img = $("<img class='sp-album-art'>");
	        var info  = $("<div class='sp-info'>");
	        var title = $("<div class='sp-title'>");
	        var artist = $("<div class='sp-artist'>");
	        var controls = $("<div class='btn-group sp-controls'>");

	        var next = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-forward"></span></button>');
	        var prev = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-backward"></span></button>');
	        var pausePlay = $('<button class="btn btn-primary btn-sm" type="button"><span class="glyphicon glyphicon-play"></span></button>');


	        audio = $("<audio>");
	        audio.on('pause', function() {
	            var pp = pausePlay.find("span");
	            pp.removeClass('glyphicon-pause');
	            pp.addClass('glyphicon-play');
	        });

	        audio.on('play', function() {
	            var pp = pausePlay.find("span");
	            pp.addClass('glyphicon-pause');
	            pp.removeClass('glyphicon-play');
	        });

	        audio.on('ended', function() {
	            console.log('ended');
	            nextSong();
	        });

	        next.on('click', function() {
	            nextSong();
	        });

	        pausePlay.on('click', function() {
	            togglePausePlay();
	        });

	        prev.on('click', function() {
	            prevSong();
	        });


	        info.append(title);
	        info.append(artist);

	        controls.append(prev);
	        controls.append(pausePlay);
	        controls.append(next);

	        main.append(img);
	        main.append(info);
	        main.append(controls);
	    
	        main.bind('destroyed', function() {
	            console.log('player destroyed');
	            audio.pause();
	        });
	        return main;
	    }

	    $('#all_results').append(player);

	    (function($){
		  $.event.special.destroyed = {
		    remove: function(o) {
		      if (o.handler) {
		        o.handler()
		      }
		    }
		  }
		})(jQuery);
    });

})();
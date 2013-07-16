(function($, Backbone) {
	
    if (typeof this.console === 'undefined') {
        this.console = {log: function() {}};
    }
    if (typeof this.console.error === 'undefined') {
        this.console.error = this.console.log;
    }

	var Notification = Backbone.View.extend( {
        tagName: 'div',
        className: 'im-event-notification topBar messages',
        events: {
            'click a.closer': 'close'
        },
        title: 'Success:',
        close: function() {
            var self = this;
            this.$el.hide('slow', function() {self.remove()});
        },
        render: function() {
            var self = this, remAfter = self.options.autoRemove;
            this.$el.append('<a class="closer" href="#">Hide</a>');
            this.$el.append('<p><span><b>' + this.title + '</b></span></p>');
            
            this.appendContent();
            this.$el.prependTo('#pagecontentcontainer');
            
            if (remAfter != null) {
                _.delay(function() {self.close();}, (remAfter === true) ? 3000 : remAfter);
            }
            return this;
        },
        appendContent: function() {
        	 this.$el.append(this.options.message);
        },
        initialize: function() {
            _.bindAll(this);
        }
    } );
	
	var FailureNotification = Notification.extend( {
        className: "im-event-notification topBar errors",
        title: 'Oops!'
    } );

    /**
     * Static factory method for notifying of messages.
     * @param {string} message The message to show to the user.
     */
    Notification.notify = function(message) {
        new Notification({message: message}).render();
    }

    FailureNotification.UNKNOWN_ERROR = "Unknown error";

    var parseError = function(error) {
      if (!error) return FailureNotification.UNKNOWN_ERROR;
      if (typeof error === 'string') return error;
      if (error.responseText) {
        try {
          return JSON.parse(error.responseText).error;
        } catch (ex) {
          return error;
        }
      } else {
        return error;
      }
    };

    /**
     * Static factory method for handling errors.
     * In addition to showing the user a notification, the message
     * will also be logged to the console if one is available.
     * @param {?string} error The message to show to the user.
     */
    FailureNotification.notify = function(error) {
        var message = parseError(error);
        if (console) {
            (console.error || console.log).call(console, message, arguments);
        }
        new FailureNotification({message: message}).render();
    };
	
	this.Notification = Notification;
	this.FailureNotification = FailureNotification;
	
}).call(window, jQuery, Backbone);

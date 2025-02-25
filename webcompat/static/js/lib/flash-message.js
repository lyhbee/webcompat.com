/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Flash messages can be triggered form anywhere in the application like so:

eventBus.trigger('flash:info', {message: 'hi', timeout: 1000});
eventBus.trigger('flash:error', {message: 'hi', timeout: 1000});

`opts.message` is the text to display.
`opts.timeout` (optional) is the length of time before fading the message out.
                          Default is 3 seconds
*/

import Backbone from "Backbone";
import thanksTemplate from "templates/issue/thanks.jst";
import bqSuccessTemplate from "templates/bq-reports/success.jst";
import bqErrorTemplate from "templates/bq-reports/error.jst";

var wcEvents = _.extend({}, Backbone.Events);

var FlashMessageView = Backbone.View.extend({
  tagName: "div",
  className: "notification-bar js-flashmessage",
  initialize: function () {
    wcEvents.on("flash:error", _.bind(this.showError, this));
    wcEvents.on("flash:info", _.bind(this.show, this));
    wcEvents.on("flash:notimeout", _.bind(this.showForever, this));
    wcEvents.on("flash:thanks", _.bind(this.showThanks, this));
    wcEvents.on("flash:bqreport", _.bind(this.showBQMessage, this));
  },
  render: function (message) {
    this.$el.html(message).addClass("is-active").appendTo("body").show();

    return this;
  },
  show: function (opts) {
    var timeout = opts.timeout || 4000;
    var message = opts.message;

    this.$el.addClass("notification-information");
    this.render(message);
    setTimeout(_.bind(this.hide, this), timeout);
  },
  showError: function (data) {
    this.$el.addClass("is-error notification-alert");
    this.show(data);
  },
  showForever: function (opts) {
    var message = opts.message;
    this.$el.addClass("notification-information");
    this.render(message);
  },
  showThanks: function (opts) {
    this.$el.addClass("is-active notification-thanks grid-cell x3");
    this.$el
      .html(thanksTemplate({ number: opts.message }))
      .insertBefore(".js-Issue")
      .show();
  },
  showBQMessage: function (opts) {
    let messageTemplate = bqErrorTemplate;
    if (opts.message === "success") {
      messageTemplate = bqSuccessTemplate;
    }
    this.$el.addClass("is-active notification-thanks grid-cell x3");
    this.$el.html(messageTemplate()).insertBefore(".js-Issue").show();
  },
  hide: function () {
    this.$el.fadeOut();
  },
});

new FlashMessageView();

export { wcEvents };

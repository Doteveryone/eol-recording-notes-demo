var RecordingButton = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change:recording', this.render);
  },

  events: {
    'click ': 'toggle'
  },

  toggle: function(event) {
    event.preventDefault();
    this.model.toggleRecording();
  },

  render: function() {
    var recording = this.model.get('recording');

    if (recording) {
      this.$el.addClass('recording');
    } else {
      this.$el.removeClass('recording');
    }
  }
});

var VoiceApp = Backbone.Model.extend({
  initialize: function() {
    this.questions = [
      'Are you adding notes about your visit with Lucy?',
      'Are there any urgent changes that others need notifying about?',
      'How was Lucy?',
      'The physiotherapist wanted to know how she was getting on with her new crutches.',
      'Is there anything else to add?',
      'Your notes have been saved. Recording stopped.'
    ],
    this.setUpRecordingButton();
    this.set('question', 0);
    this.audio = new Audio();
    this.audio.src = 'assets/audio/q0.wav';
    this.audio.play();
  },

  setUpRecordingButton: function() {
    var buttonEl = document.getElementsByClassName('speak')[0];

    new RecordingButton({ model: this, el: buttonEl });
  },

  toggleRecording: function() {
    var recording = this.get('recording');

    if (recording) {
      this.unset('recording');
      this.advanceQuestion();
    } else {
      this.set('recording', true);
    }

  },

  advanceQuestion: function() {
    var question = this.get('question') + 1;
    this.set('question', question);

    this.audio.src = 'assets/audio/q' + question + '.wav';
    this.audio.play();

    if (this.get('question') === this.questions.length - 1) {
      $('.record-button-label .waiting').text('Saved')
    }
  }

});

var VoiceAppView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  render: function() {
    $('.question').text(this.model.questions[this.model.get('question')]);

    if (this.model.get('question') > 0) {
      $('.second-intro').fadeOut(200, function() {
        $('.intro').fadeIn(200);
      });
    }
  }
});

var voiceApp = new VoiceApp();
var voiceAppView = new VoiceAppView({ model: voiceApp });


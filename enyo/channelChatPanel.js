enyo.kind({
	name: 'wirc.ChannelChatPanel',
	kind: 'SlidingView',
	
	/*peekWidth: 64,*/
	dragAnywhere: false,
	
	published: {
		channel: false,
	},
	
	components: [
	
		/*{kind: 'ApplicationEvents', onResize:'doResize',
			onWindowHidden: 'windowHiddenHandler', onWindowShown: 'windowShownHandler',
			onWindowActivated: 'windowActivatedHandler', onWindowDeactivated: 'windowDeactivatedHandler'},*/
	
		{name: 'header', kind: 'Header', components: [
			{name: 'headerText', content: 'asdf', flex: 1},
			//{kind: 'Button', caption: 'o', onclick: 'test', className: 'close'},
			{kind: 'Button', caption: 'X', onclick: 'closeButton', className: 'enyo-button-negative close'},
		]},
		{kind: 'HeaderShadow'},
		
		{name: 'messages', kind: 'FlyweightList', height: '100%', bottomUp: true, onSetupRow: 'setupMessage', className: 'messages', components: [
			{name: 'message', kind: 'wirc.MessageItem'}
	    ]},
		
		{kind: 'ToolbarShadow'},
		{name: 'toolbar', kind: 'Toolbar', className: 'enyo-toolbar-light toolbar message-toolbar', components: [
			{kind: 'GrabButton'},
			{name: 'input', kind: 'wirc.MessageRichText', flex: 1, onkeydown: 'keyDown'},
		]},
		
	],
	
	initComponents: function() {
	    this.inherited(arguments);
		this.addClass('messages-panel');
		this.messageListener = enyo.bind(this, 'queueRefresh');
		enyo.application.e.listen('channel-message' + this.channel.setup.name, this.messageListener);
	},
	
	destroy: function() {
		enyo.application.e.stopListening('channel-message' + this.channel.setup.name, this.messageListener);
		return this.inherited(arguments);
	},
	
	rendered: function() {
	    this.inherited(arguments);
		this.$.headerText.setContent(this.channel.setup.name);
	},
	
	
	queueRefresh: function() {
		enyo.job('refreshMessages', enyo.bind(this, 'refreshMessages'), 5);
	},
	refreshMessages: function() {
		this.$.messages.refresh();
	},
	
	resizeHandler: function() { // application resize (orientation change/keyboard pop)
		this.inherited(arguments);
		this.queueRefresh();
	},
	doResize: function() { // pane resize
		this.queueRefresh();
	},
	
	test: function() {
		this.log();	
		for (var x = 0; x < 100; x++) {
			this.channel.newMessage('status', false, 'test - '+x);
		}
		this.queueRefresh();
	},
	
	setupMessage: function(inSender, inIndex) {
		if (this.channel.messages[inIndex]) {
			this.channel.messages[inIndex].setupItem(this.$.message);
			return true;
		}
		return false;
	},
	
	keyDown: function(inSender, inEvent) {
		if (inEvent.keyCode === 13) {
			inEvent.preventDefault();
			var text = this.$.input.getValue();
			if (text) this.channel.newCommand(text);
			this.$.input.setValue('');
		}
	},
	
	closeButton: function() {
		this.owner.destroySecondary(true);
	},
	
});